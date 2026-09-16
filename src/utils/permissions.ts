import { RoleEnum } from "@/models/types/Role.type.js";

export const ROLE_HIERARCHY: Record<string, number> = {
  [RoleEnum.VIEWER]: 1,
  [RoleEnum.ADMIN]: 2,
  [RoleEnum.SUPER_ADMIN]: 3,
};

/**
 * Verifica se um usuário (actorRole) tem permissão para gerenciar/atribuir outro cargo (targetRole).
 *
 * Regras:
 * - Super admin tem controle total.
 * - Admin pode criar, atualizar e deletar admin e viewer, mas não pode gerenciar ou atribuir super_admin.
 * - Viewer não pode gerenciar ninguém.
 */
export function canManageRole(actorRole: string, targetRole: string): boolean {
  if (actorRole === RoleEnum.SUPER_ADMIN) {
    return true;
  }

  if (actorRole === RoleEnum.ADMIN) {
    return targetRole !== RoleEnum.SUPER_ADMIN;
  }

  return false;
}
