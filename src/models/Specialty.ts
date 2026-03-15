
export class Specialty {
  constructor(
    readonly id: number,
    readonly code: string,

    private _name: string,
    private _description: string,
  ) {}

  public get name(): string {
    return this._name;
  }

  public get description(): string {
    return this._description;
  }
  
  public set name(name: string) {
    this._name = name;
  }

  public set description(description: string) {
    this._description = description;
  }
}
