import type {
  TriageStepFilter,
  TriageStepOutput,
  TriageStepRepositoryInput,
} from "@/models/types/TriageStep.type.js";

import type { IRepository } from "../IRepository.js";

export interface ITriageStepRepository extends IRepository<TriageStepOutput> {
  findAll(filter?: TriageStepFilter): Promise<TriageStepOutput[]>;

  create(data: TriageStepRepositoryInput): Promise<TriageStepOutput>;

  moveToLevel(id: number, level: number): Promise<TriageStepOutput | null>;

  delete(id: number): Promise<void>;

  findByUuid(uuid: string): Promise<TriageStepOutput | null>;

  existsByBoardId(boardId: number): Promise<boolean>;

  existsByLevel(level: number): Promise<boolean>;
}
