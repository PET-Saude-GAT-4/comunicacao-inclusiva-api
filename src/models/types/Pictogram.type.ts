export type PictogramInput = {
  description: string;
  file: {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    originalName: string;
    fileSize?: number;
  };
  userId?: number | null;
};

export type PictogramRepositoryInput = {
  description: string;
  storedFileId: number;
};

export type PictogramOutput = {
  id: number;
  uuid: string;
  description: string;
  fileUuid: string;
  createdAt: Date;
  updatedAt: Date;
};
