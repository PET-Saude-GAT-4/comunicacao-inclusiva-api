export type InteractionChainInput = {
  triggerBoardUuid: string;
  responseBoardUuid: string;
  rank?: number;
  label?: string | null;
};

export type InteractionChainUpdateInput = {
  triggerBoardUuid?: string;
  responseBoardUuid?: string;
  rank?: number;
  label?: string | null;
};

export type InteractionChainRepositoryInput = {
  triggerBoardId: number;
  responseBoardId: number;
  rank?: number | undefined;
  label?: string | null;
};

export type InteractionChainRepositoryUpdateInput = {
  triggerBoardId: number | undefined;
  responseBoardId: number | undefined;
  rank: number | undefined;
  label: string | null | undefined;
};

export type InteractionChainOutput = {
  id: number;
  uuid: string;
  triggerBoardUuid: string;
  triggerBoardAuthorUuid: string | null;
  triggerBoardPublishedAt: Date | null;
  responseBoardUuid: string;
  rank: number;
  label: string | null;
  createdAt: Date;
  updatedAt: Date;
};
