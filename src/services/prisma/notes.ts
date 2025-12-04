"use server";

import prisma from '@/lib/prisma';

export interface Note {
  id: string;
  title: string;
  description?: string | null;
  createdAt: Date;
}

export const getNotes = async (): Promise<Note[]> => {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return notes;
};

export const createNote = async (noteData: Omit<Note, 'id' | 'createdAt'>): Promise<string> => {
  const note = await prisma.note.create({
    data: {
      title: noteData.title,
      description: noteData.description,
    },
  });
  return note.id;
};

export const updateNote = async (id: string, noteData: Partial<Note>): Promise<void> => {
  await prisma.note.update({
    where: { id },
    data: noteData,
  });
};

export const deleteNote = async (id: string): Promise<void> => {
  await prisma.note.delete({
    where: { id },
  });
};
