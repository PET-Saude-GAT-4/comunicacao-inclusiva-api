export type UserInput = {
  email: string;
  passwordHash: string;
  roleId: number;
};

export type UserUpdateInput = {
  email?: string;
  password?: string;
  roleId?: number;
};

export type UserOutput = {
  id: number;
  uuid: string;
  email: string;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
};
