import { Service } from "typedi";
import type { CreateProfileDto } from "./dtos/create-profile.dto";
import type { Profile } from "./entities/profile";
import type { IProfileService } from "./interfaces/profile.interface";
import { PROFILE_SERVICE } from "./constants";

@Service(PROFILE_SERVICE)
export class ProfileService implements IProfileService {
  get(frn: string): Promise<Profile> {
    throw new Error("Method not implemented.");
  }

  update(profile: Profile): Promise<Profile> {
    throw new Error("Method not implemented.");
  }

  upsert(dto: CreateProfileDto): Promise<Profile> {
    throw new Error("Method not implemented.");
  }
}
