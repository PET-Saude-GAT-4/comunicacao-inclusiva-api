export type SpecialtyInput = {
  name: string;
  code: string;
  professionId: number;
};

export type SpecialtyUpdate = {
  name?: string;
  code?: string;
};

export type SpecialtyOutput = {
  id: number;
  name: string;
  code: string;
  professionId: number;
};
