export type TokenPurpose = "INVITATION" | "PASSWORD_RESET";

export type UserTokenInput = {
  token: string;
  userId: number;
  purpose: TokenPurpose;
  expiresAt: Date;
};

export type UserTokenOutput = {
  id: number;
  token: string;
  userId: number;
  purpose: TokenPurpose;
  attempts: number;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
};
