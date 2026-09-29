import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

import { env } from "@/config/env.js";

import type { IMailService } from "./IMailService.js";

type Props = {
  transporter?: Transporter;
};

class MailService implements IMailService {
  private _transporter: Transporter;

  constructor(props?: Props) {
    if (props?.transporter) {
      this._transporter = props.transporter;
    } else {
      const transportOptions: SMTPTransport.Options = {
        host: env.smtpHost,
        port: env.smtpPort,
        secure: env.smtpSecure,
        ...(env.smtpUser && env.smtpPass
          ? {
              auth: {
                user: env.smtpUser,
                pass: env.smtpPass,
              },
            }
          : {}),
      };

      this._transporter = nodemailer.createTransport(transportOptions);
    }
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    await this._transporter.sendMail({
      from: env.smtpFrom,
      to,
      subject,
      html,
    });
  }
}

export default MailService;
