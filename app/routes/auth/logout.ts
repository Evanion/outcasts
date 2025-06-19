import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import type { OAuth2Strategy } from "remix-auth-oauth2";
import { authenticator, Provider, User } from "~/modules/auth/server";


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

  if (user.accessToken) {
    await bnet.revokeToken(user.accessToken);
  }
  session.unset("user");
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}
