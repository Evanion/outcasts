import { useRef } from "react";
import { useFetcher } from "react-router";
import { getFields } from "../decorators/field";
import type { FormSchema } from "../types/form";
import { FormContext } from "../context/form.ctx";
import { FormField } from "./form-components/field";
import { Button } from "~/components/ui/button";
import { FormItem } from "./form-components/item";
import { FormLabel } from "./form-components/label";
import { FormControl } from "./form-components/control";
import { Input } from "~/components/ui/input";
import { FormDescription } from "./form-components/description";
import { FormMessage } from "./form-components/message";

export type FormProps<Schema> = {
  schema: Schema;
};

export function Form<Schema extends FormSchema>({ schema }: FormProps<Schema>) {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const fields = getFields(schema);
  const errors = fetcher.data?.errors;
  return (
    <FormContext.Provider value={{ fields, errors }}>
      <fetcher.Form ref={formRef} method="post" className="space-y-4">
        {fields.map((field) => (
          <FormField key={field.name} name={field.name}>
            <FormItem>
              <FormLabel />
              <FormControl>
                <Input type={field.type} name={field.name} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          </FormField>
        ))}
        <Button type="submit">Submit</Button>
      </fetcher.Form>
    </FormContext.Provider>
  );
}
