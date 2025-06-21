import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from "class-validator";
import { FRN } from "../frn";

export function isFrn(value: any, nid?: string): boolean {
  if (typeof value !== "string") {
    return false;
  }
  const parsed = FRN.parse(value);
  return parsed && (!nid || parsed.nid === nid);
}

export function IsFrn(
  nidOrValidationOptions: string | ValidationOptions = {},
  validationOptions?: ValidationOptions
): PropertyDecorator {
  const nid =
    typeof nidOrValidationOptions === "string"
      ? nidOrValidationOptions
      : undefined;
  validationOptions = nid
    ? validationOptions
    : (nidOrValidationOptions as ValidationOptions);
  return function (object: Object, propertyName: string | symbol) {
    registerDecorator({
      name: "isFrn",
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isFrn(value, nid);
        },
      },
    });
  };
}
