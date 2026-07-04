export type InteractionChainOutput = {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  triggerBoardUuid: string;
  responseBoardUuid: string;
  label?: string;
};

export type InteractionChainInput = {
  triggerBoardUuid: string;
  responseBoardUuid: string;
  label? : string;
};


export type InteractionChainUpdateInput = {
  triggerBoardUuid?: string;
  responseBoardUuid?: string;
  label?: string;
};