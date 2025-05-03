import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { organizationController } from '../controllers/organization.controller';
import { authenticate } from '../utils/auth';

// Type definitions for request bodies and parameters
interface CreateOrganizationBody {
  name: string;
  description?: string;
}

interface UpdateOrganizationBody {
  name?: string;
  description?: string;
}

interface AddMemberBody {
  userId: string;
  role?: string;
}

interface UpdateMemberRoleBody {
  role: string;
}

interface OrganizationParams {
  id: string;
}

interface MemberParams extends OrganizationParams {
  userId: string;
}

export async function organizationRoutes(fastify: FastifyInstance) {
  // Create a new organization
  fastify.post<{ Body: CreateOrganizationBody }>(
    '/',
    { preHandler: [authenticate] },
    (req: FastifyRequest<{ Body: CreateOrganizationBody }>, reply: FastifyReply) =>
      organizationController.createOrganization(req as any, reply)
  );

  // Get a specific organization
  fastify.get<{ Params: OrganizationParams }>(
    '/:id',
    { preHandler: [authenticate] },
    (req: FastifyRequest<{ Params: OrganizationParams }>, reply: FastifyReply) =>
      organizationController.getOrganization(req as any, reply)
  );

  // Update an organization
  fastify.put<{ Params: OrganizationParams; Body: UpdateOrganizationBody }>(
    '/:id',
    { preHandler: [authenticate] },
    (
      req: FastifyRequest<{ Params: OrganizationParams; Body: UpdateOrganizationBody }>,
      reply: FastifyReply
    ) => organizationController.updateOrganization(req as any, reply)
  );

  // Delete an organization
  fastify.delete<{ Params: OrganizationParams }>(
    '/:id',
    { preHandler: [authenticate] },
    (req: FastifyRequest<{ Params: OrganizationParams }>, reply: FastifyReply) =>
      organizationController.deleteOrganization(req as any, reply)
  );

  // Get all organizations for the authenticated user
  fastify.get(
    '/',
    { preHandler: [authenticate] },
    organizationController.getUserOrganizations.bind(organizationController)
  );

  // Add a member to an organization
  fastify.post<{ Params: OrganizationParams; Body: AddMemberBody }>(
    '/:id/members',
    { preHandler: [authenticate] },
    (
      req: FastifyRequest<{ Params: OrganizationParams; Body: AddMemberBody }>,
      reply: FastifyReply
    ) => organizationController.addOrganizationMember(req as any, reply)
  );

  // Remove a member from an organization
  fastify.delete<{ Params: MemberParams }>(
    '/:id/members/:userId',
    { preHandler: [authenticate] },
    (req: FastifyRequest<{ Params: MemberParams }>, reply: FastifyReply) =>
      organizationController.removeOrganizationMember(req as any, reply)
  );

  // Update an organization member's role
  fastify.put<{ Params: MemberParams; Body: UpdateMemberRoleBody }>(
    '/:id/members/:userId/role',
    { preHandler: [authenticate] },
    (
      req: FastifyRequest<{ Params: MemberParams; Body: UpdateMemberRoleBody }>,
      reply: FastifyReply
    ) => organizationController.updateOrganizationMemberRole(req as any, reply)
  );
}
