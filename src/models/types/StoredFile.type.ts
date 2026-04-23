export type FileType =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "archive"
  | "other";

export type FileObject = {
  originalName: string;
  mimeType: string;
  filename: string;
  buffer: Buffer<ArrayBufferLike>;
  fileSize?: number | undefined;
};

export type StoredFileInput = {
  originalName: string;
  mimeType: string;
  filename: string;
  fileSize?: number | undefined;
  buffer: Buffer;
  purpose?: string | undefined;
  isPrivate?: boolean | undefined;
  userId?: number | undefined;
};

export type StoredFileCreateData = {
  uuid?: string | undefined;
  location: string;
  filename: string;
  originalName: string;
  fileSize?: number | undefined;
  mimeType: string;
  fileType: FileType;
  purpose?: string | undefined;
  isPrivate?: boolean | undefined;
  userId?: number | undefined;
};

export type StoredFileOutput = {
  id: number;
  uuid: string;
  location: string;
  filename: string;
  originalName: string;
  fileSize: bigint | null;
  mimeType: string;
  fileType: FileType;
  purpose: string | null;
  isPrivate: boolean;
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type FileSaveResult = {
  uuid: string;
  filename: string;
  location: string;
};

export type FileStoreResult = {
  id: number;
  uuid: string;
  filename: string;
  location: string;
};
