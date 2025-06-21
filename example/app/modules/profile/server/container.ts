import Container from "typedi";
import { PROFILE_SERVICE } from "./constants";
import { ProfileService } from "./profile.service";

if (!Container.has(PROFILE_SERVICE))
  Container.set(PROFILE_SERVICE, ProfileService);
