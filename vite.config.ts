import { reactRouter } from "@react-router/dev/vite";
import devtoolsJson from "vite-plugin-devtools-json";
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
    devtoolsJson(),
    tailwindcss(),
    reactRouter(),
    sentryReactRouter(sentryConfig, config),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
}));
