export class Person {
  constructor(
    readonly id: number,
    readonly uuid: string,
    readonly cpf: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,

    private _firstName: string,
    private _lastName: string | null,
    private _cardId: string,
  ) {}

  public get firstName(): string {
    return this._firstName;
  }

  public get lastName(): string | null {
    return this._lastName;
  }

  public get cardId() {
    return this._cardId;
  }

  public set firstName(firstName: string) {
    this._firstName = firstName;
  }

  public set lastName(lastName: string | null) {
    this._lastName = lastName;
  }

  public set cardId(cardId: string) {
    this._cardId = cardId;
  }
}
