export const RoleEnum = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  VIEWER: "viewer",
} as const;

export type RoleName = (typeof RoleEnum)[keyof typeof RoleEnum];

export type RoleInput = {
  name: string;
};

export type RoleOutput = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

