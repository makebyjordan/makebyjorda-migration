/**
 * Script de importación directa a PostgreSQL usando pg
 */
import * as dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface ExportData {
  exportedAt: string;
  collections: Record<string, any[]>;
  singletons: Record<string, any>;
}

async function importCollection(tableName: string, data: any[], columns: string[]) {
  if (!data || data.length === 0) return;

  console.log(`  Importando ${data.length} registros en ${tableName}...`);

  for (const item of data) {
    const values = columns.map(col => {
      let val = item[col];
      if (val === undefined || val === null) return null;
      // Convertir arrays a formato PostgreSQL: {valor1,valor2}
      if (Array.isArray(val)) {
        return '{' + val.map(v => `"${String(v).replace(/"/g, '\\"')}"`).join(',') + '}';
      }
      if (typeof val === 'object' && !(val instanceof Date)) return JSON.stringify(val);
      return val;
    });

    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const columnNames = columns.map(c => `"${c}"`).join(', ');

    try {
      await pool.query(
        `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders}) ON CONFLICT (id) DO NOTHING`,
        values
      );
    } catch (err: any) {
      console.error(`    Error en ${tableName}:`, err.message);
    }
  }
  console.log(`  ✓ ${tableName}`);
}

async function main() {
  console.log('========================================');
  console.log('IMPORTACIÓN A POSTGRESQL');
  console.log('========================================\n');

  const exportPath = path.join(__dirname, 'firebase-export.json');
  const exportData: ExportData = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));

  console.log(`📅 Datos de: ${exportData.exportedAt}\n`);

  // Importar colecciones
  const collections = exportData.collections;

  // Resultados
  if (collections.resultados?.length) {
    await importCollection('resultados', collections.resultados,
      ['id', 'title', 'prompt', 'imageUrl', 'imageUrl2', 'imageUrl3', 'createdAt']);
  }

  // Projects
  if (collections.projects?.length) {
    await importCollection('projects', collections.projects,
      ['id', 'title', 'description', 'imageUrl', 'imageHint', 'url', 'type', 'htmlContent', 'categoryId', 'createdAt']);
  }

  // Images
  if (collections.images?.length) {
    await importCollection('images', collections.images,
      ['id', 'name', 'url', 'storagePath', 'createdAt']);
  }

  // Tools
  if (collections.tools?.length) {
    await importCollection('tools', collections.tools,
      ['id', 'title', 'description', 'imageUrl', 'url', 'price', 'paymentDay', 'isPaid', 'categoryIds', 'createdAt']);
  }

  // Tool Categories
  if (collections.toolCategories?.length) {
    await importCollection('tool_categories', collections.toolCategories,
      ['id', 'name', 'createdAt']);
  }

  // Protocols (sin steps por ahora)
  if (collections.protocols?.length) {
    for (const protocol of collections.protocols) {
      await pool.query(
        `INSERT INTO protocols (id, title, "createdAt") VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
        [protocol.id, protocol.title, protocol.createdAt]
      );

      // Importar steps
      if (protocol.steps && Array.isArray(protocol.steps)) {
        for (let i = 0; i < protocol.steps.length; i++) {
          const step = protocol.steps[i];
          await pool.query(
            `INSERT INTO protocol_steps (title, description, "imageUrl", "order", "protocolId") VALUES ($1, $2, $3, $4, $5)`,
            [step.title, step.description, step.imageUrl, i, protocol.id]
          );
        }
      }
    }
    console.log(`  ✓ protocols (${collections.protocols.length})`);
  }

  // Team Items
  if (collections.teamItems?.length) {
    await importCollection('team_items', collections.teamItems,
      ['id', 'name', 'position', 'bio', 'imageUrl', 'email', 'linkedinUrl', 'portfolioUrl', 'createdAt']);
  }

  // Sajor Items
  if (collections.sajorItems?.length) {
    await importCollection('sajor_items', collections.sajorItems,
      ['id', 'title', 'url', 'description', 'notes', 'createdAt']);
  }

  // Formations
  if (collections.formations?.length) {
    await importCollection('formations', collections.formations,
      ['id', 'title', 'description', 'url', 'tag', 'createdAt']);
  }

  // N8N Servers
  if (collections.n8nServers?.length) {
    await importCollection('n8n_servers', collections.n8nServers,
      ['id', 'title', 'url', 'code', 'createdAt']);
  }

  // N8N Templates
  if (collections.n8nTemplates?.length) {
    await importCollection('n8n_templates', collections.n8nTemplates,
      ['id', 'title', 'jsonContent', 'htmlContent', 'url', 'createdAt']);
  }

  // Links
  if (collections.links?.length) {
    await importCollection('links', collections.links,
      ['id', 'title', 'url', 'tag', 'cardId', 'createdAt']);
  }

  // Link Cards
  if (collections.linkCards?.length) {
    await importCollection('link_cards', collections.linkCards,
      ['id', 'title', 'imageUrl', 'createdAt']);
  }

  // Prompts
  if (collections.prompts?.length) {
    await importCollection('prompts', collections.prompts,
      ['id', 'title', 'description', 'promptText', 'createdAt']);
  }

  // Notes
  if (collections.notes?.length) {
    await importCollection('notes', collections.notes,
      ['id', 'title', 'description', 'createdAt']);
  }

  // Designs
  if (collections.designs?.length) {
    await importCollection('designs', collections.designs,
      ['id', 'title', 'imageUrl', 'createdAt']);
  }

  // HTMLs
  if (collections.htmls?.length) {
    await importCollection('html_pages', collections.htmls,
      ['id', 'title', 'htmlContent', 'createdAt']);
  }

  // Shorts
  if (collections.shorts?.length) {
    await importCollection('shorts', collections.shorts,
      ['id', 'title', 'youtubeUrl', 'tags', 'createdAt']);
  }

  // Git Protocols
  if (collections.gitProtocols?.length) {
    for (const protocol of collections.gitProtocols) {
      await pool.query(
        `INSERT INTO git_protocols (id, title, description, "createdAt") VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
        [protocol.id, protocol.title, protocol.description, protocol.createdAt]
      );

      if (protocol.steps && Array.isArray(protocol.steps)) {
        for (let i = 0; i < protocol.steps.length; i++) {
          const step = protocol.steps[i];
          await pool.query(
            `INSERT INTO git_steps ("gitCommand", description, "imageUrl", "order", "gitProtocolId") VALUES ($1, $2, $3, $4, $5)`,
            [step.gitCommand, step.description, step.imageUrl, i, protocol.id]
          );
        }
      }
    }
    console.log(`  ✓ git_protocols (${collections.gitProtocols.length})`);
  }

  // Services
  if (collections.services?.length) {
    await importCollection('services', collections.services,
      ['id', 'title', 'description', 'iconUrl', 'url', 'createdAt']);
  }

  // Blog Categories
  if (collections.blogCategories?.length) {
    await importCollection('blog_categories', collections.blogCategories,
      ['id', 'title', 'imageUrl', 'createdAt']);
  }

  // Singletons
  console.log('\nImportando singletons...\n');
  const singletons = exportData.singletons;

  // Hero Content
  if (singletons.heroContent_main) {
    const hero = singletons.heroContent_main;
    await pool.query(
      `INSERT INTO hero_content (id, description, "backgroundImageUrl") VALUES ('main', $1, $2) ON CONFLICT (id) DO UPDATE SET description = $1, "backgroundImageUrl" = $2`,
      [hero.description, hero.backgroundImageUrl]
    );

    if (hero.buttons && Array.isArray(hero.buttons)) {
      await pool.query(`DELETE FROM hero_buttons WHERE "heroContentId" = 'main'`);
      for (let i = 0; i < hero.buttons.length; i++) {
        const btn = hero.buttons[i];
        await pool.query(
          `INSERT INTO hero_buttons (text, url, variant, "order", "heroContentId") VALUES ($1, $2, $3, $4, 'main')`,
          [btn.text, btn.url, btn.variant, i]
        );
      }
    }
    console.log('  ✓ hero_content');
  }

  // About Content
  if (singletons.aboutContent_main) {
    const about = singletons.aboutContent_main;
    await pool.query(
      `INSERT INTO about_content (id, title, description, "imageUrl") VALUES ('main', $1, $2, $3) ON CONFLICT (id) DO UPDATE SET title = $1, description = $2, "imageUrl" = $3`,
      [about.title, about.description, about.imageUrl]
    );
    console.log('  ✓ about_content');
  }

  // Verificar
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM resultados) as resultados,
      (SELECT COUNT(*) FROM projects) as projects,
      (SELECT COUNT(*) FROM images) as images,
      (SELECT COUNT(*) FROM tools) as tools,
      (SELECT COUNT(*) FROM services) as services,
      (SELECT COUNT(*) FROM shorts) as shorts
  `);

  console.log('\n========================================');
  console.log('IMPORTACIÓN COMPLETADA');
  console.log('========================================\n');
  console.log('Verificación de datos:');
  console.log(result.rows[0]);

  await pool.end();
}

main().catch(console.error);
