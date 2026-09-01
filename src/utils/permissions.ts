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
 * - Demais cargos só podem gerenciar cargos com nível estritamente menor que o seu.
 */
export function canManageRole(actorRole: string, targetRole: string): boolean {
  const actorLevel = ROLE_HIERARCHY[actorRole] ?? 0;
  const targetLevel = ROLE_HIERARCHY[targetRole] ?? 0;

  if (actorLevel === 0 || targetLevel === 0) {
    return false;
  }

  if (actorRole === RoleEnum.SUPER_ADMIN) {
    return true;
  }

  return actorLevel > targetLevel;
}
