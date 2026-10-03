import crypto from "node:crypto";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "@/config/env.js";
import { AccountNotConfirmedError } from "@/errors/AccountNotConfirmedError.js";
import { BadRequestError } from "@/errors/BadRequestError.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";
import type { UserOutput } from "@/models/types/User.type.js";
import type { IUserRepository } from "@/repositories/user/IUserRepository.js";
import UserRepository from "@/repositories/user/UserRepository.js";
import type { IUserTokenRepository } from "@/repositories/user-token/IUserTokenRepository.js";
import UserTokenRepository from "@/repositories/user-token/UserTokenRepository.js";
import type { IInvitationService } from "@/services/invitation/IInvitationService.js";
import InvitationService from "@/services/invitation/InvitationService.js";
import type { IMailService } from "@/services/mail/IMailService.js";
import MailService from "@/services/mail/MailService.js";
import type { IPasswordService } from "@/services/password/IPasswordService.js";
import PasswordService from "@/services/password/PasswordService.js";
import { concatWithFrontendUrl } from "@/utils/url.js";

import type { IAuthService } from "./IAuthService.js";

type Props = {
  userRepository?: IUserRepository;
  userTokenRepository?: IUserTokenRepository;
  mailService?: IMailService;
  passwordService?: IPasswordService;
  invitationService?: IInvitationService;
};

class AuthService implements IAuthService {
  private _userRepository: IUserRepository;
  private _userTokenRepository: IUserTokenRepository;
  private _mailService: IMailService;
  private _passwordService: IPasswordService;
  private _invitationService: IInvitationService;

  constructor(props?: Props) {
    this._userRepository = props?.userRepository ?? new UserRepository();
    this._userTokenRepository =
      props?.userTokenRepository ?? new UserTokenRepository();
    this._mailService = props?.mailService ?? new MailService();
    this._passwordService = props?.passwordService ?? new PasswordService();
    this._invitationService =
      props?.invitationService ?? new InvitationService();
  }

  async login(email: string, password: string): Promise<[string, UserOutput]> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) throw new UnauthorizedError("Invalid credentials");

    if (user.confirmedAt === null) {
      throw new AccountNotConfirmedError();
    }

    const passwordHash =
      await this._userRepository.findPasswordHashByEmail(email);

    if (!passwordHash) throw new UnauthorizedError("Invalid credentials");

    const isValid = await bcrypt.compare(password, passwordHash);

    if (!isValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        role: user.role.name,
        confirmed: user.confirmedAt !== null,
      },
      env.jwtSecret,
      {
        expiresIn: env.jwtExpiresIn as NonNullable<
          jwt.SignOptions["expiresIn"]
        >,
      },
    );

    return [token, user];
  }

  async requestPasswordReset(email: string): Promise<void> {
    if (!email) return;

    const user = await this._userRepository.findByEmail(email);
    if (!user) return;

    const hasRecent = await this._userTokenRepository.hasRecentToken(
      user.id,
      2,
    );
    if (hasRecent) return;

    if (user.confirmedAt === null) {
      await this._invitationService.resendInvitation(email);
      return;
    }

    await this._userTokenRepository.invalidateByUserId(
      user.id,
      "PASSWORD_RESET",
    );

    const code = crypto.randomInt(10000000, 100000000).toString();
    const hashedCode = await bcrypt.hash(code, 12);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this._userTokenRepository.create({
      token: hashedCode,
      userId: user.id,
      purpose: "PASSWORD_RESET",
      expiresAt,
    });

    const params = new URLSearchParams({ email: user.email, code });
    const resetLink = concatWithFrontendUrl(
      `/reset-password?${params.toString()}`,
    );
    const subject = "Recuperação de Senha";
    const html = `
      <p>Olá,</p>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta na plataforma <strong>Comunicação Inclusiva</strong>.</p>
      <p>Seu código de recuperação é:</p>
      <h2 style="letter-spacing: 4px; font-size: 24px; color: #007bff;">${code}</h2>
      <p>Você também pode redefinir sua senha diretamente pelo link abaixo:</p>
      <p><a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Redefinir Senha</a></p>
      <p>Ou copie e cole a URL no seu navegador:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Este código expira em 15 minutos.</p>
      <p>Se você não solicitou a redefinição de senha, desconsidere este e-mail.</p>
    `;

    await this._mailService.sendMail(user.email, subject, html);
  }

  async confirmPasswordReset(
    email: string,
    code: string,
    password: string,
  ): Promise<void> {
    const invalidMessage = "Invalid or expired password reset code";

    if (!email || !code || !password) {
      throw new BadRequestError(invalidMessage);
    }

    const user = await this._userRepository.findByEmail(email);
    if (!user || user.confirmedAt === null) {
      throw new BadRequestError(invalidMessage);
    }

    const activeToken =
      await this._userTokenRepository.findActiveByUserIdAndPurpose(
        user.id,
        "PASSWORD_RESET",
      );

    if (!activeToken) {
      throw new BadRequestError(invalidMessage);
    }

    if (activeToken.attempts >= 5) {
      await this._userTokenRepository.markUsed(activeToken.id);
      throw new BadRequestError(invalidMessage);
    }

    const isValid = await bcrypt.compare(code, activeToken.token);
    if (!isValid) {
      const attempts = await this._userTokenRepository.incrementAttempts(
        activeToken.id,
      );
      if (attempts >= 5) {
        await this._userTokenRepository.markUsed(activeToken.id);
      }
      throw new BadRequestError(invalidMessage);
    }

    const passwordHash = await this._passwordService.validateAndHash(password);

    await this._userTokenRepository.consumeTokenAndSetPassword({
      tokenId: activeToken.id,
      userId: user.id,
      passwordHash,
    });
  }
}

export default AuthService;
