import { BadRequestError } from "@/errors/BadRequestError.js";
import { ForbiddenError } from "@/errors/ForbiddenError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { BoardOutput } from "@/models/types/Board.type.js";
import type {
  InteractionChainInput,
  InteractionChainOutput,
  InteractionChainUpdateInput,
} from "@/models/types/InteractionChain.type.js";
import { RoleEnum } from "@/models/types/Role.type.js";
import BoardRepository from "@/repositories/board/BoardRepository.js";
import type { IBoardRepository } from "@/repositories/board/IBoardRepository.js";
import type { IInteractionChainRepository } from "@/repositories/interaction-chain/IInteractionChainRepository.js";
import InteractionChainRepository from "@/repositories/interaction-chain/InteractionChainRepository.js";
import type { AuthenticatedUser } from "@/types/user.js";

import type { IInteractionChainService } from "./IInteractionChainService.js";

type Props = {
  boardRepository?: IBoardRepository;
  interactionChainRepository?: IInteractionChainRepository;
};

class InteractionChainService implements IInteractionChainService {
  private _boardRepository: IBoardRepository;
  private _interactionChainRepository: IInteractionChainRepository;

  constructor(props?: Props) {
    this._boardRepository = props?.boardRepository ?? new BoardRepository();
    this._interactionChainRepository =
      props?.interactionChainRepository ?? new InteractionChainRepository();
  }

  private _assertCanManage(
    triggerBoardAuthorUuid: string | null,
    user: AuthenticatedUser,
  ): void {
    if (user.role === RoleEnum.SUPER_ADMIN) return;
    if (user.role === RoleEnum.ADMIN && triggerBoardAuthorUuid === user.uuid)
      return;
    throw new ForbiddenError(
      "You are not allowed to manage this interaction chain.",
    );
  }

  private _assertCanRead(
    triggerBoardAuthorUuid: string | null,
    triggerBoardPublishedAt: Date | null,
    user: AuthenticatedUser,
  ): void {
    if (user.role === RoleEnum.SUPER_ADMIN) return;
    if (triggerBoardPublishedAt !== null) return;
    if (user.role === RoleEnum.ADMIN && triggerBoardAuthorUuid === user.uuid)
      return;
    throw new ForbiddenError(
      "You are not allowed to access this interaction chain.",
    );
  }

  private async _requirePublishedBoard(
    uuid: string,
    role: "Trigger" | "Response",
  ): Promise<BoardOutput> {
    const board = await this._boardRepository.findByUuid(uuid);

    if (!board) throw new NotFoundError(`${role} board not found`);
    if (!board.publishedAt)
      throw new BadRequestError(`${role} board must be published`);

    return board;
  }

  async create(
    data: InteractionChainInput,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput> {
    const triggerBoard = await this._requirePublishedBoard(
      data.triggerBoardUuid,
      "Trigger",
    );
    const responseBoard = await this._requirePublishedBoard(
      data.responseBoardUuid,
      "Response",
    );

    if (triggerBoard.id === responseBoard.id) {
      throw new BadRequestError("Trigger and response board must be different");
    }

    this._assertCanManage(triggerBoard.authorUuid, user);

    return await this._interactionChainRepository.create({
      triggerBoardId: triggerBoard.id,
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

    this._assertCanManage(interactionChain.triggerBoardAuthorUuid, user);

    const triggerBoard = data.triggerBoardUuid
      ? await this._requirePublishedBoard(data.triggerBoardUuid, "Trigger")
      : undefined;
    const responseBoard = data.responseBoardUuid
      ? await this._requirePublishedBoard(data.responseBoardUuid, "Response")
      : undefined;

    if (triggerBoard) this._assertCanManage(triggerBoard.authorUuid, user);

    const finalTriggerUuid =
      data.triggerBoardUuid ?? interactionChain.triggerBoardUuid;
    const finalResponseUuid =
      data.responseBoardUuid ?? interactionChain.responseBoardUuid;

    if (finalTriggerUuid === finalResponseUuid) {
      throw new BadRequestError("Trigger and response board must be different");
    }

    return await this._interactionChainRepository.update(interactionChain.id, {
      triggerBoardId: triggerBoard?.id,
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

    this._assertCanManage(interactionChain.triggerBoardAuthorUuid, user);

    await this._interactionChainRepository.delete(interactionChain.id);
  }

  async findAll(user: AuthenticatedUser): Promise<InteractionChainOutput[]> {
    return await this._interactionChainRepository.findAll(
      user.role === "admin" ? { triggerBoardAuthorUuid: user.uuid } : undefined,
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
        interactionChain.triggerBoardAuthorUuid,
        interactionChain.triggerBoardPublishedAt,
        user,
      );
    }

    return interactionChain;
  }

  async findByTriggerBoardUuid(
    uuid: string,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput[]> {
    const triggerBoard = await this._boardRepository.findByUuid(uuid);

    if (!triggerBoard) throw new NotFoundError("Trigger board not found");

    this._assertCanRead(
      triggerBoard.authorUuid,
      triggerBoard.publishedAt,
      user,
    );

    return await this._interactionChainRepository.findByTriggerBoardUuid(uuid);
  }
}

export default InteractionChainService;
