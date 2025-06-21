import type { Apartment } from "../entities/apartment.entity";

export interface IApartmentService {
  get(frn: string): Promise<Apartment>;
}
