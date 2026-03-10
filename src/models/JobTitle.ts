import type { User } from "./User.js";

export class JobTitle {
  constructor(
    readonly id: number,

    private _name: string,
    private _users: User[],
  ) {}

  public get name(): string {
    return this._name;
  }

  public get users(): User[] {
    return this._users;
  }

  public set name(name: string) {
    this._name = name;
  }

  public set users(users: User[]) {
    this._users = users;
  }
}
