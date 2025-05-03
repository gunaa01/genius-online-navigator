import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateOrganizationInput {
  name: string;
  description?: string;
  userId: string;
}

interface UpdateOrganizationInput {
  name?: string;
  description?: string;
}

export const organizationService = {
  async createOrganization(data: CreateOrganizationInput) {
    return prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: data.name,
          description: data.description,
        },
      });

      await tx.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId: data.userId,
          role: 'admin',
        },
      });

      return organization;
    });
  },

  async getOrganizationById(id: string, userId: string) {
    return prisma.organization.findFirst({
      where: {
        id,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
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
        },
      },
    });
  },

  async updateOrganization(id: string, data: UpdateOrganizationInput, userId: string) {
    return prisma.organization.update({
      where: {
        id,
        members: {
          some: {
            userId,
            role: 'admin',
          },
        },
      },
      data,
    });
  },

  async deleteOrganization(id: string, userId: string) {
    return prisma.organization.delete({
      where: {
        id,
        members: {
          some: {
            userId,
            role: 'admin',
          },
        },
      },
    });
  },

  async getOrganizationsForUser(userId: string) {
    return prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });
  },

  async addOrganizationMember(organizationId: string, userId: string, role = 'member') {
    return prisma.organizationMember.create({
      data: {
        organizationId,
        userId,
        role,
      },
    });
  },

  async removeOrganizationMember(organizationId: string, userId: string, requesterId: string) {
    // Only organization admins can remove members
    const isAdmin = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId: requesterId,
        role: 'admin',
      },
    });

    if (!isAdmin) {
      throw new Error('Insufficient permissions');
    }

    return prisma.organizationMember.delete({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });
  },

  async updateOrganizationMemberRole(
    organizationId: string,
    userId: string,
    role: string,
    requesterId: string
  ) {
    // Only organization admins can update roles
    const isAdmin = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId: requesterId,
        role: 'admin',
      },
    });

    if (!isAdmin) {
      throw new Error('Insufficient permissions');
    }

    return prisma.organizationMember.update({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
      data: {
        role,
      },
    });
  },
};
