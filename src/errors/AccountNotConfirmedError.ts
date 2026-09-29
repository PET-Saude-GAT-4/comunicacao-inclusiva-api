import { ErrorBase } from "./base.error.js";

export class AccountNotConfirmedError extends ErrorBase {
  constructor(
    message = "Account not confirmed. Please check your email for the invitation link.",
  ) {
    super(403, message);
  }
}
