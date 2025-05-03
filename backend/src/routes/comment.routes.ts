import type { FastifyInstance } from 'fastify';
import { 
  commentController, 
  type CreateCommentRequest, 
  type UpdateCommentRequest,
  type ListCommentsQuery,
} from '../controllers/comment.controller.js';
import { authenticate } from '../utils/auth.js';

export async function commentRoutes(fastify: FastifyInstance) {
  // Create a new comment
  fastify.post<CreateCommentRequest>(
    '/content/:contentId/comments',
    {
      preHandler: [authenticate],
      schema: {
        params: {
          type: 'object',
          required: ['contentId'],
          properties: {
            contentId: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          required: ['body'],
          properties: {
            parentId: { type: 'string' },
            body: { type: 'string', minLength: 1 },
          },
        },
      },
    },
    commentController.createComment.bind(commentController)
  );

  // Get comment by ID
  fastify.get<{ Params: { id: string } }>(
    '/comments/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    commentController.getComment.bind(commentController)
  );

  // Update comment
  fastify.put<UpdateCommentRequest>(
    '/comments/:id',
    {
      preHandler: [authenticate],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            body: { type: 'string', minLength: 1 },
            isApproved: { type: 'boolean' },
            isSpam: { type: 'boolean' },
            isDeleted: { type: 'boolean' },
          },
        },
      },
    },
    commentController.updateComment.bind(commentController)
  );

  // Delete comment
  fastify.delete<{ Params: { id: string } }>(
    '/comments/:id',
    {
      preHandler: [authenticate],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    commentController.deleteComment.bind(commentController)
  );

  // List comments for content
  fastify.get<ListCommentsQuery>(
    '/content/:contentId/comments',
    {
      schema: {
        params: {
          type: 'object',
          required: ['contentId'],
          properties: {
            contentId: { type: 'string' },
          },
        },
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'string', pattern: '^\\d+$' },
            limit: { type: 'string', pattern: '^\\d+$' },
            parentId: { type: 'string' },
            isApproved: { type: 'string', enum: ['true', 'false'] },
            isSpam: { type: 'string', enum: ['true', 'false'] },
            isDeleted: { type: 'string', enum: ['true', 'false'] },
          },
        },
      },
    },
    commentController.listComments.bind(commentController)
  );

  // Get comment replies
  fastify.get<{ Params: { id: string }; Querystring: { page?: string; limit?: string } }>(
    '/comments/:id/replies',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'string', pattern: '^\\d+$' },
            limit: { type: 'string', pattern: '^\\d+$' },
          },
        },
      },
    },
    commentController.getCommentReplies.bind(commentController)
  );

  // Get comment statistics
  fastify.get<{ Params: { contentId: string } }>(
    '/content/:contentId/comments/stats',
    {
      schema: {
        params: {
          type: 'object',
          required: ['contentId'],
          properties: {
            contentId: { type: 'string' },
          },
        },
      },
    },
    commentController.getCommentStats.bind(commentController)
  );
}
