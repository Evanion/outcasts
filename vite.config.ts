import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import {
  sentryReactRouter,
  type SentryReactRouterBuildOptions,
} from "@sentry/react-router";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "outcasts-c1",
  project: "website",
  // An auth token is required for uploading source maps.
  authToken: process.env.SENTRY_AUTH_TOKEN || "",
  // ...
};

export default defineConfig((config) => ({
  plugins: [
    tailwindcss(),
    reactRouter(),
    sentryReactRouter(sentryConfig, config),
    tsconfigPaths(),
  ],
}));
