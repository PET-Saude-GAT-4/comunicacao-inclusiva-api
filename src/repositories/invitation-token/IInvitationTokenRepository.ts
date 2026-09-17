import type { InvitationToken } from "@/generated/prisma/client.js";

interface IInvitationTokenRepository {
  create(data: {
    token: string;
    userId: number;
    expiresAt: Date;
  }): Promise<InvitationToken>;
  findByToken(token: string): Promise<InvitationToken | null>;
  markUsed(id: number): Promise<void>;
  invalidateByUserId(userId: number): Promise<void>;
  consumeTokenAndSetPassword(data: {
    tokenId: number;
    userId: number;
    passwordHash: string;
  }): Promise<void>;
}

export type { IInvitationTokenRepository };
