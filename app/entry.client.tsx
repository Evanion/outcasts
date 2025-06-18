import * as Sentry from "@sentry/react-router";
import i18next from "i18next";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";
import Fetch from "i18next-fetch-backend";
import * as locales from "./locales";
import { getInitialNamespaces } from "remix-i18next/client";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  integrations: [
    Sentry.reactRouterTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
    }),
  ],
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set `tracePropagationTargets` to declare which URL(s) should have trace propagation enabled
  tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],
  // Capture Replay for 10% of all sessions,
  // plus 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

async function main() {
  await i18next
    .use(initReactI18next)
    .use(Fetch)
    .use(I18nextBrowserLanguageDetector)
    .init({
      fallbackLng: "en",
      ns: getInitialNamespaces(),
      detection: { order: ["htmlTag"], caches: [] },
      backend: { loadPath: "/api/locales/{{lng}}/{{ns}}" },
    });
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>
    );
  });
}

main().catch((error) => {
  console.error("Error during initialization:", error);
});
