import { createContext } from "react";

export type FormFieldContextValue = {
  name: string;
};

export const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);
