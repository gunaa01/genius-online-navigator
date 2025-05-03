import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

interface CreateTagInput {
  name: string;
}

interface UpdateTagInput {
  name?: string;
}

export const contentTagService = {
  async createTag(data: CreateTagInput) {
    const slug = slugify(data.name, { lower: true, strict: true });
    
    return prisma.contentTag.create({
      data: {
        name: data.name,
        slug,
      },
    });
  },

  async getTagById(id: string) {
    return prisma.contentTag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { contents: true },
        },
      },
    });
  },

  async getTagBySlug(slug: string) {
    return prisma.contentTag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { contents: true },
        },
      },
    });
  },

  async updateTag(id: string, data: UpdateTagInput) {
    const updateData: any = {};
    
    if (data.name) {
      updateData.name = data.name;
      updateData.slug = slugify(data.name, { lower: true, strict: true });
    }
    
    return prisma.contentTag.update({
      where: { id },
      data: updateData,
    });
  },

  async deleteTag(id: string) {
    return prisma.contentTag.delete({
      where: { id },
    });
  },

  async listTags() {
    return prisma.contentTag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { contents: true },
        },
      },
    });
  },

  async getTagsForContent(contentId: string) {
    return prisma.contentTag.findMany({
      where: {
        contents: {
          some: { id: contentId },
        },
      },
    });
  },

  async addTagToContent(contentId: string, tagName: string) {
    const slug = slugify(tagName, { lower: true, strict: true });
    
    return prisma.content.update({
      where: { id: contentId },
      data: {
        tags: {
          connectOrCreate: {
            where: { slug },
            create: {
              name: tagName,
              slug,
            },
          },
        },
      },
    });
  },

  async removeTagFromContent(contentId: string, tagId: string) {
    return prisma.content.update({
      where: { id: contentId },
      data: {
        tags: {
          disconnect: { id: tagId },
        },
      },
    });
  },

  async syncTags(contentId: string, tagNames: string[]) {
    const existingTags = await prisma.contentTag.findMany({
      where: {
        slug: {
          in: tagNames.map(name => slugify(name, { lower: true, strict: true })),
        },
      },
    });

    const existingTagSlugs = new Set(existingTags.map(tag => tag.slug));
    const newTags = tagNames.filter(
      name => !existingTagSlugs.has(slugify(name, { lower: true, strict: true }))
    );

    return prisma.content.update({
      where: { id: contentId },
      data: {
        tags: {
          connect: existingTags.map(tag => ({ id: tag.id })),
          create: newTags.map(name => ({
            name,
            slug: slugify(name, { lower: true, strict: true }),
          })),
        },
      },
      include: {
        tags: true,
      },
    });
  },
};

export type { CreateTagInput, UpdateTagInput };
