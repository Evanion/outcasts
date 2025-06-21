import type { Route } from "./+types/logout";
import { Container } from "typedi";
import { AUTH_SERVICE } from "~/modules/auth";

export async function loader({ request }: Route.LoaderArgs) {
  const authService = Container.get(AUTH_SERVICE);
  return authService.logout(request);
}
