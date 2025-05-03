import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
}

interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
}

export const contentCategoryService = {
  async createCategory(data: CreateCategoryInput) {
    return prisma.contentCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
      },
    });
  },

  async getCategoryById(id: string) {
    return prisma.contentCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { contents: true },
        },
      },
    });
  },

  async getCategoryBySlug(slug: string) {
    return prisma.contentCategory.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { contents: true },
        },
      },
    });
  },

  async updateCategory(id: string, data: UpdateCategoryInput) {
    return prisma.contentCategory.update({
      where: { id },
      data,
    });
  },

  async deleteCategory(id: string) {
    return prisma.contentCategory.delete({
      where: { id },
    });
  },

  async listCategories() {
    return prisma.contentCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { contents: true },
        },
      },
    });
  },

  async getCategoriesForContent(contentId: string) {
    return prisma.contentCategory.findMany({
      where: {
        contents: {
          some: { id: contentId },
        },
      },
    });
  },

  async addContentToCategory(contentId: string, categoryId: string) {
    return prisma.content.update({
      where: { id: contentId },
      data: {
        categories: {
          connect: { id: categoryId },
        },
      },
    });
  },

  async removeContentFromCategory(contentId: string, categoryId: string) {
    return prisma.content.update({
      where: { id: contentId },
      data: {
        categories: {
          disconnect: { id: categoryId },
        },
      },
    });
  },
};

export type { CreateCategoryInput, UpdateCategoryInput };
