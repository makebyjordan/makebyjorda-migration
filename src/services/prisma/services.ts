"use server";

import prisma from '@/lib/prisma';
import { storage } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';

export interface Service {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  url?: string | null;
  createdAt: Date;
}

export const getServices = async (): Promise<Service[]> => {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: 'asc' },
  });
  return services;
};

const uploadIcon = async (id: string, iconDataUrl: string): Promise<string> => {
  const storageRef = ref(storage, `services/${id}.svg`);
  await uploadString(storageRef, iconDataUrl, 'data_url');
  return getDownloadURL(storageRef);
};

export const createService = async (serviceData: Omit<Service, 'id' | 'createdAt'>): Promise<string> => {
  const service = await prisma.service.create({
    data: {
      title: serviceData.title,
      description: serviceData.description,
      iconUrl: '', // Will be updated if SVG
      url: serviceData.url,
    },
  });

  let iconUrl = "";
  if (serviceData.iconUrl && serviceData.iconUrl.startsWith('data:image/svg+xml')) {
    iconUrl = await uploadIcon(service.id, serviceData.iconUrl);
    await prisma.service.update({
      where: { id: service.id },
      data: { iconUrl },
    });
  } else {
    await prisma.service.update({
      where: { id: service.id },
      data: { iconUrl: serviceData.iconUrl },
    });
  }

  return service.id;
};

export const updateService = async (id: string, serviceData: Partial<Service>): Promise<void> => {
  const dataToUpdate = { ...serviceData };

  if (serviceData.iconUrl && serviceData.iconUrl.startsWith('data:image/svg+xml')) {
    dataToUpdate.iconUrl = await uploadIcon(id, serviceData.iconUrl);
  }

  await prisma.service.update({
    where: { id },
    data: dataToUpdate,
  });
};

export const deleteService = async (id: string): Promise<void> => {
  await prisma.service.delete({
    where: { id },
  });

  try {
    const storageRef = ref(storage, `services/${id}.svg`);
    await deleteObject(storageRef);
  } catch (error: any) {
    if (error.code !== 'storage/object-not-found') {
      console.error("Error deleting icon from storage:", error);
    }
  }
};
