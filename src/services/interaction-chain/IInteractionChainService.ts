import type {
  ChainTrigger,
  InteractionChainInput,
  InteractionChainOutput,
  InteractionChainUpdateInput,
} from "@/models/types/InteractionChain.type.js";
import type { AuthenticatedUser } from "@/types/user.js";
import type { ListQuery, Page } from "@/utils/pagination.js";

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

  findPage(
    user: AuthenticatedUser,
    query: ListQuery,
  ): Promise<Page<InteractionChainOutput>>;

  findByUuid(
    uuid: string,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput | null>;

  findByTrigger(
    trigger: ChainTrigger,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput[]>;
}

export type { IInteractionChainService };
