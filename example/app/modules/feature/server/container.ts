import Container from "typedi";
import { FEATURE_SERVICE } from "./constants";
import { FeatureService } from "./feature.service";

if (!Container.has(FEATURE_SERVICE))
  Container.set(FEATURE_SERVICE, FeatureService);
