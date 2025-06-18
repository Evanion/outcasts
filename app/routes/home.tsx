import type { Route } from "./+types/home";
import { sessionStorage } from "~/modules/auth/auth.cookie.server";
import { Button } from "~/components/ui/button";
import { Form, Link } from "react-router";
import { SocialButton } from "~/modules/auth/components/social-button";
import { Provider } from "~/modules/auth/enums/provider.enum";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return { user: session.get("user") || null };
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  if (!loaderData.user)
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
        Welcome {loaderData.user.battletag}{" "}
        <Button asChild>
          <Link to="/logout">Logout</Link>
        </Button>
      </h1>
    </div>
  );
}
