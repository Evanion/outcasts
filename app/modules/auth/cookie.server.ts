import { createCookieSessionStorage } from "react-router";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { AuthDTO } from "./dtos/auth.dto";

export const authStorage = createCookieSessionStorage<AuthDTO>({
  cookie: {
    name: "__session",
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    serialize(value) {
      console.log("Serializing user session", value);
      return Promise.resolve(JSON.stringify(instanceToPlain(value)));
    },
    parse(cookieHeader) {
      console.log("Parsing user session cookie", cookieHeader);
      try {
        if (!cookieHeader) {
          return Promise.reject(new Error("No session cookie found"));
        }
        const parsed = JSON.parse(cookieHeader);
        return Promise.resolve(plainToInstance(AuthDTO, parsed));
      } catch (error) {
        console.error("Failed to parse user session cookie", error);
        return Promise.reject(new Error("Invalid session cookie"));
      }
    },
  },
});
