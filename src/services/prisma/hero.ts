"use server";

import prisma from '@/lib/prisma';

export interface HeroButton {
  text: string;
  url: string;
  variant: "primary" | "outline";
}

export interface HeroContentData {
  description: string;
  backgroundImageUrl: string;
  buttons: HeroButton[];
}

// GET the hero content
export const getHeroContent = async (): Promise<HeroContentData> => {
  const heroContent = await prisma.heroContent.findUnique({
    where: { id: 'main' },
    include: {
      buttons: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (heroContent) {
    return {
      description: heroContent.description,
      backgroundImageUrl: heroContent.backgroundImageUrl,
      buttons: heroContent.buttons.map(b => ({
        text: b.text,
        url: b.url,
        variant: b.variant as "primary" | "outline",
      })),
    };
  }

  // Return default content if the document doesn't exist
  return {
    description: 'Una mente creativa forjando experiencias digitales. Construyo sitios web impresionantes, marcas poderosas y contenido atractivo que cuenta una historia.',
    backgroundImageUrl: 'https://picsum.photos/seed/hero/1920/1080',
    buttons: [
      { text: 'Ver Mi Trabajo', url: '#portfolio', variant: 'primary' },
      { text: 'Ponte en Contacto', url: '#contact', variant: 'outline' }
    ]
  };
};

// UPDATE the hero content
export const updateHeroContent = async (heroData: HeroContentData): Promise<void> => {
  await prisma.heroContent.upsert({
    where: { id: 'main' },
    update: {
      description: heroData.description,
      backgroundImageUrl: heroData.backgroundImageUrl,
    },
    create: {
      id: 'main',
      description: heroData.description,
      backgroundImageUrl: heroData.backgroundImageUrl,
    },
  });

  // Update buttons
  await prisma.heroButton.deleteMany({ where: { heroContentId: 'main' } });

  for (let i = 0; i < heroData.buttons.length; i++) {
    const button = heroData.buttons[i];
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
};
