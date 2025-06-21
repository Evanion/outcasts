import type { Repository } from "typeorm";
import type { IBuildingService } from "./interfaces/building.interface";
import { InjectRepository } from "~/modules/database";
import { Building } from "./entities/building.entity";
import { Inject, Service } from "typedi";
import { BUILDING_SERVICE, AREA_SERVICE } from "./constants";
import type { Apartment } from "./entities/apartment.entity";
import type { CreateBuildingDto } from "./dtos/create-building.dto";
import type { IAreaService } from "./interfaces/area.interface";
import { isFrn } from "~/lib/validation";
import { BuildingFRN } from "./frn/building.frn";
import { InvalidFrnException } from "~/lib/exceptions/invalid-frn.exception";

@Service(BUILDING_SERVICE)
export class BuildingService implements IBuildingService {
  constructor(
    @InjectRepository(Building)
    private readonly apartmentRepo: Repository<Building>,
    @Inject(AREA_SERVICE) private readonly areaService: IAreaService
  ) {}

  async get(frn: string): Promise<Building> {
    if (!isFrn(frn, "building")) throw new InvalidFrnException("building");

    const { nss: id } = BuildingFRN.parse(frn);
    return this.apartmentRepo.findOneByOrFail({
      id,
    });
  }

  async getApartments(frn: string): Promise<Apartment[]> {
    if (!isFrn(frn, "building")) throw new InvalidFrnException("building");
    const { nss: id } = BuildingFRN.parse(frn);
    const building = await this.apartmentRepo.findOneOrFail({
      where: { id },
      select: ["apartments"],
    });

    return building.apartments;
  }

  async create({
    areaFrn,
    ...buildingDto
  }: CreateBuildingDto): Promise<Building> {
    const area = await this.areaService.get(areaFrn);
    return this.apartmentRepo.save({ ...buildingDto, area });
  }
}
