import { locales, type Namespace } from "~/locales";

export function isLocaleNS(namespace: string): namespace is Namespace {
  return Object.keys(locales.en).includes(namespace);
}
