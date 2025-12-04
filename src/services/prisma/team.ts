"use server";

import prisma from '@/lib/prisma';

export interface TeamItem {
  id: string;
  name: string;
  position: string;
  bio?: string | null;
  imageUrl?: string | null;
  email?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  createdAt: Date;
}

export const getTeamItems = async (): Promise<TeamItem[]> => {
  const teamItems = await prisma.teamItem.findMany({
    orderBy: { createdAt: 'asc' },
  });
  return teamItems;
};

export const createTeamItem = async (itemData: Omit<TeamItem, 'id' | 'createdAt'>): Promise<string> => {
  const item = await prisma.teamItem.create({
    data: {
      name: itemData.name,
      position: itemData.position,
      bio: itemData.bio,
      imageUrl: itemData.imageUrl,
      email: itemData.email,
      linkedinUrl: itemData.linkedinUrl,
      portfolioUrl: itemData.portfolioUrl,
    },
  });
  return item.id;
};

export const updateTeamItem = async (id: string, itemData: Partial<TeamItem>): Promise<void> => {
  await prisma.teamItem.update({
    where: { id },
    data: itemData,
  });
};

export const deleteTeamItem = async (id: string): Promise<void> => {
  await prisma.teamItem.delete({
    where: { id },
  });
};
