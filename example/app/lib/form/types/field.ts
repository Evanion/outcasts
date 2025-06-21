import type { ComponentPropsWithRef } from "react";
import type { FieldComponents } from "../components/fields";

export type FieldType = keyof FieldComponents;

export type FieldProps<Type extends FieldType = "input"> =
  ComponentPropsWithRef<FieldComponents[Type]> & {
    label?: string;
    name: string;
    description?: string;
    message?: string;
  };
