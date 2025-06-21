import { DataSource } from "typeorm";
import { Persona } from "~/modules/persona/entities/persona.entity";

export const appDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: process.env.NODE_ENV === "development",
  entities: [Persona],
  synchronize: false,
});
