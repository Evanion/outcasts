import type { Repository } from "typeorm";
import type { IApartmentService } from "./interfaces/apartment.interface";
import { InjectRepository } from "~/modules/database";
import { Apartment } from "./entities/apartment.entity";
import { Service } from "typedi";
import { APARTMENT_SERVICE } from "./constants";
import { ApartmentFRN } from "./frn/apartment.frn";

@Service(APARTMENT_SERVICE)
export class ApartmentService implements IApartmentService {
  constructor(
    @InjectRepository(Apartment)
    private readonly apartmentRepo: Repository<Apartment>
  ) {}

  async get(frn: string): Promise<Apartment> {
    const { nss: id } = ApartmentFRN.parse(frn);
    return this.apartmentRepo.findOneOrFail({
      where: { id },
    });
  }
}
