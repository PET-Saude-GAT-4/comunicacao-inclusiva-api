import crypto from "node:crypto";

import { env } from "@/config/env.js";
import { BadRequestError } from "@/errors/BadRequestError.js";
import type { IUserRepository } from "@/repositories/user/IUserRepository.js";
import UserRepository from "@/repositories/user/UserRepository.js";
import type { IUserTokenRepository } from "@/repositories/user-token/IUserTokenRepository.js";
import UserTokenRepository from "@/repositories/user-token/UserTokenRepository.js";
import type { IMailService } from "@/services/mail/IMailService.js";
import MailService from "@/services/mail/MailService.js";

import type { IPasswordService } from "../password/IPasswordService.js";
import PasswordService from "../password/PasswordService.js";
import type { IInvitationService } from "./IInvitationService.js";

type Props = {
  userTokenRepository?: IUserTokenRepository;
  userRepository?: IUserRepository;
  mailService?: IMailService;
  passwordService?: IPasswordService;
};

class InvitationService implements IInvitationService {
  private _userTokenRepository: IUserTokenRepository;
  private _userRepository: IUserRepository;
  private _mailService: IMailService;
  private _passwordService: IPasswordService;

  constructor(props?: Props) {
    this._userTokenRepository =
      props?.userTokenRepository ?? new UserTokenRepository();
    this._userRepository = props?.userRepository ?? new UserRepository();
    this._mailService = props?.mailService ?? new MailService();
    this._passwordService = props?.passwordService ?? new PasswordService();
  }

  async sendInvitation(userId: number, email: string): Promise<void> {
    if (!userId || !email) {
      throw new BadRequestError("User ID and email are required");
    }

    await this._userTokenRepository.invalidateByUserId(userId, "INVITATION");

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(
      Date.now() + env.invitationExpiresHours * 60 * 60 * 1000,
    );

    await this._userTokenRepository.create({
      token,
      userId,
      purpose: "INVITATION",
      expiresAt,
    });

    const convite = `${env.frontendBaseUrl}/invitation/accept?token=${token}`;
    const subject = "Convite para ativação de conta";
    const html = `
      <p>Olá,</p>
      <p>Você foi convidado para criar uma conta na plataforma <strong>Comunicação Inclusiva</strong>.</p>
      <p>Para ativar sua conta e definir sua senha, acesse o convite abaixo:</p>
      <p><a href="${convite}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ativar Conta</a></p>
      <p>Ou copie e cole a URL no seu navegador:</p>
      <p><a href="${convite}">${convite}</a></p>
      <p>Este convite expira em ${env.invitationExpiresHours} horas.</p>
      <p>Se você não solicitou este convite, por favor desconsidere este e-mail.</p>
    `;

    await this._mailService.sendMail(email, subject, html);
  }

  async acceptInvitation(token: string, password: string): Promise<void> {
    if (!token) {
      throw new BadRequestError("Token is required");
    }

    const invitation = await this._userTokenRepository.findByToken(token);

    if (!invitation || invitation.purpose !== "INVITATION") {
      throw new BadRequestError("Invalid invitation token");
    }

    if (invitation.usedAt !== null) {
      throw new BadRequestError("This invitation has already been used");
    }

    if (invitation.expiresAt.getTime() < Date.now()) {
      throw new BadRequestError(
        "This invitation has expired. Please request a new one",
      );
    }

    const newPassword = await this._passwordService.validateAndHash(password);

    await this._userTokenRepository.consumeTokenAndSetPassword({
      tokenId: invitation.id,
      userId: invitation.userId,
      passwordHash: newPassword,
      confirmUser: true,
    });
  }

  async resendInvitation(email: string): Promise<void> {
    if (!email) {
      throw new BadRequestError("Email is required");
    }

    const user = await this._userRepository.findByEmail(email);

    if (!user || user.confirmedAt !== null) {
      return;
    }

    await this.sendInvitation(user.id, user.email);
  }
}

export default InvitationService;
