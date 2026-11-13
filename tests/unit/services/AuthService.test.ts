import crypto from "node:crypto";

import { beforeEach, describe, expect, it } from "@jest/globals";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "@/config/env.js";
import { AccountNotConfirmedError } from "@/errors/AccountNotConfirmedError.js";
import { BadRequestError } from "@/errors/BadRequestError.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";
import AuthService from "@/services/auth/AuthService.js";

import {
  asUserRepository,
  asUserTokenRepository,
  aToken,
  aUser,
  invitationServiceDouble,
  mailServiceDouble,
  passwordServiceDouble,
  userRepositoryDouble,
  userTokenRepositoryDouble,
} from "./doubles.js";

const sha256 = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

let users: ReturnType<typeof userRepositoryDouble>;
let tokens: ReturnType<typeof userTokenRepositoryDouble>;
let mail: ReturnType<typeof mailServiceDouble>;
let passwords: ReturnType<typeof passwordServiceDouble>;
let invitations: ReturnType<typeof invitationServiceDouble>;
let service: AuthService;

beforeEach(() => {
  users = userRepositoryDouble();
  tokens = userTokenRepositoryDouble();
  mail = mailServiceDouble();
  passwords = passwordServiceDouble();
  invitations = invitationServiceDouble();
  service = new AuthService({
    userRepository: asUserRepository(users),
    userTokenRepository: asUserTokenRepository(tokens),
    mailService: mail,
    passwordService: passwords,
    invitationService: invitations,
  });
});

describe("AuthService.login", () => {
  it("signs a token carrying the user's identity and role", async () => {
    const user = aUser();
    users.findByEmail.mockResolvedValue(user);
    users.findPasswordHashByEmail.mockResolvedValue(
      await bcrypt.hash("secret-pass", 4),
    );

    const [token, returned] = await service.login(user.email, "secret-pass");

    expect(returned).toBe(user);
    expect(jwt.verify(token, env.jwtSecret)).toMatchObject({
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: "admin",
      confirmed: true,
    });
  });

  it("rejects a wrong password", async () => {
    users.findByEmail.mockResolvedValue(aUser());
    users.findPasswordHashByEmail.mockResolvedValue(
      await bcrypt.hash("secret-pass", 4),
    );

    await expect(service.login("ana@test.local", "wrong")).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("rejects an unknown email", async () => {
    await expect(service.login("nobody@test.local", "x")).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("rejects a confirmed user without a password", async () => {
    users.findByEmail.mockResolvedValue(aUser());

    await expect(service.login("ana@test.local", "x")).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("rejects an unconfirmed account before checking the password", async () => {
    users.findByEmail.mockResolvedValue(aUser({ confirmedAt: null }));

    await expect(service.login("ana@test.local", "x")).rejects.toThrow(
      AccountNotConfirmedError,
    );
    expect(users.findPasswordHashByEmail).not.toHaveBeenCalled();
  });
});

describe("AuthService.requestPasswordReset", () => {
  it("stores a hashed token, retires older ones and mails the raw token", async () => {
    const user = aUser();
    users.findByEmail.mockResolvedValue(user);

    await service.requestPasswordReset(user.email);

    expect(tokens.invalidateByUserId).toHaveBeenCalledWith(
      user.id,
      "PASSWORD_RESET",
    );
    expect(tokens.create).toHaveBeenCalledTimes(1);
    const stored = tokens.create.mock.calls[0]![0];
    expect(stored).toMatchObject({
      userId: user.id,
      purpose: "PASSWORD_RESET",
    });

    expect(mail.sendMail).toHaveBeenCalledTimes(1);
    const [to, , html] = mail.sendMail.mock.calls[0]!;
    expect(to).toBe(user.email);
    const rawToken = html.match(/token=([a-f0-9]+)/)?.[1];
    expect(rawToken).toBeDefined();
    expect(sha256(rawToken!)).toBe(stored.token);
  });

  it("expires the token after 15 minutes", async () => {
    users.findByEmail.mockResolvedValue(aUser());
    const before = Date.now();

    await service.requestPasswordReset("ana@test.local");

    const { expiresAt } = tokens.create.mock.calls[0]![0];
    const fifteenMinutes = 15 * 60 * 1000;
    expect(expiresAt.getTime()).toBeGreaterThanOrEqual(before + fifteenMinutes);
    expect(expiresAt.getTime()).toBeLessThanOrEqual(
      Date.now() + fifteenMinutes,
    );
  });

  it("does nothing for an unknown email", async () => {
    await service.requestPasswordReset("nobody@test.local");

    expect(tokens.create).not.toHaveBeenCalled();
    expect(mail.sendMail).not.toHaveBeenCalled();
  });

  it("does nothing while a token issued in the last 2 minutes exists", async () => {
    users.findByEmail.mockResolvedValue(aUser());
    tokens.hasRecentToken.mockResolvedValue(true);

    await service.requestPasswordReset("ana@test.local");

    expect(tokens.hasRecentToken).toHaveBeenCalledWith(7, 2, "PASSWORD_RESET");
    expect(tokens.create).not.toHaveBeenCalled();
    expect(mail.sendMail).not.toHaveBeenCalled();
  });

  it("re-sends the invitation instead when the account is not confirmed", async () => {
    users.findByEmail.mockResolvedValue(aUser({ confirmedAt: null }));

    await service.requestPasswordReset("ana@test.local");

    expect(invitations.resendInvitation).toHaveBeenCalledWith("ana@test.local");
    expect(tokens.create).not.toHaveBeenCalled();
    expect(mail.sendMail).not.toHaveBeenCalled();
  });
});

describe("AuthService.confirmPasswordReset", () => {
  it("looks the token up by its hash and sets the new password", async () => {
    tokens.findByToken.mockResolvedValue(aToken());
    users.findById.mockResolvedValue(aUser());

    await service.confirmPasswordReset("raw-token", "new-password");

    expect(tokens.findByToken).toHaveBeenCalledWith(sha256("raw-token"));
    expect(passwords.validateAndHash).toHaveBeenCalledWith("new-password");
    expect(tokens.consumeTokenAndSetPassword).toHaveBeenCalledWith({
      tokenId: 11,
      userId: 7,
      passwordHash: "hashed-password",
    });
  });

  it.each([
    ["unknown", null],
    ["used", aToken({ usedAt: new Date() })],
    ["expired", aToken({ expiresAt: new Date(Date.now() - 1000) })],
    ["an invitation", aToken({ purpose: "INVITATION" })],
  ])("rejects a token that is %s", async (_label, record) => {
    tokens.findByToken.mockResolvedValue(record);
    users.findById.mockResolvedValue(aUser());

    await expect(
      service.confirmPasswordReset("raw-token", "new-password"),
    ).rejects.toThrow(BadRequestError);
    expect(tokens.consumeTokenAndSetPassword).not.toHaveBeenCalled();
  });

  it("rejects the token of an account that is not confirmed", async () => {
    tokens.findByToken.mockResolvedValue(aToken());
    users.findById.mockResolvedValue(aUser({ confirmedAt: null }));

    await expect(
      service.confirmPasswordReset("raw-token", "new-password"),
    ).rejects.toThrow(BadRequestError);
    expect(tokens.consumeTokenAndSetPassword).not.toHaveBeenCalled();
  });

  it("keeps the token when the new password is refused", async () => {
    tokens.findByToken.mockResolvedValue(aToken());
    users.findById.mockResolvedValue(aUser());
    passwords.validateAndHash.mockRejectedValue(
      new BadRequestError("too short"),
    );

    await expect(
      service.confirmPasswordReset("raw-token", "x"),
    ).rejects.toThrow(BadRequestError);
    expect(tokens.consumeTokenAndSetPassword).not.toHaveBeenCalled();
  });
});
