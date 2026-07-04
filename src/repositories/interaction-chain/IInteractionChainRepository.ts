import type {
  InteractionChainInput,
  InteractionChainOutput,
  InteractionChainUpdateInput,
} from "@/models/types/InteractionChain.type.js";

import type { IRepository } from "../IRepository.js";

export interface IInteractionChainRepository extends IRepository<InteractionChainOutput> {
  create(data: InteractionChainInput): Promise<InteractionChainOutput>;
  update(
    id: number,
    data: InteractionChainUpdateInput,
  ): Promise<InteractionChainOutput>;
  delete(id: number): Promise<void>;
}
