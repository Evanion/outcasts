import { Authenticator } from "remix-auth";
import { Service } from "typedi";
import { AuthDTO } from "./dtos";
import { isProvider, Provider } from "./enums/provider.enum";
import { battleNetStrategy } from "./strategies/bnet";
import { IAuthService } from "./interfaces/auth-service.interface";
import { Strategy } from "remix-auth/strategy";
import { AUTH_SERVICE } from "./constants";
import { authStorage } from "./cookie.server";
import { getCookieHeader, setCookieHeader } from "~/lib/cookie";
import { plainToInstance } from "class-transformer";
import { redirect } from "react-router";
import { OAuth2Strategy } from "remix-auth-oauth2";
import { time } from "~/lib/time";

@Service(AUTH_SERVICE)
export class AuthService implements IAuthService {
  private authenticator: Authenticator<AuthDTO>;

  constructor() {
    this.authenticator = new Authenticator<AuthDTO>();
    this.authenticator.use(battleNetStrategy, Provider.BNet);
  }

  async authenticate(provider: Provider, request: Request): Promise<AuthDTO> {
    const authStore = await authStorage.getSession(
      getCookieHeader(request.headers)
    );
    if (authStore.has("accessToken"))
      return plainToInstance(AuthDTO, {
        sub: authStore.get("sub"),
        accessToken: authStore.get("accessToken"),
        expiresAt: authStore.get("expiresAt"),
      });

    return this.authenticator.authenticate(provider, request);
  }

  strategy(provider: Provider): Strategy<AuthDTO, never> {
    const strategy = this.authenticator.get(provider);
    if (!strategy) {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    return strategy;
  }

  async getAuth(request: Request, required: true): Promise<AuthDTO>;
  async getAuth(request: Request, required?: boolean): Promise<AuthDTO | null> {
    const session = await authStorage.getSession(
      getCookieHeader(request.headers)
    );
    if (required && !session.has("accessToken")) {
      throw redirect("/login");
    }

    if (!session.has("accessToken")) {
      return null;
    }

    return plainToInstance(AuthDTO, {
      sub: session.get("sub"),
      accessToken: session.get("accessToken"),
      expiresAt: session.get("expiresAt"),
    });
  }

  async login(request: Request): Promise<Response> {
    const session = await authStorage.getSession(request.headers.get("Cookie"));
    const formData = await request.clone().formData();
    const provider = formData.get("provider") as Provider | null;
    if (!provider) {
      return new Response("Provider not specified", { status: 400 });
    }

    if (!isProvider(provider)) {
      return new Response("Invalid provider", { status: 400 });
    }

    const authDto = await this.authenticate(provider, request);

    if (!authDto) return new Response("Authentication failed", { status: 401 });

    Object.entries(authDto).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        session.unset(key as keyof AuthDTO);
      } else {
        session.set(key as keyof AuthDTO, value);
      }
    });

    return redirect("/", {
      headers: setCookieHeader(request.headers, [
        await authStorage.commitSession(session, {
          maxAge: time`1d` / 1000, // 1 day
        }),
      ]),
    });
  }

  async logout(request: Request): Promise<Response> {
    const session = await authStorage.getSession(
      getCookieHeader(request.headers)
    );
    const bnet = this.authenticator.get(
      Provider.BNet
    ) as OAuth2Strategy<AuthDTO>;
    const accessToken = session.get("accessToken");
    if (accessToken) {
      await bnet.revokeToken(accessToken);
    }

    return redirect("/", {
      headers: setCookieHeader(request.headers, [
        await authStorage.destroySession(session),
      ]),
    });
  }

  async callback(
    request: Request,
    provider: Provider
  ): Promise<Response | null> {
    const session = await authStorage.getSession(request.headers.get("cookie"));
    if (!isProvider(provider))
      return new Response("Invalid provider", { status: 400 });

    const auth = await this.authenticate(provider, request);
    if (!auth) {
      return new Response("Authentication failed", { status: 401 });
    }

    Object.entries(auth).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        session.unset(key as keyof AuthDTO);
      } else {
        session.set(key as keyof AuthDTO, value);
      }
    });

    return redirect("/", {
      headers: {
        "Set-Cookie": await authStorage.commitSession(session),
      },
    });
  }
}
