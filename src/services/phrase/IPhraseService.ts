import type {
  PhraseInput,
  PhraseOutput,
  PhraseUpdateInput,
} from "@/models/types/Phrase.type.js";
import type { AuthenticatedUser } from "@/types/user.js";

interface IPhraseService {
  create(data: PhraseInput, user: AuthenticatedUser): Promise<PhraseOutput>;

  update(
    uuid: string,
    data: PhraseUpdateInput,
    user: AuthenticatedUser,
  ): Promise<PhraseOutput>;

  findAll(user: AuthenticatedUser): Promise<PhraseOutput[]>;

  findById(id: number): Promise<PhraseOutput | null>;

  findByUuid(
    uuid: string,
    user?: AuthenticatedUser,
  ): Promise<PhraseOutput | null>;

  findAllPublished(): Promise<PhraseOutput[]>;

  findPublishedByUuid(uuid: string): Promise<PhraseOutput | null>;

  publish(uuid: string, user: AuthenticatedUser): Promise<PhraseOutput>;

  unpublish(uuid: string, user: AuthenticatedUser): Promise<PhraseOutput>;

  delete(uuid: string, user: AuthenticatedUser): Promise<void>;
}

export type { IPhraseService };
