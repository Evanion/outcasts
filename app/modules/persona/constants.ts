import { Token } from "typedi";
import { IPersonaService } from "./interfaces/persona.interface";

export const PERSONA_SERVICE = new Token<IPersonaService>("PERSONA_SERVICE");
