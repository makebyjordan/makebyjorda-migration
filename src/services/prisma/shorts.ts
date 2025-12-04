"use server";

import prisma from '@/lib/prisma';

export interface Short {
  id: string;
  title: string;
  youtubeUrl: string;
  tags: string[];
  createdAt: Date;
}

export const getShorts = async (): Promise<Short[]> => {
  const shorts = await prisma.short.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return shorts;
};

export const createShort = async (shortData: Omit<Short, 'id' | 'createdAt'>): Promise<string> => {
  const short = await prisma.short.create({
    data: {
      title: shortData.title,
      youtubeUrl: shortData.youtubeUrl,
      tags: shortData.tags || [],
    },
  });
  return short.id;
};

export const updateShort = async (id: string, shortData: Partial<Short>): Promise<void> => {
  await prisma.short.update({
    where: { id },
    data: shortData,
  });
};

export const deleteShort = async (id: string): Promise<void> => {
  await prisma.short.delete({
    where: { id },
  });
};
