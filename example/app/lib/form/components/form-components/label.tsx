import * as LabelPrimitive from "@radix-ui/react-label";
import { type ElementRef, forwardRef, useId } from "react";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { useFormField } from "../../hooks/form-field.hook";

const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const {
    error,
    formItemId,
    field: { label },
  } = useFormField();

  return (
    <>
      <Label
        ref={ref}
        className={cn(error && "text-destructive", className)}
        htmlFor={formItemId}
        {...props}
      >
        {label}
      </Label>
    </>
  );
});

FormLabel.displayName = "FormLabel";

export { FormLabel };
