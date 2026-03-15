export class Profession{
    constructor(
    readonly id: number,
    readonly code: string,

    private _name: string,
  ) {}

  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public toJSON() {
    return {
      id: this.id,
      code: this.code,
      name: this.name
    };
  }

}