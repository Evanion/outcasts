import type { Checkbox } from "~/components/ui/checkbox";
import type { Input } from "~/components/ui/input";
import type { Textarea } from "~/components/ui/textarea";

export type FieldComponents = {
  input: typeof Input;
  textarea: typeof Textarea;
  checkbox: typeof Checkbox;
};
