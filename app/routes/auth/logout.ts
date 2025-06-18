import { redirect } from "react-router";
import { authenticator } from "~/modules/auth/auth.server";
import { Provider } from "~/modules/auth/enums/provider.enum";
import type { Route } from "./+types/logout";
import { sessionStorage } from "~/modules/auth/auth.cookie.server";
import type { OAuth2Strategy } from "remix-auth-oauth2";
import type { User } from "~/modules/auth/entities/user";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const user = session.get("user");
  const bnet = (await authenticator.get(Provider.BNet)) as OAuth2Strategy<User>;
  if (!bnet || !user) {
    session.unset("user");
    return new Response("Not authenticated", {
      status: 401,
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  }

  await bnet.revokeToken(user.accessToken);
  session.unset("user");
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}
