export type InvitationTokenInput = {
  token: string;
  userId: number;
  expiresAt: Date;
};

export type InvitationTokenOutput = {
  id: number;
  token: string;
  userId: number;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
};
