import { BadRequestError } from "@/errors/BadRequestError.js";
import { ConflictError } from "@/errors/ConflictError.js";
import { ForbiddenError } from "@/errors/ForbiddenError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { BoardOutput } from "@/models/types/Board.type.js";
import type {
  ChainTrigger,
  InteractionChainInput,
  InteractionChainOutput,
  InteractionChainUpdateInput,
  TriggerRef,
} from "@/models/types/InteractionChain.type.js";
import { RoleEnum } from "@/models/types/Role.type.js";
import BoardRepository from "@/repositories/board/BoardRepository.js";
import type { IBoardRepository } from "@/repositories/board/IBoardRepository.js";
import type { IInteractionChainRepository } from "@/repositories/interaction-chain/IInteractionChainRepository.js";
import InteractionChainRepository from "@/repositories/interaction-chain/InteractionChainRepository.js";
import type { IPhraseRepository } from "@/repositories/phrase/IPhraseRepository.js";
import PhraseRepository from "@/repositories/phrase/PhraseRepository.js";
import type { AuthenticatedUser } from "@/types/user.js";

import type { IInteractionChainService } from "./IInteractionChainService.js";

type Props = {
  boardRepository?: IBoardRepository;
  phraseRepository?: IPhraseRepository;
  interactionChainRepository?: IInteractionChainRepository;
};

// Whatever the arc points at, only these three fields drive the rules below.
type ResolvedTrigger = {
  id: number;
  authorUuid: string | null;
  publishedAt: Date | null;
};

class InteractionChainService implements IInteractionChainService {
  private _boardRepository: IBoardRepository;
  private _phraseRepository: IPhraseRepository;
  private _interactionChainRepository: IInteractionChainRepository;

  constructor(props?: Props) {
    this._boardRepository = props?.boardRepository ?? new BoardRepository();
    this._phraseRepository = props?.phraseRepository ?? new PhraseRepository();
    this._interactionChainRepository =
      props?.interactionChainRepository ?? new InteractionChainRepository();
  }

  private _assertCanManage(
    triggerAuthorUuid: string | null,
    user: AuthenticatedUser,
  ): void {
    if (user.role === RoleEnum.SUPER_ADMIN) return;
    if (user.role === RoleEnum.ADMIN && triggerAuthorUuid === user.uuid) return;
    throw new ForbiddenError(
      "You are not allowed to manage this interaction chain.",
    );
  }

  private _assertCanRead(
    triggerAuthorUuid: string | null,
    triggerPublishedAt: Date | null,
    user: AuthenticatedUser,
  ): void {
    if (user.role === RoleEnum.SUPER_ADMIN) return;
    if (triggerPublishedAt !== null) return;
    if (user.role === RoleEnum.ADMIN && triggerAuthorUuid === user.uuid) return;
    throw new ForbiddenError(
      "You are not allowed to access this interaction chain.",
    );
  }

  private async _findTrigger(
    trigger: ChainTrigger,
  ): Promise<ResolvedTrigger | null> {
    if (trigger.type === "board") {
      const board = await this._boardRepository.findByUuid(trigger.uuid);
      if (!board) return null;
      return {
        id: board.id,
        authorUuid: board.authorUuid,
        publishedAt: board.publishedAt,
      };
    }

    const phrase = await this._phraseRepository.findByUuid(trigger.uuid);
    if (!phrase) return null;
    return {
      id: phrase.id,
      authorUuid: phrase.authorUuid,
      publishedAt: phrase.publishedAt,
    };
  }

  private async _requireTrigger(
    trigger: ChainTrigger,
  ): Promise<ResolvedTrigger> {
    const resolved = await this._findTrigger(trigger);
    if (!resolved) throw new NotFoundError(`Trigger ${trigger.type} not found`);
    return resolved;
  }

  // The response board is the one the app opens, so it has to be reachable
  // there. The trigger side carries no such rule: chains are authored before
  // their board or phrase is published, and `_assertCanRead` already keeps an
  // unpublished trigger's chains to its author.
  private async _requirePublishedResponseBoard(
    uuid: string,
  ): Promise<BoardOutput> {
    const board = await this._boardRepository.findByUuid(uuid);

    if (!board) throw new NotFoundError("Response board not found");
    if (!board.publishedAt)
      throw new BadRequestError("Response board must be published");

    return board;
  }

  // A trigger may recommend a given board only once. Pre-checking keeps this a
  // 409 instead of the raw unique-index violation the partial indexes would
  // otherwise surface as a 500.
  private async _assertNotDuplicate(
    trigger: TriggerRef,
    responseBoardId: number,
    exceptId?: number,
  ): Promise<void> {
    const existing =
      await this._interactionChainRepository.findByTriggerAndResponse(
        trigger,
        responseBoardId,
      );

    if (existing && existing.id !== exceptId) {
      throw new ConflictError(
        "This board is already a response for this trigger",
      );
    }
  }

  async create(
    data: InteractionChainInput,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput> {
    const trigger = await this._requireTrigger(data.trigger);
    const responseBoard = await this._requirePublishedResponseBoard(
      data.responseBoardUuid,
    );

    // Only a board trigger can name the response board; a phrase never can.
    if (
      data.trigger.type === "board" &&
      data.trigger.uuid === data.responseBoardUuid
    ) {
      throw new BadRequestError("Trigger and response board must be different");
    }

    this._assertCanManage(trigger.authorUuid, user);

    const triggerRef: TriggerRef = { type: data.trigger.type, id: trigger.id };

    await this._assertNotDuplicate(triggerRef, responseBoard.id);

    return await this._interactionChainRepository.create({
      trigger: triggerRef,
      responseBoardId: responseBoard.id,
      rank: data.rank,
      label: data.label ?? null,
    });
  }

  async update(
    uuid: string,
    data: InteractionChainUpdateInput,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput> {
    const interactionChain =
      await this._interactionChainRepository.findByUuid(uuid);
    if (!interactionChain)
      throw new NotFoundError("Interaction chain not found");

    this._assertCanManage(interactionChain.triggerAuthorUuid, user);

    const newTrigger = data.trigger
      ? await this._requireTrigger(data.trigger)
      : undefined;
    const responseBoard = data.responseBoardUuid
      ? await this._requirePublishedResponseBoard(data.responseBoardUuid)
      : undefined;

    // Moving a chain onto a new trigger requires rights over that trigger too.
    if (newTrigger) this._assertCanManage(newTrigger.authorUuid, user);

    const finalTrigger = data.trigger ?? interactionChain.trigger;
    const finalResponseUuid =
      data.responseBoardUuid ?? interactionChain.responseBoardUuid;

    if (
      finalTrigger.type === "board" &&
      finalTrigger.uuid === finalResponseUuid
    ) {
      throw new BadRequestError("Trigger and response board must be different");
    }

    // The duplicate check needs both ends resolved, including the ones this
    // request did not touch.
    const finalTriggerRef: TriggerRef = {
      type: finalTrigger.type,
      id: newTrigger
        ? newTrigger.id
        : (await this._requireTrigger(finalTrigger)).id,
    };
    const finalResponseBoardId = responseBoard
      ? responseBoard.id
      : (await this._requirePublishedResponseBoard(finalResponseUuid)).id;

    await this._assertNotDuplicate(
      finalTriggerRef,
      finalResponseBoardId,
      interactionChain.id,
    );

    return await this._interactionChainRepository.update(interactionChain.id, {
      trigger: newTrigger ? finalTriggerRef : undefined,
      responseBoardId: responseBoard?.id,
      rank: data.rank,
      label: data.label,
    });
  }

  async delete(uuid: string, user: AuthenticatedUser): Promise<void> {
    const interactionChain =
      await this._interactionChainRepository.findByUuid(uuid);

    if (!interactionChain)
      throw new NotFoundError("Interaction chain not found");

    this._assertCanManage(interactionChain.triggerAuthorUuid, user);

    await this._interactionChainRepository.delete(interactionChain.id);
  }

  async findAll(user: AuthenticatedUser): Promise<InteractionChainOutput[]> {
    return await this._interactionChainRepository.findAll(
      user.role === RoleEnum.ADMIN
        ? { triggerAuthorUuid: user.uuid }
        : undefined,
    );
  }

  async findByUuid(
    uuid: string,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput | null> {
    const interactionChain =
      await this._interactionChainRepository.findByUuid(uuid);

    if (interactionChain) {
      this._assertCanRead(
        interactionChain.triggerAuthorUuid,
        interactionChain.triggerPublishedAt,
        user,
      );
    }

    return interactionChain;
  }

  async findByTrigger(
    trigger: ChainTrigger,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput[]> {
    const resolved = await this._requireTrigger(trigger);

    this._assertCanRead(resolved.authorUuid, resolved.publishedAt, user);

    return await this._interactionChainRepository.findByTrigger(trigger);
  }
}

export default InteractionChainService;
