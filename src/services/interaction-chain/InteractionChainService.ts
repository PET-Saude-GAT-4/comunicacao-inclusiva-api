import { ForbiddenError } from "@/errors/ForbiddenError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { BoardOutput } from "@/models/types/Board.type.js";
import type {
  InteractionChainInput,
  InteractionChainOutput,
  InteractionChainUpdateInput,
} from "@/models/types/InteractionChain.type.js";
import BoardRepository from "@/repositories/board/BoardRepository.js";
import type { IBoardRepository } from "@/repositories/board/IBoardRepository.js";
import type { IInteractionChainRepository } from "@/repositories/interaction-chain/IInteractionChainRepository.js";
import InteractionChainRepository from "@/repositories/interaction-chain/InteractionChainRepository.js";
import type { IPictogramRepository } from "@/repositories/pictogram/IPictogramRepository.js";
import PictogramRepository from "@/repositories/pictogram/PictogramRepository.js";
import type { AuthenticatedUser } from "@/types/user.js";

import type { IInteractionChainService } from "./IInteractionChainService.js";

type Props = {
  boardRepository?: IBoardRepository;
  pictogramRepository?: IPictogramRepository;
  interactionChainRepository?: IInteractionChainRepository;
};

export class InteractionChainService implements IInteractionChainService {
  private _boardRepository: IBoardRepository;
  private _pictogramRepository: IPictogramRepository;
  private _interactionChainRepository: IInteractionChainRepository;

  constructor(props?: Props) {
    this._boardRepository = props?.boardRepository ?? new BoardRepository();
    this._pictogramRepository =
      props?.pictogramRepository ?? new PictogramRepository();
    this._interactionChainRepository =
      props?.interactionChainRepository ?? new InteractionChainRepository();
  }

  private _assertCanManage(
    interaction: InteractionChainOutput,
    user: AuthenticatedUser,
  ): void {
    if (user.role === "super_admin") return;
    if (user.role === "admin") return;
    throw new ForbiddenError("You are not allowed to manage this interaction.");
  }

  private _assertCanRead(
    interaction: InteractionChainOutput,
    user: AuthenticatedUser,
  ): void {
    if (user.role === "super_admin") return;
    if (user.role === "admin") return;
    throw new ForbiddenError("You are not allowed to access this interaction.");
  }

  private async _requirePublishedBoard(
    uuid: string,
    role: "Trigger" | "Response",
  ): Promise<BoardOutput> {
    const board = await this._boardRepository.findByUuid(uuid);

    if (!board) throw new NotFoundError(`${role} board not found`);
    if (!board.publishedAt) throw new Error(`${role} board must be published`);

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
      throw new Error("Trigger and response board must be different");
    }

    const interactionChain = await this._interactionChainRepository.create({
      triggerBoardId: triggerBoard.id,
      responseBoardId: responseBoard.id,
      label: data.label ?? null,
    });

    this._assertCanManage(interactionChain, user);

    return interactionChain;
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

    this._assertCanManage(interactionChain, user);

    const triggerBoard = data.triggerBoardUuid
      ? await this._requirePublishedBoard(data.triggerBoardUuid, "Trigger")
      : undefined;
    const responseBoard = data.responseBoardUuid
      ? await this._requirePublishedBoard(data.responseBoardUuid, "Response")
      : undefined;

    return await this._interactionChainRepository.update(interactionChain.id, {
      triggerBoardId: triggerBoard?.id,
      responseBoardId: responseBoard?.id,
      label: data.label,
    });
  }

  async delete(uuid: string, user: AuthenticatedUser): Promise<void> {
    const interactionChain =
      await this._interactionChainRepository.findByUuid(uuid);

    if (!interactionChain)
      throw new NotFoundError("Interaction chain not found");

    this._assertCanManage(interactionChain, user);

    await this._interactionChainRepository.delete(interactionChain.id);
  }

  async findAll(): Promise<InteractionChainOutput[]> {
    return await this._interactionChainRepository.findAll();
  }

  async findByUuid(uuid: string): Promise<InteractionChainOutput | null> {
    return await this._interactionChainRepository.findByUuid(uuid);
  }

  async findByTriggerBoardUuid(
    uuid: string,
  ): Promise<InteractionChainOutput[]> {
    return await this._interactionChainRepository.findByTriggerBoardUuid(uuid);
  }
}

export default InteractionChainService;
