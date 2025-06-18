import { Form, redirect } from "react-router";

import { sessionStorage } from "~/modules/auth/auth.cookie.server";
import { authenticator } from "~/modules/auth/auth.server";
import type { Route } from "./+types/login";
import { isEnum } from "class-validator";
import { instanceToPlain } from "class-transformer";
import { SocialButton } from "~/modules/auth/components/social-button";
import { Provider } from "~/modules/auth/enums/provider.enum";

export async function loader({ request }: Route.LoaderArgs) {
  await authenticator.authenticate("bnet", request);
}

export default function LoginPage() {
  return (
    <Form method="post">
      <SocialButton type="submit" name="provider" provider={Provider.BNet} />
    </Form>
  );
}

export async function action({ request }: Route.ActionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const formData = await request.clone().formData();
  const provider = formData.get("provider") as Provider | null;
  if (!provider) return new Response("Provider not specified", { status: 400 });

  if (!isEnum(provider, Provider))
    return new Response("Invalid provider", { status: 400 });
  const user = await authenticator.authenticate(provider, request);
  if (!user) return new Response("Authentication failed", { status: 401 });
  session.set("user", user);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
      }),
    },
  });
}
