export class Pictogram {
  constructor(
    readonly id: number,
    readonly uuid: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,

    private _description: string,
    private _storedFileId: number,
    private _fileUuid: string,
  ) {}

  public get description(): string {
    return this._description;
  }

  public get storedFileId(): number {
    return this._storedFileId;
  }

  public get fileUuid(): string {
    return this._fileUuid;
  }
}
