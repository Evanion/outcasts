import type { CreateProfileDto } from "../dtos/create-profile.dto";
import type { Profile } from "../entities/profile";

export interface IProfileService {
  get(frn: string): Promise<Profile>;
  update(profile: Profile): Promise<Profile>;
  upsert(dto: CreateProfileDto): Promise<Profile>;
}
