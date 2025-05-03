import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateTeamInput {
  name: string;
  description?: string;
  userId: string;
}

interface UpdateTeamInput {
  name?: string;
  description?: string;
}

export const teamService = {
  async createTeam(data: CreateTeamInput) {
    return prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          name: data.name,
          description: data.description,
        },
      });

      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId: data.userId,
          role: 'admin',
        },
      });

      return team;
    });
  },

  async getTeamById(id: string, userId: string) {
    return prisma.team.findFirst({
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

  async updateTeam(id: string, data: UpdateTeamInput, userId: string) {
    return prisma.team.update({
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

  async deleteTeam(id: string, userId: string) {
    return prisma.team.delete({
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

  async getTeamsForUser(userId: string) {
    return prisma.team.findMany({
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

  async addTeamMember(teamId: string, userId: string, role = 'member') {
    return prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role,
      },
    });
  },

  async removeTeamMember(teamId: string, userId: string, requesterId: string) {
    // Only team admins can remove members
    const isAdmin = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: requesterId,
        role: 'admin',
      },
    });

    if (!isAdmin) {
      throw new Error('Insufficient permissions');
    }

    return prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });
  },

  async updateTeamMemberRole(teamId: string, userId: string, role: string, requesterId: string) {
    // Only team admins can update roles
    const isAdmin = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: requesterId,
        role: 'admin',
      },
    });

    if (!isAdmin) {
      throw new Error('Insufficient permissions');
    }

    return prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      data: {
        role,
      },
    });
  },
};
