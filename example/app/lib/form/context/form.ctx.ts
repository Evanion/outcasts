import { createContext } from "react";
import type { FieldProps } from "../types/field";
import type { ValidationError } from "class-validator";

export type FormContextValue = {
  fields: FieldProps[];
  errors?: ValidationError[];
};

export const FormContext = createContext<FormContextValue>(
  {} as FormContextValue
);
