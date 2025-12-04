"use server";

import prisma from '@/lib/prisma';

export interface AboutContentData {
  title: string;
  description: string;
  imageUrl: string;
}

// GET the about content
export const getAboutContent = async (): Promise<AboutContentData> => {
  const aboutContent = await prisma.aboutContent.findUnique({
    where: { id: 'main' },
  });

  if (aboutContent) {
    return {
      title: aboutContent.title,
      description: aboutContent.description,
      imageUrl: aboutContent.imageUrl,
    };
  }

  // Return default content if the document doesn't exist
  return {
    title: 'Sobre Mí',
    description: '¡Hola! Soy Jordan, un apasionado creador y arquitecto digital. Mi misión es construir cosas que no solo sean hermosas y funcionales, sino que también cuenten una historia convincente.\n\nCon experiencia en desarrollo web, branding y estrategia de contenido, abordo cada proyecto con una perspectiva holística. Ya sea un nuevo sitio web, una identidad de marca o una idea de negocio, me encanta el proceso de convertir una chispa de inspiración en una realidad tangible. Creemos algo increíble juntos.',
    imageUrl: 'https://picsum.photos/seed/about-me/600/600',
  };
};

// UPDATE the about content
export const updateAboutContent = async (aboutData: AboutContentData): Promise<void> => {
  await prisma.aboutContent.upsert({
    where: { id: 'main' },
    update: {
      title: aboutData.title,
      description: aboutData.description,
      imageUrl: aboutData.imageUrl,
    },
    create: {
      id: 'main',
      title: aboutData.title,
      description: aboutData.description,
      imageUrl: aboutData.imageUrl,
    },
  });
};
