import { isEnum } from "class-validator";
import type { Route } from "./+types/callback";
import { authenticator } from "~/modules/auth/auth.server";
import { Provider } from "~/modules/auth/enums/provider.enum";
import { redirect } from "react-router";
import { sessionStorage } from "~/modules/auth/auth.cookie.server";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  if (!isEnum(params.provider, Provider))
    return new Response("Invalid provider", { status: 400 });
  const user = await authenticator.authenticate(params.provider, request);
  if (!user) {
    return new Response("Authentication failed", { status: 401 });
  }
  session.set("user", user);

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};
