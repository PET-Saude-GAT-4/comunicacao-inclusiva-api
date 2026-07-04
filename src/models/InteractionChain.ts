
export class InteractionChain {
    constructor(
        readonly id: number,
        readonly uuid: string,
        readonly createdAt : Date,
        readonly updatedAt : Date,

        private _triggerBoardUuid: string,
        private _responseBoardUuid: string,
        private _label ?: string,
    ){}

    public get triggerBoardUuid(): string {
        return this._triggerBoardUuid;
    }

    public get responseBoardUuid(): string {
        return this._responseBoardUuid;
    }

    public get label(): string | undefined {
        return this._label;
    }
}
