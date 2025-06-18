import en from "./en";

export const locales = { en };
export type Locale = keyof typeof locales;
export type Namespace = keyof typeof locales.en;
