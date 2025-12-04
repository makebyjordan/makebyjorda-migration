"use server";

import prisma from '@/lib/prisma';

export interface ProtocolStep {
  id?: string;
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  order?: number;
}

export interface Protocol {
  id: string;
  title: string;
  steps: ProtocolStep[];
  createdAt: Date;
}

export const getProtocols = async (): Promise<Protocol[]> => {
  const protocols = await prisma.protocol.findMany({
    include: {
      steps: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return protocols.map(p => ({
    id: p.id,
    title: p.title,
    steps: p.steps.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      imageUrl: s.imageUrl,
      order: s.order,
    })),
    createdAt: p.createdAt,
  }));
};

export const getProtocolById = async (id: string): Promise<Protocol | null> => {
  const protocol = await prisma.protocol.findUnique({
    where: { id },
    include: {
      steps: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!protocol) return null;

  return {
    id: protocol.id,
    title: protocol.title,
    steps: protocol.steps.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      imageUrl: s.imageUrl,
      order: s.order,
    })),
    createdAt: protocol.createdAt,
  };
};

export const createProtocol = async (protocolData: Omit<Protocol, 'id' | 'createdAt'>): Promise<string> => {
  const protocol = await prisma.protocol.create({
    data: {
      title: protocolData.title,
      steps: {
        create: (protocolData.steps || []).map((step, index) => ({
          title: step.title,
          description: step.description,
          imageUrl: step.imageUrl,
          order: index,
        })),
      },
    },
  });
  return protocol.id;
};

export const updateProtocol = async (id: string, protocolData: Partial<Protocol>): Promise<void> => {
  // Update main protocol
  if (protocolData.title) {
    await prisma.protocol.update({
      where: { id },
      data: { title: protocolData.title },
    });
  }

  // Update steps if provided
  if (protocolData.steps) {
    // Delete existing steps
    await prisma.protocolStep.deleteMany({ where: { protocolId: id } });

    // Create new steps
    for (let i = 0; i < protocolData.steps.length; i++) {
      const step = protocolData.steps[i];
      await prisma.protocolStep.create({
        data: {
          title: step.title,
          description: step.description,
          imageUrl: step.imageUrl,
          order: i,
          protocolId: id,
        },
      });
    }
  }
};

export const deleteProtocol = async (id: string): Promise<void> => {
  // Steps will be deleted automatically due to onDelete: Cascade
  await prisma.protocol.delete({
    where: { id },
  });
};
