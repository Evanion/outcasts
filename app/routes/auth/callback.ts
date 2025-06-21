import type { Route } from "./+types/callback";
import { Provider } from "~/modules/auth/enums/provider.enum";

import { Container } from "typedi";
import { AUTH_SERVICE } from "~/modules/auth";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const authService = Container.get(AUTH_SERVICE);
  return authService.callback(request, params.provider as Provider);
};
