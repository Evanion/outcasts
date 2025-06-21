import { Container } from "typedi";
import { AUTH_SERVICE, getAuthContext } from "~/modules/auth";
import { Form, redirect } from "react-router";
import type { Route } from "./+types/login";
import { SocialButton } from "~/modules/auth/components/social-button";
import { Provider } from "~/modules/auth/enums/provider.enum";

export async function loader({ context }: Route.LoaderArgs) {
  const auth = getAuthContext(context);
  if (auth.isAuthenticated) {
    return redirect("/");
  }
}

export default function LoginPage() {
  return (
    <Form method="post">
      <SocialButton type="submit" name="provider" provider={Provider.BNet} />
    </Form>
  );
}

export async function action({ request }: Route.ActionArgs) {
  const authService = Container.get(AUTH_SERVICE);

  return authService.login(request);
}
