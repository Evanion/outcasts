import { Service } from "typedi";
import { v5 as uuidv5 } from "uuid";
import { Repository, DataSource } from "typeorm";
import { Persona } from "./entities/persona.entity";
import { IPersonaService, PERSONA_SERVICE } from "./interfaces/persona-service.interface";

@Service(PERSONA_SERVICE)
export class PersonaService implements IPersonaService {
  private repo: Repository<Persona>;

  constructor(private dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(Persona);
  }

  async getOrCreatePersonaByIdentifier(identifier: string): Promise<Persona> {
    const id = uuidv5(identifier, process.env.PERSONA_NS!);
    let persona = await this.repo.findOneBy({ id });
    if (!persona) {
      persona = this.repo.create({ id });
      await this.repo.save(persona);
    }
    return persona;
  }
}