import type {
  InteractionChainInput,
  InteractionChainOutput,
  InteractionChainUpdateInput,
} from "@/models/types/InteractionChain.type.js";
import type { AuthenticatedUser } from "@/types/user.js";

interface IInteractionChainService {
  create(
    data: InteractionChainInput,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput>;

  update(
    uuid: string,
    data: InteractionChainUpdateInput,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput>;

  delete(uuid: string, user: AuthenticatedUser): Promise<void>;

  findAll(user: AuthenticatedUser): Promise<InteractionChainOutput[]>;

  findByUuid(
    uuid: string,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput | null>;

  findByTriggerBoardUuid(
    uuid: string,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput[]>;
}

export type { IInteractionChainService };
