import type {
  TokenPurpose,
  UserTokenInput,
  UserTokenOutput,
} from "@/models/types/UserToken.type.js";
import { prisma } from "@/prisma.js";

import type { IUserTokenRepository } from "./IUserTokenRepository.js";

class UserTokenRepository implements IUserTokenRepository {
  async create(data: UserTokenInput): Promise<UserTokenOutput> {
    const token = await prisma.userToken.create({
      data: {
        token: data.token,
        userId: data.userId,
        purpose: data.purpose,
        expiresAt: data.expiresAt,
      },
    });

    return {
      id: token.id,
      token: token.token,
      userId: token.userId,
      purpose: token.purpose,
      attempts: token.attempts,
      expiresAt: token.expiresAt,
      usedAt: token.usedAt,
      createdAt: token.createdAt,
    };
  }

  async findByToken(token: string): Promise<UserTokenOutput | null> {
    const record = await prisma.userToken.findUnique({
      where: { token },
    });

    if (!record) return null;

    return {
      id: record.id,
      token: record.token,
      userId: record.userId,
      purpose: record.purpose,
      attempts: record.attempts,
      expiresAt: record.expiresAt,
      usedAt: record.usedAt,
      createdAt: record.createdAt,
    };
  }

  async findActiveByUserIdAndPurpose(
    userId: number,
    purpose: TokenPurpose,
  ): Promise<UserTokenOutput | null> {
    const record = await prisma.userToken.findFirst({
      where: {
        userId,
        purpose,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!record) return null;

    return {
      id: record.id,
      token: record.token,
      userId: record.userId,
      purpose: record.purpose,
      attempts: record.attempts,
      expiresAt: record.expiresAt,
      usedAt: record.usedAt,
      createdAt: record.createdAt,
    };
  }

  async markUsed(id: number): Promise<void> {
    await prisma.userToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async invalidateByUserId(
    userId: number,
    purpose?: TokenPurpose,
  ): Promise<void> {
    await prisma.userToken.updateMany({
      where: {
        userId,
        ...(purpose ? { purpose } : {}),
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async hasRecentToken(
    userId: number,
    cooldownMinutes: number,
    purpose?: TokenPurpose,
  ): Promise<boolean> {
    const threshold = new Date(Date.now() - cooldownMinutes * 60 * 1000);
    const count = await prisma.userToken.count({
      where: {
        userId,
        ...(purpose ? { purpose } : {}),
        createdAt: {
          gte: threshold,
        },
      },
    });

    return count > 0;
  }

  async incrementAttempts(id: number): Promise<number> {
    const updated = await prisma.userToken.update({
      where: { id },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    return updated.attempts;
  }

  async consumeTokenAndSetPassword(data: {
    tokenId: number;
    userId: number;
    passwordHash: string;
    confirmUser?: boolean;
  }): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.userToken.update({
        where: { id: data.tokenId },
        data: { usedAt: new Date() },
      });

      await tx.user.update({
        where: { id: data.userId },
        data: {
          passwordHash: data.passwordHash,
          ...(data.confirmUser ? { confirmedAt: new Date() } : {}),
        },
      });
    });
  }
}

export default UserTokenRepository;
