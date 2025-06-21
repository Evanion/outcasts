import { type Repository, EntityNotFoundError } from "typeorm";
import type { IAreaService } from "./interfaces/area.interface";
import { InjectRepository } from "~/modules/database";
import { Area } from "./entities/area.entity";
import { Service } from "typedi";
import { AREA_SERVICE } from "./constants";
import { isFrn } from "~/lib/validation";
import { InvalidFrnException } from "~/lib/exceptions/invalid-frn.exception";
import { AreaFRN } from "./frn/area.frn";
import type { CreateAreaDto } from "./dtos/create-area.dto";
import { validateOrReject } from "class-validator";
import { NotFoundException } from "~/lib/exceptions/not-found.exception";

@Service(AREA_SERVICE)
export class AreaService implements IAreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepo: Repository<Area>
  ) {}

  async get(frn: string): Promise<Area> {
    if (!isFrn(frn, "area")) throw new InvalidFrnException("area");

    const { nss: id } = AreaFRN.parse(frn);
    return this.areaRepo.findOneOrFail({
      where: { id },
    });
  }

  async getBySlug(slug: string): Promise<Area> {
    try {
      return this.areaRepo.findOneOrFail({
        where: { slug },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError)
        throw new NotFoundException("Area not found");
      throw error;
    }
  }

  async create(dto: CreateAreaDto): Promise<Area> {
    await validateOrReject(dto);
    const area = this.areaRepo.create(dto);
    return this.areaRepo.save(area);
  }
}
