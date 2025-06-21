import { Container } from "typedi";
import { AUTH_SERVICE } from "./constants";
import { AuthService } from "./auth.service";

if (!Container.has(AUTH_SERVICE)) Container.set(AUTH_SERVICE, AuthService);
