/**
 * Script de importación de datos de Firebase a PostgreSQL
 *
 * Este script lee el archivo JSON exportado de Firebase
 * e importa los datos a PostgreSQL usando Prisma.
 *
 * Uso:
 * 1. Primero ejecuta: npx prisma db push (para crear las tablas)
 * 2. Luego ejecuta: npx ts-node scripts/import-to-postgres.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ExportData {
  exportedAt: string;
  collections: Record<string, any[]>;
  singletons: Record<string, any>;
}

async function importResultados(data: any[]) {
  console.log(`  Importando ${data.length} resultados...`);
  for (const item of data) {
    await prisma.resultado.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        prompt: item.prompt,
        imageUrl: item.imageUrl,
        imageUrl2: item.imageUrl2 || null,
        imageUrl3: item.imageUrl3 || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        prompt: item.prompt,
        imageUrl: item.imageUrl,
        imageUrl2: item.imageUrl2 || null,
        imageUrl3: item.imageUrl3 || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ Resultados importados`);
}

async function importProjects(data: any[]) {
  console.log(`  Importando ${data.length} projects...`);
  for (const item of data) {
    await prisma.project.upsert({
      where: { id: item.id },
      update: {
        title: item.title || null,
        description: item.description || null,
        imageUrl: item.imageUrl || null,
        imageHint: item.imageHint || null,
        url: item.url || null,
        type: item.type || 'project',
        htmlContent: item.htmlContent || null,
        categoryId: item.categoryId || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title || null,
        description: item.description || null,
        imageUrl: item.imageUrl || null,
        imageHint: item.imageHint || null,
        url: item.url || null,
        type: item.type || 'project',
        htmlContent: item.htmlContent || null,
        categoryId: item.categoryId || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ Projects importados`);
}

async function importImages(data: any[]) {
  console.log(`  Importando ${data.length} images...`);
  for (const item of data) {
    await prisma.image.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        url: item.url,
        storagePath: item.storagePath || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        name: item.name,
        url: item.url,
        storagePath: item.storagePath || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ Images importados`);
}

async function importTools(data: any[]) {
  console.log(`  Importando ${data.length} tools...`);
  for (const item of data) {
    await prisma.tool.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description || null,
        imageUrl: item.imageUrl || null,
        url: item.url || null,
        price: item.price || null,
        paymentDay: item.paymentDay || null,
        isPaid: item.isPaid || false,
        categoryIds: item.categoryIds || [],
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        description: item.description || null,
        imageUrl: item.imageUrl || null,
        url: item.url || null,
        price: item.price || null,
        paymentDay: item.paymentDay || null,
        isPaid: item.isPaid || false,
        categoryIds: item.categoryIds || [],
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ Tools importados`);
}

async function importToolCategories(data: any[]) {
  console.log(`  Importando ${data.length} toolCategories...`);
  for (const item of data) {
    await prisma.toolCategory.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        name: item.name,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ ToolCategories importados`);
}

async function importProtocols(data: any[]) {
  console.log(`  Importando ${data.length} protocols...`);
  for (const item of data) {
    // Primero crear el protocolo
    await prisma.protocol.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });

    // Luego crear los pasos
    if (item.steps && Array.isArray(item.steps)) {
      // Eliminar pasos existentes
      await prisma.protocolStep.deleteMany({ where: { protocolId: item.id } });

      for (let i = 0; i < item.steps.length; i++) {
        const step = item.steps[i];
        await prisma.protocolStep.create({
          data: {
            title: step.title || null,
            description: step.description || null,
            imageUrl: step.imageUrl || null,
            order: i,
            protocolId: item.id,
          },
        });
      }
    }
  }
  console.log(`  ✓ Protocols importados`);
}

async function importTeamItems(data: any[]) {
  console.log(`  Importando ${data.length} teamItems...`);
  for (const item of data) {
    await prisma.teamItem.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        position: item.position,
        bio: item.bio || null,
        imageUrl: item.imageUrl || null,
        email: item.email || null,
        linkedinUrl: item.linkedinUrl || null,
        portfolioUrl: item.portfolioUrl || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        name: item.name,
        position: item.position,
        bio: item.bio || null,
        imageUrl: item.imageUrl || null,
        email: item.email || null,
        linkedinUrl: item.linkedinUrl || null,
        portfolioUrl: item.portfolioUrl || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ TeamItems importados`);
}

async function importSajorItems(data: any[]) {
  console.log(`  Importando ${data.length} sajorItems...`);
  for (const item of data) {
    await prisma.sajorItem.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        url: item.url || null,
        description: item.description || null,
        notes: item.notes || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        url: item.url || null,
        description: item.description || null,
        notes: item.notes || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ SajorItems importados`);
}

async function importAprendePages(data: any[]) {
  console.log(`  Importando ${data.length} aprendePages...`);
  for (const item of data) {
    // Crear la página principal
    await prisma.aprendePage.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        code: item.code,
        htmlText: item.htmlText || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        heroEnabled: item.heroEnabled || false,
        heroTitle: item.heroTitle || null,
        heroDescription: item.heroDescription || null,
        heroCtaText: item.heroCtaText || null,
        heroCtaUrl: item.heroCtaUrl || null,
        heroImageUrl: item.heroImageUrl || null,
        featureSectionEnabled: item.featureSectionEnabled || false,
        featureSectionTitle: item.featureSectionTitle || null,
        featureSectionDescription: item.featureSectionDescription || null,
        featureSectionCtaText: item.featureSectionCtaText || null,
        featureSectionCtaUrl: item.featureSectionCtaUrl || null,
        stepsSectionEnabled: item.stepsSectionEnabled || false,
        iconListSectionEnabled: item.iconListSectionEnabled || false,
        iconListSectionDescription: item.iconListSectionDescription || null,
        mediaGridSectionEnabled: item.mediaGridSectionEnabled || false,
        pricingSectionEnabled: item.pricingSectionEnabled || false,
        fullWidthMediaSectionEnabled: item.fullWidthMediaSectionEnabled || false,
        fullWidthMediaSectionTitle: item.fullWidthMediaSectionTitle || null,
        fullWidthMediaSectionDescription: item.fullWidthMediaSectionDescription || null,
        fullWidthMediaSectionImageUrl: item.fullWidthMediaSectionImageUrl || null,
        fullWidthMediaSectionVideoUrl: item.fullWidthMediaSectionVideoUrl || null,
        faqSectionEnabled: item.faqSectionEnabled || false,
        openQuestionnaireEnabled: item.openQuestionnaireEnabled || false,
        openQuestionnaireTitle: item.openQuestionnaireTitle || null,
        checkboxQuestionnaireEnabled: item.checkboxQuestionnaireEnabled || false,
        checkboxQuestionnaireTitle: item.checkboxQuestionnaireTitle || null,
        contactFormEnabled: item.contactFormEnabled || false,
        contactFormTitle: item.contactFormTitle || null,
        contactFormShowName: item.contactFormShowName || false,
        contactFormShowPhone: item.contactFormShowPhone || false,
        contactFormShowEmail: item.contactFormShowEmail || false,
        contactFormShowTextMessage: item.contactFormShowTextMessage || false,
        contactFormShowInstagram: item.contactFormShowInstagram || false,
        contactFormShowFacebook: item.contactFormShowFacebook || false,
        contactFormShowLinkedIn: item.contactFormShowLinkedIn || false,
        contactFormShowTikTok: item.contactFormShowTikTok || false,
        ctaSectionEnabled: item.ctaSectionEnabled || false,
        ctaSectionTitle: item.ctaSectionTitle || null,
        ctaSectionDescription: item.ctaSectionDescription || null,
        ctaSectionButtonText: item.ctaSectionButtonText || null,
        ctaSectionButtonUrl: item.ctaSectionButtonUrl || null,
      },
      create: {
        id: item.id,
        title: item.title,
        code: item.code,
        htmlText: item.htmlText || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        heroEnabled: item.heroEnabled || false,
        heroTitle: item.heroTitle || null,
        heroDescription: item.heroDescription || null,
        heroCtaText: item.heroCtaText || null,
        heroCtaUrl: item.heroCtaUrl || null,
        heroImageUrl: item.heroImageUrl || null,
        featureSectionEnabled: item.featureSectionEnabled || false,
        featureSectionTitle: item.featureSectionTitle || null,
        featureSectionDescription: item.featureSectionDescription || null,
        featureSectionCtaText: item.featureSectionCtaText || null,
        featureSectionCtaUrl: item.featureSectionCtaUrl || null,
        stepsSectionEnabled: item.stepsSectionEnabled || false,
        iconListSectionEnabled: item.iconListSectionEnabled || false,
        iconListSectionDescription: item.iconListSectionDescription || null,
        mediaGridSectionEnabled: item.mediaGridSectionEnabled || false,
        pricingSectionEnabled: item.pricingSectionEnabled || false,
        fullWidthMediaSectionEnabled: item.fullWidthMediaSectionEnabled || false,
        fullWidthMediaSectionTitle: item.fullWidthMediaSectionTitle || null,
        fullWidthMediaSectionDescription: item.fullWidthMediaSectionDescription || null,
        fullWidthMediaSectionImageUrl: item.fullWidthMediaSectionImageUrl || null,
        fullWidthMediaSectionVideoUrl: item.fullWidthMediaSectionVideoUrl || null,
        faqSectionEnabled: item.faqSectionEnabled || false,
        openQuestionnaireEnabled: item.openQuestionnaireEnabled || false,
        openQuestionnaireTitle: item.openQuestionnaireTitle || null,
        checkboxQuestionnaireEnabled: item.checkboxQuestionnaireEnabled || false,
        checkboxQuestionnaireTitle: item.checkboxQuestionnaireTitle || null,
        contactFormEnabled: item.contactFormEnabled || false,
        contactFormTitle: item.contactFormTitle || null,
        contactFormShowName: item.contactFormShowName || false,
        contactFormShowPhone: item.contactFormShowPhone || false,
        contactFormShowEmail: item.contactFormShowEmail || false,
        contactFormShowTextMessage: item.contactFormShowTextMessage || false,
        contactFormShowInstagram: item.contactFormShowInstagram || false,
        contactFormShowFacebook: item.contactFormShowFacebook || false,
        contactFormShowLinkedIn: item.contactFormShowLinkedIn || false,
        contactFormShowTikTok: item.contactFormShowTikTok || false,
        ctaSectionEnabled: item.ctaSectionEnabled || false,
        ctaSectionTitle: item.ctaSectionTitle || null,
        ctaSectionDescription: item.ctaSectionDescription || null,
        ctaSectionButtonText: item.ctaSectionButtonText || null,
        ctaSectionButtonUrl: item.ctaSectionButtonUrl || null,
      },
    });

    // Importar arrays relacionados
    // Feature Cards
    if (item.featureSectionCards && Array.isArray(item.featureSectionCards)) {
      await prisma.aprendeFeatureCard.deleteMany({ where: { aprendePageId: item.id } });
      for (let i = 0; i < item.featureSectionCards.length; i++) {
        const card = item.featureSectionCards[i];
        await prisma.aprendeFeatureCard.create({
          data: {
            icon: card.icon || null,
            title: card.title || null,
            description: card.description || null,
            order: i,
            aprendePageId: item.id,
          },
        });
      }
    }

    // Steps Items
    if (item.stepsSectionItems && Array.isArray(item.stepsSectionItems)) {
      await prisma.aprendeStepItem.deleteMany({ where: { aprendePageId: item.id } });
      for (let i = 0; i < item.stepsSectionItems.length; i++) {
        const step = item.stepsSectionItems[i];
        await prisma.aprendeStepItem.create({
          data: {
            title: step.title || null,
            description: step.description || null,
            imageUrl: step.imageUrl || null,
            order: i,
            aprendePageId: item.id,
          },
        });
      }
    }

    // Icon List Items
    if (item.iconListSectionItems && Array.isArray(item.iconListSectionItems)) {
      await prisma.aprendeIconListItem.deleteMany({ where: { aprendePageId: item.id } });
      for (let i = 0; i < item.iconListSectionItems.length; i++) {
        const iconItem = item.iconListSectionItems[i];
        await prisma.aprendeIconListItem.create({
          data: {
            icon: iconItem.icon || null,
            title: iconItem.title || null,
            order: i,
            aprendePageId: item.id,
          },
        });
      }
    }

    // Media Grid Cards
    if (item.mediaGridSectionCards && Array.isArray(item.mediaGridSectionCards)) {
      await prisma.aprendeMediaGridCard.deleteMany({ where: { aprendePageId: item.id } });
      for (let i = 0; i < item.mediaGridSectionCards.length; i++) {
        const card = item.mediaGridSectionCards[i];
        await prisma.aprendeMediaGridCard.create({
          data: {
            title: card.title || null,
            description: card.description || null,
            imageUrl: card.imageUrl || null,
            videoUrl: card.videoUrl || null,
            ctaText: card.ctaText || null,
            ctaUrl: card.ctaUrl || null,
            order: i,
            aprendePageId: item.id,
          },
        });
      }
    }

    // Pricing Cards
    if (item.pricingSectionCards && Array.isArray(item.pricingSectionCards)) {
      await prisma.aprendePricingCard.deleteMany({ where: { aprendePageId: item.id } });
      for (let i = 0; i < item.pricingSectionCards.length; i++) {
        const card = item.pricingSectionCards[i];
        await prisma.aprendePricingCard.create({
          data: {
            htmlContent: card.htmlContent || '',
            order: i,
            aprendePageId: item.id,
          },
        });
      }
    }

    // FAQ Items
    if (item.faqSectionItems && Array.isArray(item.faqSectionItems)) {
      await prisma.aprendeFaqItem.deleteMany({ where: { aprendePageId: item.id } });
      for (let i = 0; i < item.faqSectionItems.length; i++) {
        const faq = item.faqSectionItems[i];
        await prisma.aprendeFaqItem.create({
          data: {
            question: faq.question || '',
            answer: faq.answer || '',
            order: i,
            aprendePageId: item.id,
          },
        });
      }
    }

    // Open Questions
    if (item.openQuestionnaireItems && Array.isArray(item.openQuestionnaireItems)) {
      await prisma.aprendeOpenQuestion.deleteMany({ where: { aprendePageId: item.id } });
      for (let i = 0; i < item.openQuestionnaireItems.length; i++) {
        const q = item.openQuestionnaireItems[i];
        await prisma.aprendeOpenQuestion.create({
          data: {
            question: q.question || '',
            order: i,
            aprendePageId: item.id,
          },
        });
      }
    }

    // Checkbox Questions
    if (item.checkboxQuestionnaireItems && Array.isArray(item.checkboxQuestionnaireItems)) {
      await prisma.aprendeCheckboxQuestion.deleteMany({ where: { aprendePageId: item.id } });
      for (let i = 0; i < item.checkboxQuestionnaireItems.length; i++) {
        const q = item.checkboxQuestionnaireItems[i];
        const createdQuestion = await prisma.aprendeCheckboxQuestion.create({
          data: {
            question: q.question || '',
            order: i,
            aprendePageId: item.id,
          },
        });

        // Crear las opciones
        if (q.options && Array.isArray(q.options)) {
          for (let j = 0; j < q.options.length; j++) {
            const opt = q.options[j];
            await prisma.aprendeCheckboxQuestionOption.create({
              data: {
                label: opt.label || '',
                order: j,
                questionId: createdQuestion.id,
              },
            });
          }
        }
      }
    }
  }
  console.log(`  ✓ AprendePages importados`);
}

async function importFormations(data: any[]) {
  console.log(`  Importando ${data.length} formations...`);
  for (const item of data) {
    await prisma.formation.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description,
        url: item.url || null,
        tag: item.tag || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        description: item.description,
        url: item.url || null,
        tag: item.tag || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ Formations importados`);
}

async function importN8NServers(data: any[]) {
  console.log(`  Importando ${data.length} n8nServers...`);
  for (const item of data) {
    await prisma.n8NServer.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        url: item.url,
        code: item.code,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        url: item.url,
        code: item.code,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ N8NServers importados`);
}

async function importN8NTemplates(data: any[]) {
  console.log(`  Importando ${data.length} n8nTemplates...`);
  for (const item of data) {
    await prisma.n8NTemplate.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        jsonContent: item.jsonContent || null,
        htmlContent: item.htmlContent || null,
        url: item.url || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        jsonContent: item.jsonContent || null,
        htmlContent: item.htmlContent || null,
        url: item.url || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ N8NTemplates importados`);
}

async function importLinks(data: any[]) {
  console.log(`  Importando ${data.length} links...`);
  for (const item of data) {
    await prisma.link.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        url: item.url,
        tag: item.tag,
        cardId: item.cardId || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        url: item.url,
        tag: item.tag,
        cardId: item.cardId || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ Links importados`);
}

async function importLinkCards(data: any[]) {
  console.log(`  Importando ${data.length} linkCards...`);
  for (const item of data) {
    await prisma.linkCard.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        imageUrl: item.imageUrl,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ LinkCards importados`);
}

async function importPrompts(data: any[]) {
  console.log(`  Importando ${data.length} prompts...`);
  for (const item of data) {
    await prisma.prompt.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description,
        promptText: item.promptText,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        description: item.description,
        promptText: item.promptText,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ Prompts importados`);
}

async function importNotes(data: any[]) {
  console.log(`  Importando ${data.length} notes...`);
  for (const item of data) {
    await prisma.note.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        description: item.description || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ Notes importados`);
}

async function importDesigns(data: any[]) {
  console.log(`  Importando ${data.length} designs...`);
  for (const item of data) {
    await prisma.design.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        imageUrl: item.imageUrl,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ Designs importados`);
}

async function importHtmls(data: any[]) {
  console.log(`  Importando ${data.length} htmls...`);
  for (const item of data) {
    await prisma.htmlPage.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        htmlContent: item.htmlContent,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        htmlContent: item.htmlContent,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ Htmls importados`);
}

async function importShorts(data: any[]) {
  console.log(`  Importando ${data.length} shorts...`);
  for (const item of data) {
    await prisma.short.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        youtubeUrl: item.youtubeUrl,
        tags: item.tags || [],
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        youtubeUrl: item.youtubeUrl,
        tags: item.tags || [],
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ Shorts importados`);
}

async function importGitProtocols(data: any[]) {
  console.log(`  Importando ${data.length} gitProtocols...`);
  for (const item of data) {
    await prisma.gitProtocol.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        description: item.description || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });

    // Importar pasos
    if (item.steps && Array.isArray(item.steps)) {
      await prisma.gitStep.deleteMany({ where: { gitProtocolId: item.id } });
      for (let i = 0; i < item.steps.length; i++) {
        const step = item.steps[i];
        await prisma.gitStep.create({
          data: {
            gitCommand: step.gitCommand || null,
            description: step.description || null,
            imageUrl: step.imageUrl || null,
            order: i,
            gitProtocolId: item.id,
          },
        });
      }
    }
  }
  console.log(`  ✓ GitProtocols importados`);
}

async function importServices(data: any[]) {
  console.log(`  Importando ${data.length} services...`);
  for (const item of data) {
    await prisma.service.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description,
        iconUrl: item.iconUrl,
        url: item.url || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        description: item.description,
        iconUrl: item.iconUrl,
        url: item.url || null,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ Services importados`);
}

async function importBlogCategories(data: any[]) {
  console.log(`  Importando ${data.length} blogCategories...`);
  for (const item of data) {
    await prisma.blogCategory.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        imageUrl: item.imageUrl,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }
  console.log(`  ✓ BlogCategories importados`);
}

async function importHeroContent(data: any) {
  console.log(`  Importando heroContent...`);
  await prisma.heroContent.upsert({
    where: { id: 'main' },
    update: {
      description: data.description,
      backgroundImageUrl: data.backgroundImageUrl,
    },
    create: {
      id: 'main',
      description: data.description,
      backgroundImageUrl: data.backgroundImageUrl,
    },
  });

  // Importar botones
  if (data.buttons && Array.isArray(data.buttons)) {
    await prisma.heroButton.deleteMany({ where: { heroContentId: 'main' } });
    for (let i = 0; i < data.buttons.length; i++) {
      const button = data.buttons[i];
      await prisma.heroButton.create({
        data: {
          text: button.text,
          url: button.url,
          variant: button.variant,
          order: i,
          heroContentId: 'main',
        },
      });
    }
  }
  console.log(`  ✓ HeroContent importado`);
}

async function importAboutContent(data: any) {
  console.log(`  Importando aboutContent...`);
  await prisma.aboutContent.upsert({
    where: { id: 'main' },
    update: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
    },
    create: {
      id: 'main',
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
    },
  });
  console.log(`  ✓ AboutContent importado`);
}

async function main() {
  console.log('========================================');
  console.log('IMPORTACIÓN DE DATOS A POSTGRESQL');
  console.log('========================================\n');

  // Leer archivo de exportación
  const exportPath = path.join(__dirname, 'firebase-export.json');

  if (!fs.existsSync(exportPath)) {
    console.error('❌ Error: No se encontró el archivo firebase-export.json');
    console.error('   Primero ejecuta: npx ts-node scripts/export-firebase.ts');
    process.exit(1);
  }

  const exportData: ExportData = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
  console.log(`📅 Exportación de: ${exportData.exportedAt}\n`);

  console.log('Importando colecciones...\n');

  // Importar cada colección
  const collections = exportData.collections;

  if (collections.resultados?.length) await importResultados(collections.resultados);
  if (collections.projects?.length) await importProjects(collections.projects);
  if (collections.images?.length) await importImages(collections.images);
  if (collections.toolCategories?.length) await importToolCategories(collections.toolCategories);
  if (collections.tools?.length) await importTools(collections.tools);
  if (collections.protocols?.length) await importProtocols(collections.protocols);
  if (collections.teamItems?.length) await importTeamItems(collections.teamItems);
  if (collections.sajorItems?.length) await importSajorItems(collections.sajorItems);
  if (collections.aprendePages?.length) await importAprendePages(collections.aprendePages);
  if (collections.formations?.length) await importFormations(collections.formations);
  if (collections.n8nServers?.length) await importN8NServers(collections.n8nServers);
  if (collections.n8nTemplates?.length) await importN8NTemplates(collections.n8nTemplates);
  if (collections.links?.length) await importLinks(collections.links);
  if (collections.linkCards?.length) await importLinkCards(collections.linkCards);
  if (collections.prompts?.length) await importPrompts(collections.prompts);
  if (collections.notes?.length) await importNotes(collections.notes);
  if (collections.designs?.length) await importDesigns(collections.designs);
  if (collections.htmls?.length) await importHtmls(collections.htmls);
  if (collections.shorts?.length) await importShorts(collections.shorts);
  if (collections.gitProtocols?.length) await importGitProtocols(collections.gitProtocols);
  if (collections.services?.length) await importServices(collections.services);
  if (collections.blogCategories?.length) await importBlogCategories(collections.blogCategories);

  // Importar singletons
  console.log('\nImportando singletons...\n');
  const singletons = exportData.singletons;

  if (singletons.heroContent_main) await importHeroContent(singletons.heroContent_main);
  if (singletons.aboutContent_main) await importAboutContent(singletons.aboutContent_main);

  console.log('\n========================================');
  console.log('✅ IMPORTACIÓN COMPLETADA');
  console.log('========================================\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
