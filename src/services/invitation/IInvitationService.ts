interface IInvitationService {
  sendInvitation(userId: number, email: string): Promise<void>;
  acceptInvitation(token: string, password: string): Promise<void>;
  resendInvitation(email: string): Promise<void>;
}

export type { IInvitationService };
