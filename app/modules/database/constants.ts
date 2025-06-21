import { Token } from "typedi";
import type { DataSource } from "typeorm";

export const DATABASE_TOKEN = new Token<DataSource>("DATABASE_TOKEN");
