import path from "path";
import { DataSource } from "typeorm";
import { Persona } from "../personas/server/entities/persona.entity";
import { Area } from "../realestate/server/entities/area.entity";
import { Building } from "../realestate/server/entities/building.entity";
import { Apartment } from "../realestate/server/entities/apartment.entity";

const __dirname = path.resolve();

export const appDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Persona, Area, Building, Apartment],
  synchronize: true,
});
