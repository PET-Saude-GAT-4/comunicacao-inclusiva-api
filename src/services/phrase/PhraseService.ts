import { ForbiddenError } from "@/errors/ForbiddenError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type {
  PhraseInput,
  PhraseOutput,
  PhraseUpdateInput,
} from "@/models/types/Phrase.type.js";
import { RoleEnum } from "@/models/types/Role.type.js";
import type { IPhraseRepository } from "@/repositories/phrase/IPhraseRepository.js";
import PhraseRepository from "@/repositories/phrase/PhraseRepository.js";
import type { IPictogramRepository } from "@/repositories/pictogram/IPictogramRepository.js";
import PictogramRepository from "@/repositories/pictogram/PictogramRepository.js";
import type { AuthenticatedUser } from "@/types/user.js";

import type { IPhraseService } from "./IPhraseService.js";

type Props = {
  phraseRepository?: IPhraseRepository;
  pictogramRepository?: IPictogramRepository;
};

class PhraseService implements IPhraseService {
  private _phraseRepository: IPhraseRepository;
  private _pictogramRepository: IPictogramRepository;

  constructor(props?: Props) {
    this._phraseRepository = props?.phraseRepository ?? new PhraseRepository();
    this._pictogramRepository =
      props?.pictogramRepository ?? new PictogramRepository();
  }

  private _assertCanManage(
    phrase: PhraseOutput,
    user: AuthenticatedUser,
  ): void {
    if (user.role === RoleEnum.SUPER_ADMIN) return;
    if (user.role === RoleEnum.ADMIN && phrase.authorUuid === user.uuid) return;
    throw new ForbiddenError("You are not allowed to manage this phrase.");
  }

  private _assertCanRead(phrase: PhraseOutput, user: AuthenticatedUser): void {
    if (user.role === RoleEnum.SUPER_ADMIN) return;
    if (phrase.publishedAt !== null) return;
    if (user.role === RoleEnum.ADMIN && phrase.authorUuid === user.uuid) return;
    throw new ForbiddenError("You are not allowed to access this phrase.");
  }

  private async _resolvePictogramIds(uuids: string[]): Promise<number[]> {
    const found = await this._pictogramRepository.findManyByUuids([
      ...new Set(uuids),
    ]);

    const idByUuid = new Map(found.map((p) => [p.uuid, p.id]));

    return uuids.map((uuid) => {
      const id = idByUuid.get(uuid);
      if (id === undefined) {
        throw new NotFoundError("Pictogram not found");
      }
      return id;
    });
  }

  private async _findByUuidOrThrow(uuid: string): Promise<PhraseOutput> {
    const phrase = await this._phraseRepository.findByUuid(uuid);

    if (!phrase) {
      throw new NotFoundError("Phrase not found");
    }

    return phrase;
  }

  async create(
    data: PhraseInput,
    user: AuthenticatedUser,
  ): Promise<PhraseOutput> {
    const pictogramIds = await this._resolvePictogramIds(data.pictogramUuids);

    return this._phraseRepository.create({
      description: data.description,
      authorId: user.id,
      pictogramIds,
    });
  }

  async update(
    uuid: string,
    data: PhraseUpdateInput,
    user: AuthenticatedUser,
  ): Promise<PhraseOutput> {
    const phrase = await this._findByUuidOrThrow(uuid);

    this._assertCanManage(phrase, user);

    let pictogramIds: number[] | undefined;
    if (data.pictogramUuids !== undefined) {
      pictogramIds = await this._resolvePictogramIds(data.pictogramUuids);
    }

    return this._phraseRepository.update(phrase.id, {
      description: data.description,
      pictogramIds,
    });
  }

  async findAll(user: AuthenticatedUser): Promise<PhraseOutput[]> {
    return this._phraseRepository.findAll(
      user.role === "admin" ? { authorUuid: user.uuid } : undefined,
    );
  }

  async findById(id: number): Promise<PhraseOutput | null> {
    return this._phraseRepository.findById(id);
  }

  async findByUuid(
    uuid: string,
    user?: AuthenticatedUser,
  ): Promise<PhraseOutput | null> {
    const phrase = await this._phraseRepository.findByUuid(uuid);

    if (phrase && user) {
      this._assertCanRead(phrase, user);
    }

    return phrase;
  }

  async findAllPublished(): Promise<PhraseOutput[]> {
    return this._phraseRepository.findAllPublished();
  }

  async findPublishedByUuid(uuid: string): Promise<PhraseOutput | null> {
    const phrase = await this._phraseRepository.findByUuid(uuid);

    if (!phrase || phrase.publishedAt === null) {
      return null;
    }

    return phrase;
  }

  async publish(uuid: string, user: AuthenticatedUser): Promise<PhraseOutput> {
    const phrase = await this._findByUuidOrThrow(uuid);

    this._assertCanManage(phrase, user);

    if (phrase.publishedAt !== null) {
      return phrase;
    }

    return this._phraseRepository.setPublishedAt(phrase.id, new Date());
  }

  async unpublish(
    uuid: string,
    user: AuthenticatedUser,
  ): Promise<PhraseOutput> {
    const phrase = await this._findByUuidOrThrow(uuid);

    this._assertCanManage(phrase, user);

    if (phrase.publishedAt === null) {
      return phrase;
    }

    return this._phraseRepository.setPublishedAt(phrase.id, null);
  }

  async delete(uuid: string, user: AuthenticatedUser): Promise<void> {
    const phrase = await this._findByUuidOrThrow(uuid);

    this._assertCanManage(phrase, user);

    await this._phraseRepository.delete(phrase.id);
  }
}

export default PhraseService;
