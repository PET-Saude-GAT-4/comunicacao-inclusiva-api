export type BoardPictogramInput = {
  pictogramUuid: string;
  next?: string | null;
};

export type BoardPictogramRepositoryInput = {
  boardId: number;
  pictogramId: number;
  next: number | null;
};
