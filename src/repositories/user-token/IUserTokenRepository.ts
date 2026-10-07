import type {
  TokenPurpose,
  UserTokenInput,
  UserTokenOutput,
} from "@/models/types/UserToken.type.js";

interface IUserTokenRepository {
  create(data: UserTokenInput): Promise<UserTokenOutput>;
  findByToken(token: string): Promise<UserTokenOutput | null>;
  findActiveByUserIdAndPurpose(
    userId: number,
    purpose: TokenPurpose,
  ): Promise<UserTokenOutput | null>;
  markUsed(id: number): Promise<void>;
  invalidateByUserId(userId: number, purpose?: TokenPurpose): Promise<void>;
  hasRecentToken(
    userId: number,
    cooldownMinutes: number,
    purpose?: TokenPurpose,
  ): Promise<boolean>;
  incrementAttempts(id: number): Promise<number>;
  consumeTokenAndSetPassword(data: {
    tokenId: number;
    userId: number;
    passwordHash: string;
    confirmUser?: boolean;
  }): Promise<void>;
}

export type { IUserTokenRepository };
