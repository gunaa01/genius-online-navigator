import { FastifyRequest, FastifyReply } from 'fastify';
import { organizationService } from '../services/organization.service';
import { authenticate } from '../utils/auth';

type CreateOrganizationRequest = FastifyRequest<{
  Body: {
    name: string;
    description?: string;
  };
}>;

type UpdateOrganizationRequest = FastifyRequest<{
  Params: { id: string };
  Body: {
    name?: string;
    description?: string;
  };
}>;

type OrganizationIdParam = FastifyRequest<{
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

export const organizationController = {
  async createOrganization(req: CreateOrganizationRequest, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const organization = await organizationService.createOrganization({
        name: req.body.name,
        description: req.body.description,
        userId: req.user.userId,
      });

      return reply.status(201).send(organization);
    } catch (error) {
      console.error('Error creating organization:', error);
      return reply.status(500).send({ error: 'Failed to create organization' });
    }
  },

  async getOrganization(req: OrganizationIdParam, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const organization = await organizationService.getOrganizationById(
        req.params.id,
        req.user.userId
      );
      if (!organization) {
        return reply.status(404).send({ error: 'Organization not found or access denied' });
      }

      return reply.send(organization);
    } catch (error) {
      console.error('Error fetching organization:', error);
      return reply.status(500).send({ error: 'Failed to fetch organization' });
    }
  },

  async updateOrganization(req: UpdateOrganizationRequest, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const organization = await organizationService.updateOrganization(
        req.params.id,
        {
          name: req.body.name,
          description: req.body.description,
        },
        req.user.userId
      );

      if (!organization) {
        return reply.status(404).send({ error: 'Organization not found or access denied' });
      }

      return reply.send(organization);
    } catch (error) {
      console.error('Error updating organization:', error);
      return reply.status(500).send({ error: 'Failed to update organization' });
    }
  },

  async deleteOrganization(req: OrganizationIdParam, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const organization = await organizationService.deleteOrganization(
        req.params.id,
        req.user.userId
      );
      if (!organization) {
        return reply.status(404).send({ error: 'Organization not found or access denied' });
      }

      return reply.send({ message: 'Organization deleted successfully' });
    } catch (error) {
      console.error('Error deleting organization:', error);
      return reply.status(500).send({ error: 'Failed to delete organization' });
    }
  },

  async getUserOrganizations(req: FastifyRequest, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const organizations = await organizationService.getOrganizationsForUser(req.user.userId);
      return reply.send(organizations);
    } catch (error) {
      console.error('Error fetching user organizations:', error);
      return reply.status(500).send({ error: 'Failed to fetch user organizations' });
    }
  },

  async addOrganizationMember(req: AddMemberRequest, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const member = await organizationService.addOrganizationMember(
        req.params.id,
        req.body.userId,
        req.body.role
      );
      return reply.status(201).send(member);
    } catch (error: any) {
      console.error('Error adding organization member:', error);
      return reply
        .status(500)
        .send({ error: error.message || 'Failed to add organization member' });
    }
  },

  async removeOrganizationMember(req: RemoveMemberRequest, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      await organizationService.removeOrganizationMember(
        req.params.id,
        req.params.userId,
        req.user.userId
      );
      return reply.send({ message: 'Member removed successfully' });
    } catch (error: any) {
      console.error('Error removing organization member:', error);
      return reply
        .status(500)
        .send({ error: error.message || 'Failed to remove organization member' });
    }
  },

  async updateOrganizationMemberRole(req: UpdateMemberRoleRequest, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const member = await organizationService.updateOrganizationMemberRole(
        req.params.id,
        req.params.userId,
        req.body.role,
        req.user.userId
      );
      return reply.send(member);
    } catch (error: any) {
      console.error('Error updating organization member role:', error);
      return reply
        .status(500)
        .send({ error: error.message || 'Failed to update organization member role' });
    }
  },
};
