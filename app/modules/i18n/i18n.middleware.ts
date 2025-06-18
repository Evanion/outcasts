import { unstable_createI18nextMiddleware } from "remix-i18next/middleware";
import { locales } from "../../locales";
export const [i18nMiddleware, getLocale, getInstance] =
  unstable_createI18nextMiddleware({
    detection: {
      supportedLanguages: Object.keys(locales),
      fallbackLanguage: "en",
    },
    i18next: {
      defaultNS: "common",
      resources: {
        ...locales,
      },
    },
  });
