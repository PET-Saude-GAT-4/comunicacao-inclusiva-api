
export class User {
  constructor(
    readonly id: number,
    readonly uuid: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,

    private _email: string,
    private _passwordHash: string,

    private _roleId: number,
  ) {}

  public get email(): string {
    return this._email;
  }
  public get passwordHash(): string {
    return this._passwordHash;
  }

  public get roleId(): number {
    return this._roleId;
  }

  public set email(email: string) {
    this._email = email;
  }

  public set passwordHash(passwordHash: string) {
    this._passwordHash = passwordHash;
  }

  public set roleId(roleId: number) {
    this._roleId = roleId;
  }
}
