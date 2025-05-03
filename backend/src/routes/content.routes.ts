import { FastifyInstance } from 'fastify';
import { 
  createContent, 
  getContent, 
  updateContent, 
  deleteContent, 
  listContent 
} from '../controllers/content.controller';
import { verifyToken } from '../utils/auth';

// Type definitions for content routes
type CreateContentBody = {
  title: string;
  body: string;
  type: string;
  metadata?: Record<string, any>;
};

type UpdateContentBody = {
  title?: string;
  body?: string;
  type?: string;
  status?: 'draft' | 'published' | 'archived';
  metadata?: Record<string, any>;
};

type ContentQuery = {
  page?: string;
  limit?: string;
  type?: string;
  status?: string;
};

export default async function contentRoutes(fastify: FastifyInstance) {
  // Protected routes (require authentication)
  fastify.post<{ Body: CreateContentBody }>(
    '/content', 
    { 
      preValidation: [verifyToken],
      schema: {
        body: {
          type: 'object',
          required: ['title', 'body', 'type'],
          properties: {
            title: { type: 'string' },
            body: { type: 'string' },
            type: { type: 'string' },
            metadata: { type: 'object' }
          }
        }
      }
    }, 
    createContent
  );
  
  // Public routes
  fastify.get<{ Querystring: ContentQuery }>(
    '/content', 
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'string' },
            limit: { type: 'string' },
            type: { type: 'string' },
            status: { type: 'string', enum: ['draft', 'published', 'archived'] }
          }
        }
      }
    },
    listContent
  );
  
  fastify.get<{ Params: { id: string } }>(
    '/content/:id', 
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    getContent
  );
  
  // Protected routes
  fastify.put<{ 
    Params: { id: string };
    Body: UpdateContentBody;
  }>(
    '/content/:id', 
    { 
      preValidation: [verifyToken],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            body: { type: 'string' },
            type: { type: 'string' },
            status: { type: 'string', enum: ['draft', 'published', 'archived'] },
            metadata: { type: 'object' }
          }
        }
      }
    }, 
    updateContent
  );
  
  fastify.delete<{ Params: { id: string } }>(
    '/content/:id', 
    {
      preValidation: [verifyToken],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    deleteContent
  );
}
