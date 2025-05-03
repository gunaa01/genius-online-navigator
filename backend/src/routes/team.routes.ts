import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { teamController } from '../controllers/team.controller';
import { authenticate } from '../utils/auth';

// Type definitions for request bodies and parameters
interface CreateTeamBody {
  name: string;
  description?: string;
}

interface UpdateTeamBody {
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

interface TeamParams {
  id: string;
}

interface MemberParams extends TeamParams {
  userId: string;
}

export async function teamRoutes(fastify: FastifyInstance) {
  // Create a new team
  fastify.post<{ Body: CreateTeamBody }>(
    '/',
    { preHandler: [authenticate] },
    (req: FastifyRequest<{ Body: CreateTeamBody }>, reply: FastifyReply) =>
      teamController.createTeam(req as any, reply)
  );

  // Get a specific team
  fastify.get<{ Params: TeamParams }>(
    '/:id',
    { preHandler: [authenticate] },
    (req: FastifyRequest<{ Params: TeamParams }>, reply: FastifyReply) =>
      teamController.getTeam(req as any, reply)
  );

  // Update a team
  fastify.put<{ Params: TeamParams; Body: UpdateTeamBody }>(
    '/:id',
    { preHandler: [authenticate] },
    (
      req: FastifyRequest<{ Params: TeamParams; Body: UpdateTeamBody }>,
      reply: FastifyReply
    ) => teamController.updateTeam(req as any, reply)
  );

  // Delete a team
  fastify.delete<{ Params: TeamParams }>(
    '/:id',
    { preHandler: [authenticate] },
    (req: FastifyRequest<{ Params: TeamParams }>, reply: FastifyReply) =>
      teamController.deleteTeam(req as any, reply)
  );

  // Get all teams for the authenticated user
  fastify.get(
    '/',
    { preHandler: [authenticate] },
    teamController.getUserTeams.bind(teamController)
  );

  // Add a member to a team
  fastify.post<{ Params: TeamParams; Body: AddMemberBody }>(
    '/:id/members',
    { preHandler: [authenticate] },
    (
      req: FastifyRequest<{ Params: TeamParams; Body: AddMemberBody }>,
      reply: FastifyReply
    ) => teamController.addTeamMember(req as any, reply)
  );

  // Remove a member from a team
  fastify.delete<{ Params: MemberParams }>(
    '/:id/members/:userId',
    { preHandler: [authenticate] },
    (req: FastifyRequest<{ Params: MemberParams }>, reply: FastifyReply) =>
      teamController.removeTeamMember(req as any, reply)
  );

  // Update a team member's role
  fastify.put<{ Params: MemberParams; Body: UpdateMemberRoleBody }>(
    '/:id/members/:userId/role',
    { preHandler: [authenticate] },
    (
      req: FastifyRequest<{ Params: MemberParams; Body: UpdateMemberRoleBody }>,
      reply: FastifyReply
    ) => teamController.updateTeamMemberRole(req as any, reply)
  );
}
