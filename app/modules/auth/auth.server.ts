// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { battleNetStrategy } from "./strategies/bnet";
import type { User } from "./entities/user";
import { Provider } from "./enums/provider.enum";

export const authenticator = new Authenticator<User>();

authenticator.use(battleNetStrategy, Provider.BNet);
