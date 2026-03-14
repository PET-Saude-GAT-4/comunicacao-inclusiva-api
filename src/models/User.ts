import { Role } from "./Role.js";

export class User {
  constructor(
    readonly id: number,
    readonly uuid: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,

    private _email: string,
    private _passwordHash: string,

    private _role: Role,
  ) {}

  public get email(): string {
    return this._email;
  }
  public get passwordHash(): string {
    return this._passwordHash;
  }

  public get role(): Role {
    return this._role;
  }

  public set email(email: string) {
    this._email = email;
  }

  public set passwordHash(passwordHash: string) {
    this._passwordHash = passwordHash;
  }

  public set role(role: Role) {
    this._role = role;
  }
}
