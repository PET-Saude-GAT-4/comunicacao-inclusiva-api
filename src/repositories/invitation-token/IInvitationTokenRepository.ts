import type {
  InvitationTokenInput,
  InvitationTokenOutput,
} from "@/models/types/InvitationToken.type.js";

interface IInvitationTokenRepository {
  create(data: InvitationTokenInput): Promise<InvitationTokenOutput>;
  findByToken(token: string): Promise<InvitationTokenOutput | null>;
  markUsed(id: number): Promise<void>;
  invalidateByUserId(userId: number): Promise<void>;
  consumeTokenAndSetPassword(data: {
    tokenId: number;
    userId: number;
    passwordHash: string;
  }): Promise<void>;
}

export type { IInvitationTokenRepository };
