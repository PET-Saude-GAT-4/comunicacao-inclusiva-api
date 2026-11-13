import { beforeEach, describe, expect, it } from "@jest/globals";

import { env } from "@/config/env.js";
import { BadRequestError } from "@/errors/BadRequestError.js";
import InvitationService from "@/services/invitation/InvitationService.js";

import {
  asUserRepository,
  asUserTokenRepository,
  aToken,
  aUser,
  mailServiceDouble,
  passwordServiceDouble,
  userRepositoryDouble,
  userTokenRepositoryDouble,
} from "./doubles.js";

let users: ReturnType<typeof userRepositoryDouble>;
let tokens: ReturnType<typeof userTokenRepositoryDouble>;
let mail: ReturnType<typeof mailServiceDouble>;
let passwords: ReturnType<typeof passwordServiceDouble>;
let service: InvitationService;

beforeEach(() => {
  users = userRepositoryDouble();
  tokens = userTokenRepositoryDouble();
  mail = mailServiceDouble();
  passwords = passwordServiceDouble();
  service = new InvitationService({
    userRepository: asUserRepository(users),
    userTokenRepository: asUserTokenRepository(tokens),
    mailService: mail,
    passwordService: passwords,
  });
});

describe("InvitationService.sendInvitation", () => {
  it("retires older invitations, stores a new one and mails its link", async () => {
    const before = Date.now();

    await service.sendInvitation(7, "ana@test.local");

    expect(tokens.invalidateByUserId).toHaveBeenCalledWith(7, "INVITATION");
    const stored = tokens.create.mock.calls[0]![0];
    expect(stored).toMatchObject({ userId: 7, purpose: "INVITATION" });

    const validity = env.invitationExpiresHours * 60 * 60 * 1000;
    expect(stored.expiresAt.getTime()).toBeGreaterThanOrEqual(
      before + validity,
    );
    expect(stored.expiresAt.getTime()).toBeLessThanOrEqual(
      Date.now() + validity,
    );

    const [to, , html] = mail.sendMail.mock.calls[0]!;
    expect(to).toBe("ana@test.local");
    expect(html).toContain(`/invitation/accept?token=${stored.token}`);
  });

  it("requires a user id and an email", async () => {
    await expect(service.sendInvitation(0, "ana@test.local")).rejects.toThrow(
      BadRequestError,
    );
    await expect(service.sendInvitation(7, "")).rejects.toThrow(
      BadRequestError,
    );
    expect(mail.sendMail).not.toHaveBeenCalled();
  });
});

describe("InvitationService.acceptInvitation", () => {
  it("sets the password and confirms the account", async () => {
    tokens.findByToken.mockResolvedValue(aToken({ purpose: "INVITATION" }));

    await service.acceptInvitation("invite-token", "chosen-password");

    expect(tokens.findByToken).toHaveBeenCalledWith("invite-token");
    expect(tokens.consumeTokenAndSetPassword).toHaveBeenCalledWith({
      tokenId: 11,
      userId: 7,
      passwordHash: "hashed-password",
      confirmUser: true,
    });
  });

  it.each([
    ["unknown", null],
    ["a password reset token", aToken({ purpose: "PASSWORD_RESET" })],
    ["used", aToken({ purpose: "INVITATION", usedAt: new Date() })],
    [
      "expired",
      aToken({ purpose: "INVITATION", expiresAt: new Date(Date.now() - 1000) }),
    ],
  ])("rejects a token that is %s", async (_label, record) => {
    tokens.findByToken.mockResolvedValue(record);

    await expect(
      service.acceptInvitation("invite-token", "chosen-password"),
    ).rejects.toThrow(BadRequestError);
    expect(tokens.consumeTokenAndSetPassword).not.toHaveBeenCalled();
  });

  it("requires a token", async () => {
    await expect(
      service.acceptInvitation("", "chosen-password"),
    ).rejects.toThrow(BadRequestError);
  });

  it("keeps the invitation when the password is refused", async () => {
    tokens.findByToken.mockResolvedValue(aToken({ purpose: "INVITATION" }));
    passwords.validateAndHash.mockRejectedValue(
      new BadRequestError("too short"),
    );

    await expect(service.acceptInvitation("invite-token", "x")).rejects.toThrow(
      BadRequestError,
    );
    expect(tokens.consumeTokenAndSetPassword).not.toHaveBeenCalled();
  });
});

describe("InvitationService.resendInvitation", () => {
  it("sends a new invitation to a pending account", async () => {
    users.findByEmail.mockResolvedValue(aUser({ confirmedAt: null }));

    await service.resendInvitation("ana@test.local");

    expect(tokens.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 7, purpose: "INVITATION" }),
    );
    expect(mail.sendMail).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["unknown", null],
    ["already confirmed", aUser()],
  ])("does nothing for an account that is %s", async (_label, user) => {
    users.findByEmail.mockResolvedValue(user);

    await service.resendInvitation("ana@test.local");

    expect(tokens.create).not.toHaveBeenCalled();
    expect(mail.sendMail).not.toHaveBeenCalled();
  });

  it("requires an email", async () => {
    await expect(service.resendInvitation("")).rejects.toThrow(BadRequestError);
  });
});
