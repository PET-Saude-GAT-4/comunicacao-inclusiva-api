import { jest } from "@jest/globals";

import type { UserOutput } from "@/models/types/User.type.js";
import type { UserTokenOutput } from "@/models/types/UserToken.type.js";
import type { IUserRepository } from "@/repositories/user/IUserRepository.js";
import type { IUserTokenRepository } from "@/repositories/user-token/IUserTokenRepository.js";
import type { IInvitationService } from "@/services/invitation/IInvitationService.js";
import type { IMailService } from "@/services/mail/IMailService.js";
import type { IPasswordService } from "@/services/password/IPasswordService.js";

export function userRepositoryDouble() {
  return {
    findByEmail: jest
      .fn<IUserRepository["findByEmail"]>()
      .mockResolvedValue(null),
    findById: jest.fn<IUserRepository["findById"]>().mockResolvedValue(null),
    findPasswordHashByEmail: jest
      .fn<IUserRepository["findPasswordHashByEmail"]>()
      .mockResolvedValue(null),
  };
}

export function userTokenRepositoryDouble() {
  return {
    create: jest.fn<IUserTokenRepository["create"]>(),
    findByToken: jest
      .fn<IUserTokenRepository["findByToken"]>()
      .mockResolvedValue(null),
    invalidateByUserId: jest
      .fn<IUserTokenRepository["invalidateByUserId"]>()
      .mockResolvedValue(undefined),
    hasRecentToken: jest
      .fn<IUserTokenRepository["hasRecentToken"]>()
      .mockResolvedValue(false),
    consumeTokenAndSetPassword: jest
      .fn<IUserTokenRepository["consumeTokenAndSetPassword"]>()
      .mockResolvedValue(undefined),
  };
}

export function mailServiceDouble() {
  return {
    sendMail: jest.fn<IMailService["sendMail"]>().mockResolvedValue(undefined),
  };
}

export function passwordServiceDouble() {
  return {
    validateAndHash: jest
      .fn<IPasswordService["validateAndHash"]>()
      .mockResolvedValue("hashed-password"),
    compare: jest.fn<IPasswordService["compare"]>(),
  };
}

export function invitationServiceDouble() {
  return {
    sendInvitation: jest.fn<IInvitationService["sendInvitation"]>(),
    acceptInvitation: jest.fn<IInvitationService["acceptInvitation"]>(),
    resendInvitation: jest
      .fn<IInvitationService["resendInvitation"]>()
      .mockResolvedValue(undefined),
  };
}

// The services only call the methods above; the casts let these partial
// doubles stand in for the full interfaces.
export const asUserRepository = (d: ReturnType<typeof userRepositoryDouble>) =>
  d as unknown as IUserRepository;
export const asUserTokenRepository = (
  d: ReturnType<typeof userTokenRepositoryDouble>,
) => d as unknown as IUserTokenRepository;

export function aUser(overrides: Partial<UserOutput> = {}): UserOutput {
  const now = new Date();
  return {
    id: 7,
    uuid: "00000000-0000-4000-8000-000000000007",
    email: "ana@test.local",
    role: { id: 2, name: "admin", createdAt: now, updatedAt: now },
    confirmedAt: now,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function aToken(
  overrides: Partial<UserTokenOutput> = {},
): UserTokenOutput {
  return {
    id: 11,
    token: "stored-token",
    userId: 7,
    purpose: "PASSWORD_RESET",
    attempts: 0,
    expiresAt: new Date(Date.now() + 60_000),
    usedAt: null,
    createdAt: new Date(),
    ...overrides,
  };
}
