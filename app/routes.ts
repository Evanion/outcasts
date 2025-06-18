import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  ...prefix("api", [route("locales/:locale/:ns", "routes/i18n/locales.ts")]),
  ...prefix("auth", [route(":provider/callback", "routes/auth/callback.ts")]),
  route("login", "routes/auth/login.tsx"),
  route("logout", "routes/auth/logout.ts"),
] satisfies RouteConfig;
