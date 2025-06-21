import { Container } from "typedi";
import { APARTMENT_SERVICE, BUILDING_SERVICE, AREA_SERVICE } from "./constants";
import { ApartmentService } from "./apartment.service";
import { BuildingService } from "./building.service";
import { AreaService } from "./area.service";

if (!Container.has(APARTMENT_SERVICE))
  Container.set(APARTMENT_SERVICE, ApartmentService);

if (!Container.has(BUILDING_SERVICE))
  Container.set(BUILDING_SERVICE, BuildingService);

if (!Container.has(AREA_SERVICE)) Container.set(AREA_SERVICE, AreaService);
