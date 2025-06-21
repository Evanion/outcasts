import type { FieldProps } from "../../types/field";
import { FormFieldContext } from "../../context/field.ctx";
import type { PropsWithChildren } from "react";

export function FormField({
  children,
  ...props
}: PropsWithChildren<FieldProps>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      {children}
    </FormFieldContext.Provider>
  );
}
