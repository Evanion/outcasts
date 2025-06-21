import { Token } from "typedi";
import { IAuthService } from "./interfaces/auth-service.interface";

export const AUTH_SERVICE = new Token<IAuthService>("AUTH_SERVICE");
