"use server";

import prisma from '@/lib/prisma';

export interface Tool {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  url?: string | null;
  price?: number | null;
  paymentDay?: number | null;
  isPaid: boolean;
  categoryIds: string[];
  createdAt: Date;
}

export const getTools = async (): Promise<Tool[]> => {
  const tools = await prisma.tool.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return tools;
};

export const createTool = async (toolData: Omit<Tool, 'id' | 'createdAt'>): Promise<string> => {
  const tool = await prisma.tool.create({
    data: {
      title: toolData.title,
      description: toolData.description,
      imageUrl: toolData.imageUrl,
      url: toolData.url,
      price: toolData.price,
      paymentDay: toolData.paymentDay,
      isPaid: toolData.isPaid || false,
      categoryIds: toolData.categoryIds || [],
    },
  });
  return tool.id;
};

export const updateTool = async (id: string, toolData: Partial<Tool>): Promise<void> => {
  await prisma.tool.update({
    where: { id },
    data: toolData,
  });
};

export const deleteTool = async (id: string): Promise<void> => {
  await prisma.tool.delete({
    where: { id },
  });
};
