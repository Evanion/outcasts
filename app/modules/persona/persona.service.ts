
import { plainToInstance } from "class-transformer";
import  { Persona } from "./entities/persona";
import { v5 as uuidv5 } from "uuid";

export class PersonaService {
  
  /**
   * Get a persona by identifier, if it doesn't exist, create it
   * @param identifier - The identifier of the persona
   * @returns The persona
   */
  async get(identifier: string): Promise<Persona> {
    const id = uuidv5(identifier, process.env.PERSONA_NS!);
    return plainToInstance(Persona, { id });
  }
}