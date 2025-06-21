export function getCookieHeader(headers: Headers): string | null {
  return headers.get("cookie") || headers.get("Cookie");
}
export function setCookieHeader(headers: Headers, cookies: string[]): Headers {
  const cookieHeader = cookies.join("; ");
  if (cookieHeader) {
    headers.set("Set-Cookie", cookieHeader);
  } else {
    headers.delete("Set-Cookie");
  }
  return headers;
}
