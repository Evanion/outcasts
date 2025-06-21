import type { FeatureKey } from "../data/features";

export interface IFeatureService {
  isEnabled(feature: FeatureKey): boolean;
}
