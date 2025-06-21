import { Token } from "typedi";
import type { IPersonaService } from "./interfaces/persona.interface";

export const PERSONA_SERVICE = new Token<IPersonaService>("PERSONA_SERVICE");
