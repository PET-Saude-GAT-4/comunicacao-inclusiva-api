import { ForbiddenError } from "@/errors/ForbiddenError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
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

  async create(
    data: InteractionChainInput,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput> {
    const triggerBoard = await this._boardRepository.findByUuid(
      data.triggerBoardUuid,
    );
    const responseBoard = await this._boardRepository.findByUuid(
      data.responseBoardUuid,
    );

    if (!triggerBoard) throw new NotFoundError("Trigger board not found");
    if (!responseBoard) throw new NotFoundError("Response board not found");

    if (triggerBoard.id === responseBoard.id) {
      throw new Error("Trigger and response board must be different");
    }

    if (!triggerBoard.publishedAt) throw new Error("Board is not published");
    if (!responseBoard.publishedAt) throw new Error("Board is not published");

    const interactionChain =
      await this._interactionChainRepository.create(data);

    this._assertCanManage(interactionChain, user);

    return interactionChain;
  }

  async update(
    id: number,
    data: InteractionChainUpdateInput,
    user: AuthenticatedUser,
  ): Promise<InteractionChainOutput> {
    const interactionChain =
      await this._interactionChainRepository.findById(id);
    if (!interactionChain)
      throw new NotFoundError("Interaction chain not found");

    this._assertCanManage(interactionChain, user);

    const finalTriggerUuid =
      data.triggerBoardUuid ?? interactionChain.triggerBoardUuid;
    const finalResponseUuid =
      data.responseBoardUuid ?? interactionChain.responseBoardUuid;

    const triggerBoard =
      await this._boardRepository.findByUuid(finalTriggerUuid);
    const responseBoard =
      await this._boardRepository.findByUuid(finalResponseUuid);

    if (!triggerBoard) throw new NotFoundError("Trigger board not found");
    if (!responseBoard) throw new NotFoundError("Response board not found");

    if (!triggerBoard.publishedAt)
      throw new Error("Trigger board must be published");
    if (!responseBoard.publishedAt)
      throw new Error("Response board must be published");

    return await this._interactionChainRepository.update(id, data);
  }

  async delete(id: number, user: AuthenticatedUser): Promise<void> {
    const interactionChain =
      await this._interactionChainRepository.findById(id);

    if (!interactionChain)
      throw new NotFoundError("Interaction chain not found");

    this._assertCanManage(interactionChain, user);

    await this._interactionChainRepository.delete(id);
  }

  async findAll(): Promise<InteractionChainOutput[]> {
    return await this._interactionChainRepository.findAll();
  }

  async findById(id: number): Promise<InteractionChainOutput | null> {
    return await this._interactionChainRepository.findById(id);
  }
}

export default InteractionChainService;
