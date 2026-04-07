export type SpecialityInput = {
  name: string;
  code: string;
  professionCode: string;
};

export type SpecialityRepositoryInput = {
  name: string;
  code: string;
  professionId: number;
};

export type SpecialityUpdate = {
  name?: string;
  code?: string;
};

export type SpecialityOutput = {
  id: number;
  name: string;
  code: string;
  professionId: number;
  createdAt: Date;
  updatedAt: Date;
};
