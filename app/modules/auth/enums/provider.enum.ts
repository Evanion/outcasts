import { isEnum } from "class-validator";

export enum Provider {
  BNet = "bnet",
}

export function isProvider(value: string): value is Provider {
  return isEnum(value, Provider);
}
