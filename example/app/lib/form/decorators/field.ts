import "reflect-metadata";
import type { FieldProps, FieldType } from "../types/field";
import type { FormSchema } from "../types/form";

const FIELDS_KEY = "fields";
const FIELD_KEY = "field";

const defaultProps = {
  propertyType: "text",
  fieldType: "input",
};

export function Field<Type extends FieldType = "input">(
  fieldTypeOrOptions: Type | (Partial<FieldProps<Type>> & { fieldType?: Type }),
  props?: Partial<FieldProps<Type>>
): PropertyDecorator {
  const options =
    typeof fieldTypeOrOptions === "string"
      ? { fieldType: fieldTypeOrOptions, ...props }
      : fieldTypeOrOptions;

  return (target: object, propertyKey: string | symbol) => {
    const fields = Reflect.getMetadata(FIELDS_KEY, target) || [];
    Reflect.defineMetadata(FIELDS_KEY, [...fields, propertyKey], target);

    const propertyType = Reflect.getMetadata(
      "design:type",
      target,
      propertyKey
    );

    if (!propertyType) {
      console.warn(`Cannot determine type of property ${String(propertyKey)}`);
    }

    const props = {
      ...defaultProps,
      ...options,
      name: String(propertyKey),
      propertyType: propertyType?.name.toLowerCase(),
    };

    Reflect.defineMetadata(FIELD_KEY, props, target, propertyKey);
  };
}

export function getFields<Schema extends FormSchema>(
  schema: Schema
): FieldProps[] {
  const fields = Reflect.getMetadata(FIELDS_KEY, schema.prototype);

  if (!fields) return [];
  return fields.map((propertyKey: string) => ({
    name: propertyKey,
    ...Reflect.getMetadata(FIELD_KEY, schema.prototype, propertyKey),
  }));
}
