"use server";

import prisma from '@/lib/prisma';
import { addImageByUrl } from './images';

export interface Resultado {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  imageUrl2?: string | null;
  imageUrl3?: string | null;
  createdAt: Date;
}

export type ResultadoInput = Omit<Resultado, 'id' | 'createdAt'> & { id?: string };

// GET all resultados, ordered by creation date
export const getResultados = async (): Promise<Resultado[]> => {
  const resultados = await prisma.resultado.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return resultados;
};

// SAVE (create or update) a resultado
export const saveResultado = async (data: ResultadoInput): Promise<string> => {
  // Also add the images to the general gallery
  if (data.imageUrl) await addImageByUrl(data.imageUrl);
  if (data.imageUrl2) await addImageByUrl(data.imageUrl2);
  if (data.imageUrl3) await addImageByUrl(data.imageUrl3);

  if (data.id) {
    await prisma.resultado.update({
      where: { id: data.id },
      data: {
        title: data.title,
        prompt: data.prompt,
        imageUrl: data.imageUrl,
        imageUrl2: data.imageUrl2 || null,
        imageUrl3: data.imageUrl3 || null,
      },
    });
    return data.id;
  } else {
    const resultado = await prisma.resultado.create({
      data: {
        title: data.title,
        prompt: data.prompt,
        imageUrl: data.imageUrl,
        imageUrl2: data.imageUrl2 || null,
        imageUrl3: data.imageUrl3 || null,
      },
    });
    return resultado.id;
  }
};

// DELETE a resultado
export const deleteResultado = async (id: string): Promise<void> => {
  await prisma.resultado.delete({
    where: { id },
  });
};
