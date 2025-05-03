import type { FastifyRequest, FastifyReply } from 'fastify';
import { 
  commentService, 
  type CreateCommentInput, 
  type UpdateCommentInput,
  type CommentFilters
} from '../services/comment.service.js';
import { authenticate } from '../utils/auth.js';

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export type CreateCommentRequest = FastifyRequest<{
  Body: Omit<CreateCommentInput, 'userId'>;
  Params: { contentId: string };
}>;

export type UpdateCommentRequest = FastifyRequest<{
  Params: { id: string };
  Body: UpdateCommentInput;
}>;

export type CommentIdParam = FastifyRequest<{
  Params: { id: string };
}>;

export type ListCommentsQuery = FastifyRequest<{
  Querystring: {
    page?: string;
    limit?: string;
    parentId?: string;
    isApproved?: string;
    isSpam?: string;
    isDeleted?: string;
  };
  Params: { contentId: string };
}>;

export const commentController = {
  async createComment(
    req: AuthenticatedRequest & CreateCommentRequest, 
    reply: FastifyReply
  ) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const comment = await commentService.createComment({
        ...req.body,
        contentId: req.params.contentId,
        userId: req.user.id,
      });

      // Increment comment count on content
      await commentService.getCommentCounts(req.params.contentId);

      return reply.status(201).send(comment);
    } catch (error: any) {
      console.error('Create comment error:', error);
      return reply.status(500).send({ 
        error: error.message || 'Failed to create comment' 
      });
    }
  },

  async getComment(
    req: AuthenticatedRequest & CommentIdParam, 
    reply: FastifyReply
  ) {
    try {
      const comment = await commentService.getCommentById(req.params.id);
      
      if (!comment) {
        return reply.status(404).send({ error: 'Comment not found' });
      }

      return reply.send(comment);
    } catch (error: any) {
      console.error('Get comment error:', error);
      return reply.status(500).send({ 
        error: error.message || 'Failed to fetch comment' 
      });
    }
  },

  async updateComment(
    req: AuthenticatedRequest & UpdateCommentRequest, 
    reply: FastifyReply
  ) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const comment = await commentService.updateComment(
        req.params.id, 
        req.body,
        req.user.id
      );

      return reply.send(comment);
    } catch (error: any) {
      console.error('Update comment error:', error);
      const status = error.message.includes('not found') ? 404 : 500;
      return reply.status(status).send({ 
        error: error.message || 'Failed to update comment' 
      });
    }
  },

  async deleteComment(
    req: AuthenticatedRequest & CommentIdParam, 
    reply: FastifyReply
  ) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const comment = await commentService.getCommentById(req.params.id);
      if (!comment) {
        return reply.status(404).send({ error: 'Comment not found' });
      }

      await commentService.deleteComment(req.params.id, req.user.id);

      // Update comment count on content
      if (comment.contentId) {
        await commentService.getCommentCounts(comment.contentId);
      }

      return reply.send({ success: true });
    } catch (error: any) {
      console.error('Delete comment error:', error);
      const status = error.message.includes('not found') ? 404 : 500;
      return reply.status(status).send({ 
        error: error.message || 'Failed to delete comment' 
      });
    }
  },

  async listComments(
    req: AuthenticatedRequest & ListCommentsQuery, 
    reply: FastifyReply
  ) {
    try {
      const { 
        page = '1', 
        limit = '10',
        parentId,
        isApproved,
        isSpam,
        isDeleted,
      } = req.query;

      const filters: CommentFilters = {
        contentId: req.params.contentId,
      };

      if (parentId !== undefined) {
        filters.parentId = parentId === 'null' ? null : parentId;
      }
      if (isApproved !== undefined) filters.isApproved = isApproved === 'true';
      if (isSpam !== undefined) filters.isSpam = isSpam === 'true';
      if (isDeleted !== undefined) filters.isDeleted = isDeleted === 'true';

      // For non-admin users, only show approved, non-spam, non-deleted comments
      if (!req.user || req.user.role !== 'ADMIN') {
        filters.isApproved = true;
        filters.isSpam = false;
        filters.isDeleted = false;
      }

      const result = await commentService.listComments(
        filters,
        parseInt(page, 10) || 1,
        parseInt(limit, 10) || 10
      );

      return reply.send(result);
    } catch (error: any) {
      console.error('List comments error:', error);
      return reply.status(500).send({ 
        error: error.message || 'Failed to fetch comments' 
      });
    }
  },

  async getCommentReplies(
    req: AuthenticatedRequest & CommentIdParam & { Querystring: { page?: string; limit?: string } },
    reply: FastifyReply
  ) {
    try {
      const { page = '1', limit = '10' } = req.query as any;
      
      const result = await commentService.getCommentReplies(
        req.params.id,
        parseInt(page, 10) || 1,
        parseInt(limit, 10) || 10
      );

      return reply.send(result);
    } catch (error: any) {
      console.error('Get comment replies error:', error);
      return reply.status(500).send({ 
        error: error.message || 'Failed to fetch comment replies' 
      });
    }
  },

  async getCommentStats(
    req: AuthenticatedRequest & { Params: { contentId: string } },
    reply: FastifyReply
  ) {
    try {
      const stats = await commentService.getCommentCounts(req.params.contentId);
      return reply.send(stats);
    } catch (error: any) {
      console.error('Get comment stats error:', error);
      return reply.status(500).send({ 
        error: error.message || 'Failed to fetch comment stats' 
      });
    }
  },
};
