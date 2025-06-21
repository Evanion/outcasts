import { useContext } from "react";
import { FormFieldContext } from "../context/field.ctx";
import { FormItemContext } from "../context/item.ctx";
import { FormContext } from "../context/form.ctx";

export function useFormField() {
  const fieldCtx = useContext(FormFieldContext);
  const itemCtx = useContext(FormItemContext);
  const formCtx = useContext(FormContext);

  if (!fieldCtx) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemCtx;

  return {
    id,
    name: fieldCtx.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    field: formCtx.fields.find((field) => field.name === fieldCtx.name)!,
    error: formCtx.errors?.find((error) => error.property === fieldCtx.name),
  };
}
