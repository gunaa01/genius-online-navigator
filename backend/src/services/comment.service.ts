import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateCommentInput {
  contentId: string;
  userId: string;
  parentId?: string;
  body: string;
}

interface UpdateCommentInput {
  body: string;
  isApproved?: boolean;
  isSpam?: boolean;
  isDeleted?: boolean;
}

interface CommentFilters {
  contentId?: string;
  userId?: string;
  parentId?: string | null;
  isApproved?: boolean;
  isSpam?: boolean;
  isDeleted?: boolean;
}

export const commentService = {
  async createComment(data: CreateCommentInput) {
    return prisma.comment.create({
      data: {
        contentId: data.contentId,
        userId: data.userId,
        parentId: data.parentId,
        body: data.body,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  },

  async getCommentById(id: string) {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: { replies: true },
        },
      },
    });
  },

  async updateComment(id: string, data: UpdateCommentInput, userId: string) {
    const comment = await prisma.comment.findFirst({
      where: { id, userId },
    });

    if (!comment) {
      throw new Error('Comment not found or access denied');
    }

    return prisma.comment.update({
      where: { id },
      data: {
        body: data.body,
        isApproved: data.isApproved,
        isSpam: data.isSpam,
        isDeleted: data.isDeleted,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  },

  async deleteComment(id: string, userId: string) {
    const comment = await prisma.comment.findFirst({
      where: { id, userId },
    });

    if (!comment) {
      throw new Error('Comment not found or access denied');
    }

    return prisma.comment.delete({
      where: { id },
    });
  },

  async listComments(filters: CommentFilters = {}, page = 1, limit = 10) {
    const where: any = {};

    if (filters.contentId) where.contentId = filters.contentId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.parentId !== undefined) where.parentId = filters.parentId;
    if (filters.isApproved !== undefined) where.isApproved = filters.isApproved;
    if (filters.isSpam !== undefined) where.isSpam = filters.isSpam;
    if (filters.isDeleted !== undefined) where.isDeleted = filters.isDeleted;

    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: { replies: true },
          },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getCommentReplies(commentId: string, page = 1, limit = 10) {
    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where: { parentId: commentId, isDeleted: false },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: { replies: true },
          },
        },
      }),
      prisma.comment.count({ where: { parentId: commentId, isDeleted: false } }),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getCommentsForContent(contentId: string, page = 1, limit = 10) {
    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where: { 
          contentId, 
          parentId: null, 
          isDeleted: false,
          isApproved: true,
          isSpam: false,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: { replies: true },
          },
        },
      }),
      prisma.comment.count({ 
        where: { 
          contentId, 
          parentId: null,
          isDeleted: false,
          isApproved: true,
          isSpam: false,
        },
      }),
    ]);

    // Get replies for each top-level comment
    const itemsWithReplies = await Promise.all(
      items.map(async (comment) => {
        const replies = await this.getCommentReplies(comment.id, 1, 5);
        return {
          ...comment,
          replies,
        };
      })
    );

    return {
      items: itemsWithReplies,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getCommentCounts(contentId: string) {
    const [total, approved, pending, spam] = await Promise.all([
      prisma.comment.count({ where: { contentId, isDeleted: false } }),
      prisma.comment.count({ where: { contentId, isApproved: true, isSpam: false, isDeleted: false } }),
      prisma.comment.count({ where: { contentId, isApproved: false, isSpam: false, isDeleted: false } }),
      prisma.comment.count({ where: { contentId, isSpam: true, isDeleted: false } }),
    ]);

    return {
      total,
      approved,
      pending,
      spam,
    };
  },
};

export type { CreateCommentInput, UpdateCommentInput, CommentFilters };
