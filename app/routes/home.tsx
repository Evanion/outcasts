import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { Form, Link } from "react-router";
import { SocialButton } from "~/modules/auth/components/social-button";
import { Provider } from "~/modules/auth/enums/provider.enum";
import { useTranslation } from "react-i18next";
import { getAuthContext } from "~/modules/auth";

export const loader = async ({ context }: Route.LoaderArgs) => {
  const auth = getAuthContext(context);

  return {
    auth,
  };
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home({ loaderData: { auth } }: Route.ComponentProps) {
  const { t } = useTranslation("auth");
  console.log("auth", auth);
  if (!auth.isAuthenticated)
    return (
      <div className="flex h-screen items-center justify-center">
        <Form method="post" action="/login">
          <SocialButton
            provider={Provider.BNet}
            name="provider"
            type="submit"
          />
        </Form>
      </div>
    );

  return (
    <div className="flex h-screen items-center justify-center">
      <h1>
        {t("GREETING_USER", { username: auth.sub, ns: "auth" })}
        <Button asChild>
          <Link to="/logout">{t("LOGOUT", { ns: "auth" })}</Link>
        </Button>
      </h1>
    </div>
  );
}
