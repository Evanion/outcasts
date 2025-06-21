import type { IApartmentService } from "./interfaces/apartment.interface";
import { Token } from "typedi";
import type { IBuildingService } from "./interfaces/building.interface";
import type { IAreaService } from "./interfaces/area.interface";

export const APARTMENT_SERVICE = new Token<IApartmentService>(
  "APARTMENT_SERVICE"
);

export const BUILDING_SERVICE = new Token<IBuildingService>("BUILDING_SERVICE");

export const AREA_SERVICE = new Token<IAreaService>("AREA_SERVICE");
