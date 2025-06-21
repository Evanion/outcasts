import { Token } from "typedi";
import type { IFeatureService } from "./interfaces/feature.interface";

export const FEATURE_SERVICE = new Token<IFeatureService>("FEATURE_SERVICE");
