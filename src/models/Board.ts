export class Board {
  constructor(
    readonly id: number,
    readonly uuid: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,

    private _title: string,
    private _authorId: number | null,
    private _representativeId: number,
  ) {}

  public get title(): string {
    return this._title;
  }

  public get authorId(): number | null {
    return this._authorId;
  }

  public get representativeId(): number {
    return this._representativeId;
  }

  public set title(title: string) {
    this._title = title;
  }
}
