import { Token } from "typedi";
import type { IProfileService } from "./interfaces/profile.interface";

export const PROFILE_SERVICE = new Token<IProfileService>("PROFILE_SERVICE");
