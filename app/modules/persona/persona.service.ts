import { Service } from "typedi";
import type { Repository } from "typeorm";
import { InjectRepository } from "~/modules/database";
import { Persona } from "./entities/persona.entity";
import { v5 as uuidv5 } from "uuid";
import type { IPersonaService } from "./interfaces/persona.interface";
import { PERSONA_SERVICE } from "./constants";

@Service(PERSONA_SERVICE)
export class PersonaService implements IPersonaService {
  constructor(
    @InjectRepository(Persona) private personaRepo: Repository<Persona>,
    private readonly namespace: string = process.env.PERSONA_NS!
  ) {}

  /**
   * Find or create a persona by identifier.
   * @param identifier - The identifier of the persona
   * @returns Persona
   */
  async get(identifier: string) {
    const uuid = this.getUUIDFromIdentifier(identifier);
    return this.findOrCreate(uuid);
  }

  private async findOrCreate(uuid: string): Promise<Persona> {
    let existing = await this.personaRepo.findOneBy({ id: uuid });

    if (!existing) {
      existing = await this.personaRepo.save({ id: uuid });
    }

    return existing;
  }

  private getUUIDFromIdentifier(identifier: string) {
    return uuidv5(identifier, this.namespace);
  }
}
