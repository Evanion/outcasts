import { Service } from "typedi";
import { features, type FeatureKey } from "./data/features";
import { FEATURE_SERVICE } from "./constants";

@Service(FEATURE_SERVICE)
export class FeatureService {
  isEnabled(feature: FeatureKey): boolean {
    return features[feature].status;
  }
}
