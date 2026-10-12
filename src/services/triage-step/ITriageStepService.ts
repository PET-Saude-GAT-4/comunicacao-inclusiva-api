import type {
  TriageStepInput,
  TriageStepOutput,
  TriageStepUpdateInput,
} from "@/models/types/TriageStep.type.js";
import type { AuthenticatedUser } from "@/types/user.js";

interface ITriageStepService {
  create(
    data: TriageStepInput,
    user: AuthenticatedUser,
  ): Promise<TriageStepOutput>;

  update(
    uuid: string,
    data: TriageStepUpdateInput,
    user: AuthenticatedUser,
  ): Promise<TriageStepOutput>;

  delete(uuid: string, user: AuthenticatedUser): Promise<void>;

  findAll(): Promise<TriageStepOutput[]>;

  findByUuid(uuid: string): Promise<TriageStepOutput | null>;

  findAllPublished(): Promise<TriageStepOutput[]>;
}

export type { ITriageStepService };
