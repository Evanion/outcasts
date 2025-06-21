import {
  data,
  redirect,
  type ActionFunction,
  type ActionFunctionArgs,
} from "react-router";
import type { FormSchema } from "../types/form";
import {
  validateOrReject,
  ValidationError,
  type ValidatorOptions,
} from "class-validator";
import { plainToInstance } from "class-transformer";
import { isFunction } from "../../utils/guards/function";
import { HttpStatus } from "~/lib/http-status.enum";

type SchemaObject<Schema> = IterableIterator<
  [keyof Schema, Schema[keyof Schema]]
>;

type Mutation<Schema extends InstanceType<FormSchema>, Result> =
  | ((data: Schema) => Promise<Result> | Result)
  | ((data: Schema, context: ActionFunctionArgs) => Promise<Result> | Result);

type FormActionProps<Schema extends FormSchema, Result> = {
  schema: Schema;
  validatorOptions?: ValidatorOptions;
  mutation: Mutation<InstanceType<Schema>, Result>;
  successPath?:
    | string
    | ((result: Result) => string)
    | ((result: Result, context: ActionFunctionArgs) => string);
};

export function formAction<Schema extends FormSchema, Result>({
  schema,
  validatorOptions,
  mutation,
  successPath,
}: FormActionProps<Schema, Result>): ActionFunction {
  return async function action({ request, ...actionArgs }: ActionFunctionArgs) {
    const context = { request, ...actionArgs };
    validatorOptions = validatorOptions || {
      whitelist: true,
      forbidNonWhitelisted: true,
    };

    const FormData = await request.formData();

    const entries = FormData.entries();
    const values = Object.fromEntries(
      entries
    ) as unknown as SchemaObject<Schema>;
    const formValues = plainToInstance(schema, values) as InstanceType<Schema>;

    try {
      await validateOrReject(formValues, validatorOptions);

      const result = await mutation(formValues, context);

      if (!successPath) return { success: true, result };
      if (isFunction(successPath))
        return redirect(successPath(result, context));
      return redirect(successPath);
    } catch (error) {
      if (Array.isArray(error) && error[0] instanceof ValidationError)
        return data(
          { success: false, errors: error, values },
          { status: HttpStatus.BAD_REQUEST }
        );

      throw error;
    }
  };
}
