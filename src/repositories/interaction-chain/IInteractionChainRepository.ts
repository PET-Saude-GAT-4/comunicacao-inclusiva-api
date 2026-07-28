import type {
  InteractionChainOutput,
  InteractionChainRepositoryInput,
  InteractionChainRepositoryUpdateInput,
} from "@/models/types/InteractionChain.type.js";

import type { IRepository } from "../IRepository.js";

export interface IInteractionChainRepository extends IRepository<InteractionChainOutput> {
  create(
    data: InteractionChainRepositoryInput,
  ): Promise<InteractionChainOutput>;
  update(
    id: number,
    data: InteractionChainRepositoryUpdateInput,
  ): Promise<InteractionChainOutput>;
  delete(id: number): Promise<void>;

  findByTriggerBoardUuid(
    uuid: string,
  ): Promise<InteractionChainOutput[] | null>;
}
