import type {
  InvitationTokenInput,
  InvitationTokenOutput,
} from "@/models/types/InvitationToken.type.js";
import { prisma } from "@/prisma.js";

import type { IInvitationTokenRepository } from "./IInvitationTokenRepository.js";

class InvitationTokenRepository implements IInvitationTokenRepository {
  async create(data: InvitationTokenInput): Promise<InvitationTokenOutput> {
    const token = await prisma.invitationToken.create({
      data: {
        token: data.token,
        userId: data.userId,
        expiresAt: data.expiresAt,
      },
    });

    return {
      id: token.id,
      token: token.token,
      userId: token.userId,
      expiresAt: token.expiresAt,
      usedAt: token.usedAt,
      createdAt: token.createdAt,
    };
  }

  async findByToken(token: string): Promise<InvitationTokenOutput | null> {
    const record = await prisma.invitationToken.findUnique({
      where: { token },
    });

    if (!record) return null;

    return {
      id: record.id,
      token: record.token,
      userId: record.userId,
      expiresAt: record.expiresAt,
      usedAt: record.usedAt,
      createdAt: record.createdAt,
    };
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
