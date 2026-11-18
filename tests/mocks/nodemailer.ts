// Stands in for the nodemailer package in every test suite (see the
// moduleNameMapper in jest.base.config.js): messages land in `outbox` instead
// of an SMTP server, so tests can read the links that would have been sent.

export type SentMail = {
  from?: string;
  to: string;
  subject: string;
  html: string;
};

export const outbox: SentMail[] = [];

function createTransport() {
  return {
    async sendMail(mail: SentMail) {
      outbox.push(mail);
      return { messageId: `test-${outbox.length}` };
    },
  };
}

export default { createTransport };
