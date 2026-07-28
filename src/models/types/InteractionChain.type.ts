export type InteractionChainInput = {
  triggerBoardUuid: string;
  responseBoardUuid: string;
  label?: string | null;
};

export type InteractionChainUpdateInput = {
  triggerBoardUuid?: string;
  responseBoardUuid?: string;
  label?: string | null;
};

export type InteractionChainRepositoryInput = {
  triggerBoardId: number;
  responseBoardId: number;
  label?: string | null;
};

export type InteractionChainRepositoryUpdateInput = {
  triggerBoardId: number | undefined;
  responseBoardId: number | undefined;
  label: string | null | undefined;
};

export type InteractionChainOutput = {
  id: number;
  uuid: string;
  triggerBoardUuid: string;
  responseBoardUuid: string;
  label: string | null;
  createdAt: Date;
  updatedAt: Date;
};
