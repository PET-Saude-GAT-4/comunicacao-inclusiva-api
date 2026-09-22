import type {
  ChainTrigger,
  InteractionChainOutput,
  InteractionChainRepositoryInput,
  InteractionChainRepositoryUpdateInput,
  TriggerRef,
} from "@/models/types/InteractionChain.type.js";

import type { IRepository } from "../IRepository.js";

export interface IInteractionChainRepository extends IRepository<InteractionChainOutput> {
  findAll(filter?: {
    triggerAuthorUuid?: string;
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

  findByTrigger(trigger: ChainTrigger): Promise<InteractionChainOutput[]>;

  findByTriggerAndResponse(
    trigger: TriggerRef,
    responseBoardId: number,
  ): Promise<InteractionChainOutput | null>;
}
