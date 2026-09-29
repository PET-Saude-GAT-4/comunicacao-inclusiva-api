import type { RoleOutput } from "./Role.type.js";

export type UserInput = {
  email: string;
  roleId: number;
  confirmedAt?: Date | null;
};

export type UserUpdateInput = {
  email?: string;
  password?: string;
  passwordHash?: string | null;
  roleId?: number;
  confirmedAt?: Date | null;
};

export type UserOutput = {
  id: number;
  uuid: string;
  email: string;
  role: RoleOutput;
  confirmedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
