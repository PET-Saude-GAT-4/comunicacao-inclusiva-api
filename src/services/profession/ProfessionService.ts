import type { IProfessionRepository } from "@/repositories/profession/IProfessionRepository.js";
import ProfessionRepository from "@/repositories/profession/ProfessionRepository.js";

import type { IProfessionService } from "./IProfessionService.js";
import { Profession } from "@/models/Profession.js";
import { normalize } from "@/utils/normalize.js";

type Props = {
  professionRepository?: IProfessionRepository;
};

class ProfessionService implements IProfessionService {
  private _professionRepository: IProfessionRepository;

  constructor(props?: Props) {
    this._professionRepository =
      props?.professionRepository ?? new ProfessionRepository();
  }

  async create(profession: Partial<Profession>): Promise<Profession> {

    if (!profession.name || !profession.code) {
      throw new Error("Nome e código da profissão são obrigatórios!");
    }

    const name: string = normalize(profession.name)

    profession.name = name
    
    if(await this._professionRepository.findByName(profession.name)){
      throw new Error("Esse nome ja existe");
    }

    if(await this._professionRepository.findByCode(profession.code)){
      throw new Error("Esse código ja existe");
    }

    return await this._professionRepository.create(profession);
  }

  async findAll(): Promise<Profession[]> {
    const professions: Profession[] = await this._professionRepository.findAll();
    if(!professions){
      throw new Error("Nenhuma Profissão encontrada!")
    }
    return professions;
  }

  async delete(id: number): Promise<void> {
    await this._professionRepository.delete(id);
  }
}


export default ProfessionService;
