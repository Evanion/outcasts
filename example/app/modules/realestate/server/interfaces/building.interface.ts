import type { CreateBuildingDto } from "../dtos/create-building.dto";
import type { Apartment } from "../entities/apartment.entity";
import type { Building } from "../entities/building.entity";

export interface IBuildingService {
  create(building: CreateBuildingDto): Promise<Building>;
  get(frn: string): Promise<Building>;
  getApartments(buildingFrn: string): Promise<Apartment[]>;
}
