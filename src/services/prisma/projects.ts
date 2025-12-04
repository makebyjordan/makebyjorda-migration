"use server";

import prisma from '@/lib/prisma';
import { storage } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';

export interface Project {
  id: string;
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  imageHint?: string | null;
  url?: string | null;
  type: string;
  htmlContent?: string | null;
  categoryId?: string | null;
  createdAt: Date;
}

// GET all projects, ordered by creation date
export const getProjects = async (): Promise<Project[]> => {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return projects;
};

// GET a single project by ID
export const getProjectById = async (id: string): Promise<Project | null> => {
  const project = await prisma.project.findUnique({
    where: { id },
  });
  return project;
};

// CREATE a new project
export const createProject = async (projectData: Omit<Project, 'id' | 'createdAt'>): Promise<string> => {
  let imageUrl = projectData.imageUrl || '';

  // If the image is a data URL, upload it to Firebase Storage
  if (projectData.imageUrl && projectData.imageUrl.startsWith('data:image')) {
    const project = await prisma.project.create({
      data: {
        title: projectData.title,
        description: projectData.description,
        type: projectData.type || 'project',
      },
    });

    const storageRef = ref(storage, `projects/${project.id}`);
    await uploadString(storageRef, projectData.imageUrl, 'data_url');
    imageUrl = await getDownloadURL(storageRef);

    await prisma.project.update({
      where: { id: project.id },
      data: {
        imageUrl,
        imageHint: projectData.imageHint,
        url: projectData.url,
        htmlContent: projectData.htmlContent,
        categoryId: projectData.categoryId,
      },
    });

    return project.id;
  }

  const project = await prisma.project.create({
    data: {
      title: projectData.title,
      description: projectData.description,
      imageUrl: imageUrl || null,
      imageHint: projectData.imageHint,
      url: projectData.url,
      type: projectData.type || 'project',
      htmlContent: projectData.htmlContent,
      categoryId: projectData.categoryId,
    },
  });

  return project.id;
};

// UPDATE a project
export const updateProject = async (id: string, projectData: Partial<Project>): Promise<void> => {
  let dataToUpdate = { ...projectData };

  if (projectData.imageUrl && projectData.imageUrl.startsWith('data:image')) {
    const existing = await prisma.project.findUnique({ where: { id } });

    if (existing && existing.imageUrl !== projectData.imageUrl) {
      const storageRef = ref(storage, `projects/${id}`);
      await uploadString(storageRef, projectData.imageUrl, 'data_url');
      dataToUpdate.imageUrl = await getDownloadURL(storageRef);
    }
  }

  await prisma.project.update({
    where: { id },
    data: dataToUpdate,
  });
};

// DELETE a project
export const deleteProject = async (id: string): Promise<void> => {
  await prisma.project.delete({
    where: { id },
  });

  // Also delete the image from storage
  try {
    const storageRef = ref(storage, `projects/${id}`);
    await deleteObject(storageRef);
  } catch (error: any) {
    if (error.code !== 'storage/object-not-found') {
      console.error("Error deleting image from storage:", error);
    }
  }
};
