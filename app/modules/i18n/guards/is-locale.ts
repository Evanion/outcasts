import { locales, type Locale } from "~/locales";

export function isLocale(locale: string): locale is Locale {
  return Object.keys(locales).includes(locale);
}
