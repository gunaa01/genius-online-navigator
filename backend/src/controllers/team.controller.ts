import { FastifyRequest, FastifyReply } from 'fastify';
import { teamService } from '../services/team.service';
import { authenticate } from '../utils/auth';

type CreateTeamRequest = FastifyRequest<{
  Body: {
    name: string;
    description?: string;
  };
}>;

type UpdateTeamRequest = FastifyRequest<{
  Params: { id: string };
  Body: {
    name?: string;
    description?: string;
  };
}>;

type TeamIdParam = FastifyRequest<{
  Params: { id: string };
}>;

type AddMemberRequest = FastifyRequest<{
  Params: { id: string };
  Body: {
    userId: string;
    role?: string;
  };
}>;

type RemoveMemberRequest = FastifyRequest<{
  Params: { id: string; userId: string };
}>;

type UpdateMemberRoleRequest = FastifyRequest<{
  Params: { id: string; userId: string };
  Body: {
    role: string;
  };
}>;

export const teamController = {
  async createTeam(req: CreateTeamRequest, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const team = await teamService.createTeam({
        name: req.body.name,
        description: req.body.description,
        userId: req.user.userId,
      });

      return reply.status(201).send(team);
    } catch (error) {
      console.error('Error creating team:', error);
      return reply.status(500).send({ error: 'Failed to create team' });
    }
  },

  async getTeam(req: TeamIdParam, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const team = await teamService.getTeamById(req.params.id, req.user.userId);
      if (!team) {
        return reply.status(404).send({ error: 'Team not found or access denied' });
      }

      return reply.send(team);
    } catch (error) {
      console.error('Error fetching team:', error);
      return reply.status(500).send({ error: 'Failed to fetch team' });
    }
  },

  async updateTeam(req: UpdateTeamRequest, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const team = await teamService.updateTeam(
        req.params.id,
        {
          name: req.body.name,
          description: req.body.description,
        },
        req.user.userId
      );

      if (!team) {
        return reply.status(404).send({ error: 'Team not found or access denied' });
      }

      return reply.send(team);
    } catch (error) {
      console.error('Error updating team:', error);
      return reply.status(500).send({ error: 'Failed to update team' });
    }
  },

  async deleteTeam(req: TeamIdParam, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const team = await teamService.deleteTeam(req.params.id, req.user.userId);
      if (!team) {
        return reply.status(404).send({ error: 'Team not found or access denied' });
      }

      return reply.send({ message: 'Team deleted successfully' });
    } catch (error) {
      console.error('Error deleting team:', error);
      return reply.status(500).send({ error: 'Failed to delete team' });
    }
  },

  async getUserTeams(req: FastifyRequest, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const teams = await teamService.getTeamsForUser(req.user.userId);
      return reply.send(teams);
    } catch (error) {
      console.error('Error fetching user teams:', error);
      return reply.status(500).send({ error: 'Failed to fetch user teams' });
    }
  },

  async addTeamMember(req: AddMemberRequest, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const member = await teamService.addTeamMember(
        req.params.id,
        req.body.userId,
        req.body.role
      );
      return reply.status(201).send(member);
    } catch (error: any) {
      console.error('Error adding team member:', error);
      return reply.status(500).send({ error: error.message || 'Failed to add team member' });
    }
  },

  async removeTeamMember(req: RemoveMemberRequest, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      await teamService.removeTeamMember(
        req.params.id,
        req.params.userId,
        req.user.userId
      );
      return reply.send({ message: 'Member removed successfully' });
    } catch (error: any) {
      console.error('Error removing team member:', error);
      return reply.status(500).send({ error: error.message || 'Failed to remove team member' });
    }
  },

  async updateTeamMemberRole(req: UpdateMemberRoleRequest, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const member = await teamService.updateTeamMemberRole(
        req.params.id,
        req.params.userId,
        req.body.role,
        req.user.userId
      );
      return reply.send(member);
    } catch (error: any) {
      console.error('Error updating team member role:', error);
      return reply.status(500).send({ error: error.message || 'Failed to update team member role' });
    }
  },
};
