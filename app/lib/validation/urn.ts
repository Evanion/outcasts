import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from "class-validator";
import { URN } from "@evanion/urn";

export function isUrn(value: any, nid?: string): boolean {
  if (typeof value !== "string") {
    return false;
  }
  const parsed = URN.parse(value);
  return parsed && (!nid || parsed.nid === nid);
}

export function IsUrn(
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
      name: "isUrn",
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isUrn(value, nid);
        },
      },
    });
  };
}
