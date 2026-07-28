export class InteractionChain {
  constructor(
    readonly id: number,
    readonly uuid: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,

    private _triggerBoardId: number,
    private _responseBoardId: number,
    private _label: string | null,
  ) {}

  public get triggerBoardId(): number {
    return this._triggerBoardId;
  }

  public get responseBoardId(): number {
    return this._responseBoardId;
  }

  public get label(): string | null {
    return this._label;
  }

  public set label(label: string | null) {
    this._label = label;
  }
}
