import type { Route } from "./+types/locales";
import { cacheHeader } from "pretty-cache-header";
import { data } from "react-router";
import { locales } from "~/locales";
import { isLocale } from "~/modules/i18n/guards/is-locale";
import { isLocaleNS } from "~/modules/i18n/guards/is-namespace";

export async function loader({ params }: Route.LoaderArgs) {
  const { locale, ns } = params;
  console.log("Loading locale:", locale, "namespace:", ns);
  if (!isLocale(locale)) return new Response("Invalid locale", { status: 400 });
  if (!isLocaleNS(ns))
    return new Response("Invalid namespace", { status: 400 });

  const headers = new Headers();

  if (process.env.NODE_ENV === "production") {
    headers.set(
      "Cache-Control",
      cacheHeader({
        maxAge: "5m", // Cache in the browser for 5 minutes
        sMaxage: "1d", // Cache in the CDN for 1 day
        // Serve stale content while revalidating for 7 days
        staleWhileRevalidate: "7d",
        // Serve stale content if there's an error for 7 days
        staleIfError: "7d",
      })
    );
  }

  return data(locales[locale][ns], {
    headers,
  });
}
