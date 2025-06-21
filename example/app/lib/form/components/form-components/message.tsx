import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "~/lib/utils";
import { useFormField } from "../../hooks/form-field.hook";

const FormMessage = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const errors = Object.values(error?.constraints || {});
  const body = errors.length ? String(errors[0]) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});

FormMessage.displayName = "FormMessage";

export { FormMessage };
