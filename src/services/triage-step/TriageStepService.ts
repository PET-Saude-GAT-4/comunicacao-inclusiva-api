import { BadRequestError } from "@/errors/BadRequestError.js";
import { ConflictError } from "@/errors/ConflictError.js";
import { ForbiddenError } from "@/errors/ForbiddenError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import { RoleEnum } from "@/models/types/Role.type.js";
import type {
  TriageStepInput,
  TriageStepOutput,
  TriageStepUpdateInput,
} from "@/models/types/TriageStep.type.js";
import BoardRepository from "@/repositories/board/BoardRepository.js";
import type { IBoardRepository } from "@/repositories/board/IBoardRepository.js";
import type { ITriageStepRepository } from "@/repositories/triage-step/ITriageStepRepository.js";
import TriageStepRepository from "@/repositories/triage-step/TriageStepRepository.js";
import type { AuthenticatedUser } from "@/types/user.js";

import type { ITriageStepService } from "./ITriageStepService.js";

type Props = {
  boardRepository?: IBoardRepository;
  triageStepRepository?: ITriageStepRepository;
};

class TriageStepService implements ITriageStepService {
  private _boardRepository: IBoardRepository;
  private _triageStepRepository: ITriageStepRepository;

  constructor(props?: Props) {
    this._boardRepository = props?.boardRepository ?? new BoardRepository();
    this._triageStepRepository =
      props?.triageStepRepository ?? new TriageStepRepository();
  }

  // There is one sequence, shown to every app user, and no step belongs to an
  // author the way a board does, so only a super admin curates it.
  private _assertCanManage(user: AuthenticatedUser): void {
    if (user.role === RoleEnum.SUPER_ADMIN) return;
    throw new ForbiddenError("You are not allowed to manage triage steps.");
  }

  async create(
    data: TriageStepInput,
    user: AuthenticatedUser,
  ): Promise<TriageStepOutput> {
    this._assertCanManage(user);

    const board = await this._boardRepository.findByUuid(data.boardUuid);

    if (!board) throw new NotFoundError("Board not found");

    // The database enforces this too; checking first answers with a 400
    // instead of the raw constraint violation surfacing as a 500.
    if (board.type !== "emergency") {
      throw new BadRequestError("Only emergency boards can be triage steps");
    }

    // A step is a board the app opens, so it has to be reachable there, as an
    // interaction chain's response board has to be.
    if (!board.publishedAt) {
      throw new BadRequestError("Board must be published");
    }

    // Pre-checking keeps these 409s instead of the unique-constraint violations.
    if (await this._triageStepRepository.existsByBoardId(board.id)) {
      throw new ConflictError("This board is already a triage step");
    }

    // Each level holds one board; moving another board out is done through
    // update, which swaps them.
    if (await this._triageStepRepository.existsByLevel(data.level)) {
      throw new ConflictError(`Triage level ${data.level} already has a board`);
    }

    return await this._triageStepRepository.create({
      boardId: board.id,
      level: data.level,
    });
  }

  async update(
    uuid: string,
    data: TriageStepUpdateInput,
    user: AuthenticatedUser,
  ): Promise<TriageStepOutput> {
    this._assertCanManage(user);

    const triageStep = await this._triageStepRepository.findByUuid(uuid);

    if (!triageStep) throw new NotFoundError("Triage step not found");

    // Moving to a level another board holds swaps the two.
    const moved = await this._triageStepRepository.moveToLevel(
      triageStep.id,
      data.level,
    );

    // Deleted between the lookup above and the move.
    if (!moved) throw new NotFoundError("Triage step not found");

    return moved;
  }

  async delete(uuid: string, user: AuthenticatedUser): Promise<void> {
    this._assertCanManage(user);

    const triageStep = await this._triageStepRepository.findByUuid(uuid);

    if (!triageStep) throw new NotFoundError("Triage step not found");

    await this._triageStepRepository.delete(triageStep.id);
  }

  async findAll(): Promise<TriageStepOutput[]> {
    return await this._triageStepRepository.findAll();
  }

  async findByUuid(uuid: string): Promise<TriageStepOutput | null> {
    return await this._triageStepRepository.findByUuid(uuid);
  }

  // A step outlives its board being unpublished, so the app's view skips those
  // rather than the step being removed; that level then reads as empty.
  async findAllPublished(): Promise<TriageStepOutput[]> {
    return await this._triageStepRepository.findAll({ publishedOnly: true });
  }
}

export default TriageStepService;
