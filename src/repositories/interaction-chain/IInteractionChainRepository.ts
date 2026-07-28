import type {
  InteractionChainOutput,
  InteractionChainRepositoryInput,
  InteractionChainRepositoryUpdateInput,
} from "@/models/types/InteractionChain.type.js";

import type { IRepository } from "../IRepository.js";

export interface IInteractionChainRepository extends IRepository<InteractionChainOutput> {
  findAll(filter?: {
    triggerBoardAuthorUuid?: string;
  }): Promise<InteractionChainOutput[]>;

  create(
    data: InteractionChainRepositoryInput,
  ): Promise<InteractionChainOutput>;
  update(
    id: number,
    data: InteractionChainRepositoryUpdateInput,
  ): Promise<InteractionChainOutput>;
  delete(id: number): Promise<void>;

  findByUuid(uuid: string): Promise<InteractionChainOutput | null>;

  findByTriggerBoardUuid(uuid: string): Promise<InteractionChainOutput[]>;
}
