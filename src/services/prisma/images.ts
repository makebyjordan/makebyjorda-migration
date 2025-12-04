"use server";

import prisma from '@/lib/prisma';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface ImageData {
  id: string;
  name: string;
  url: string;
  storagePath?: string | null;
  createdAt: Date;
}

export const uploadImage = async (file: File): Promise<ImageData> => {
  const timestamp = Date.now();
  const storagePath = `gallery/${timestamp}_${file.name}`;
  const storageRef = ref(storage, storagePath);

  // Upload file to Firebase Storage (we keep storage in Firebase)
  const bytes = await file.arrayBuffer();
  await uploadBytes(storageRef, new Uint8Array(bytes));

  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);

  // Save metadata to PostgreSQL
  const image = await prisma.image.create({
    data: {
      name: file.name,
      url: downloadURL,
      storagePath: storagePath,
    },
  });

  return image;
};

export const addImageByUrl = async (imageUrl: string): Promise<ImageData> => {
  const url = new URL(imageUrl);
  const name = url.pathname.split('/').pop() || 'image_from_url';

  const image = await prisma.image.create({
    data: {
      name,
      url: imageUrl,
      storagePath: null,
    },
  });

  return image;
};

export const getImages = async (): Promise<ImageData[]> => {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return images;
};

export const deleteImage = async (image: ImageData): Promise<void> => {
  // Delete from PostgreSQL
  await prisma.image.delete({
    where: { id: image.id },
  });

  // If there's a storage path, delete from Firebase Storage as well
  if (image.storagePath) {
    try {
      const storageRef = ref(storage, image.storagePath);
      await deleteObject(storageRef);
    } catch (error: any) {
      if (error.code !== 'storage/object-not-found') {
        console.error("Error deleting image from storage:", error);
      }
    }
  }
};
