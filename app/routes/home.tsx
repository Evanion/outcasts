import type { Route } from "./+types/home";
import { sessionStorage } from "~/modules/auth/auth.cookie.server";
import { Button } from "~/components/ui/button";
import { Form, Link } from "react-router";
import { SocialButton } from "~/modules/auth/components/social-button";
import { Provider } from "~/modules/auth/enums/provider.enum";
import { getInstance } from "~/modules/i18n/i18n.middleware";
import { useTranslation } from "react-i18next";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const user = session.get("user");

  return {
    user,
  };
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home({ loaderData: { user } }: Route.ComponentProps) {
  const { t } = useTranslation("auth");
  if (!user)
    return (
      <div className="flex h-screen items-center justify-center">
        <Form method="post" action="/login">
          <SocialButton provider={Provider.BNet} type="submit" />
        </Form>
      </div>
    );

  return (
    <div className="flex h-screen items-center justify-center">
      <h1>
        {t("GREETING_USER", { username: user.battletag, ns: "auth" })}
        <Button asChild>
          <Link to="/logout">{t("LOGOUT", { ns: "auth" })}</Link>
        </Button>
      </h1>
    </div>
  );
}
