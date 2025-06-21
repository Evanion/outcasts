import type { ClassConstructor } from "class-transformer";

export type FormSchema<Schema = object> = ClassConstructor<Schema>;
