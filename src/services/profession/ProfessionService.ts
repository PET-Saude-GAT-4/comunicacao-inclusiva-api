import type { IProfessionRepository } from "@/repositories/profession/IProfessionRepository.js";
import ProfessionRepository from "@/repositories/profession/ProfessionRepository.js";

import type { IProfessionService } from "./IProfessionService.js";

type Props = {
  professionRepository?: IProfessionRepository;
};

class ProfessionService implements IProfessionService {
  private _professionRepository: IProfessionRepository;

  constructor(props?: Props) {
    this._professionRepository =
      props?.professionRepository ?? new ProfessionRepository();
  }
}

export default ProfessionService;
