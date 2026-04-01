export type ProfessionInput = {
  name: string;
  code: string;
};

export type ProfessionUpdate = {
  name?: string;
  code?: string;
};

export type ProfessionOutput = {
  id: number;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
};
