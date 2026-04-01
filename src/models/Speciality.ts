export class Speciality {
  constructor(
    readonly id: number,
    readonly code: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,

    private _name: string,
    private _professionId: number,
  ) {}

  public get name(): string {
    return this._name;
  }

  public get professionId(): number {
    return this._professionId;
  }

  public set name(name: string) {
    this._name = name;
  }

  public set professionId(professionId: number) {
    this._professionId = professionId;
  }
}
