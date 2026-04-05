import type { RoleOutput } from "./Role.type.js";

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
  role: RoleOutput;
  createdAt: Date;
  updatedAt: Date;
};
