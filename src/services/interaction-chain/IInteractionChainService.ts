import type {
  InteractionChainInput,
  InteractionChainOutput,
} from "@/models/types/InteractionChain.type.js";
import type { AuthenticatedUser } from "@/types/user.js";

export interface IInteractionChainService {
  create(
    data: InteractionChainInput,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput>;
  update(
    id: number,
    data: InteractionChainInput,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput>;
  delete(id: number, user: AuthenticatedUser): Promise<void>;

  
}

