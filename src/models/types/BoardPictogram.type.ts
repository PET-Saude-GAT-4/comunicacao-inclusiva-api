export type BoardPictogramInput = {
  pictogramUuid: string;
  order?: number;
};

export type BoardPictogramRepositoryInput = {
  boardId: number;
  pictogramId: number;
  order: number;
};
