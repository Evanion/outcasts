import { Token } from "typedi";
import { Persona } from "../entities/persona.entity";

export interface IPersonaService {
  getOrCreatePersonaByIdentifier(identifier: string): Promise<Persona>;
}

export const PERSONA_SERVICE = new Token<IPersonaService>("PERSONA_SERVICE"); 