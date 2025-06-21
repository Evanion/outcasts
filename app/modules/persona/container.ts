import { Container } from "typedi";
import { PERSONA_SERVICE } from "./constants";
import { PersonaService } from "./persona.service";

if (!Container.has(PERSONA_SERVICE))
  Container.set(PERSONA_SERVICE, PersonaService);
