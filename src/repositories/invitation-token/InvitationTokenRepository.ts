import type { InvitationToken } from "@/generated/prisma/client.js";
import { prisma } from "@/prisma.js";

import type { IInvitationTokenRepository } from "./IInvitationTokenRepository.js";

class InvitationTokenRepository implements IInvitationTokenRepository {
  async create(data: {
    token: string;
    userId: number;
    expiresAt: Date;
  }): Promise<InvitationToken> {
    return prisma.invitationToken.create({
      data: {
        token: data.token,
        userId: data.userId,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findByToken(token: string): Promise<InvitationToken | null> {
    return prisma.invitationToken.findUnique({
      where: { token },
    });
  }

  async markUsed(id: number): Promise<void> {
    await prisma.invitationToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async invalidateByUserId(userId: number): Promise<void> {
    await prisma.invitationToken.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async consumeTokenAndSetPassword(data: {
    tokenId: number;
    userId: number;
    passwordHash: string;
  }): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.invitationToken.update({
        where: { id: data.tokenId },
        data: { usedAt: new Date() },
      });

      await tx.user.update({
        where: { id: data.userId },
        data: {
          passwordHash: data.passwordHash,
          confirmedAt: new Date(),
        },
      });
    });
  }
}

export default InvitationTokenRepository;
