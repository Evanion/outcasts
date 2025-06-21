import type { Persona } from "../entities/persona.entity";

export interface IPersonaService {
  get(identifier: string): Promise<Persona>;
}
