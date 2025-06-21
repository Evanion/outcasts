import type { CreateAreaDto } from "../dtos/create-area.dto";
import type { Area } from "../entities/area.entity";

export interface IAreaService {
  get(frn: string): Promise<Area>;

  getBySlug(slug: string): Promise<Area>;

  create(dto: CreateAreaDto): Promise<Area>;
}
