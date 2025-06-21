import { Route } from ".react-router/types/app/+types/root";
import {
  unstable_createContext,
  unstable_RouterContextProvider,
} from "react-router";
import { Container } from "typedi";
import { AUTH_SERVICE } from "../constants";
import { Persona, PERSONA_SERVICE } from "~/modules/persona";

interface BaseAuthContext {
  isAuthenticated: boolean;
  token?: string;
  sub?: number;
  persona?: Persona;
}

interface LoggedInContext extends BaseAuthContext {
  isAuthenticated: true;
  token: string;
  sub: number;
  persona: Persona;
}

interface LoggedOutContext extends BaseAuthContext {
  isAuthenticated: false;
}

export type AuthContext = LoggedInContext | LoggedOutContext;

const authContext = unstable_createContext<AuthContext>();

export const authMiddleware: Route.unstable_MiddlewareFunction = async (
  { request, context },
  next
) => {
  try {
    const authService = Container.get(AUTH_SERVICE);
    const personaService = Container.get(PERSONA_SERVICE);
    const auth = await authService.getAuth(request);

    if (!auth || !auth.accessToken) {
      const authCtx: LoggedOutContext = {
        isAuthenticated: false,
      };
      context.set(authContext, authCtx);
      return;
    }

    const persona = await personaService.get(auth.sub.toString());
    const authCtx: LoggedInContext = {
      isAuthenticated: true,
      token: auth.accessToken,
      sub: auth.sub,
      persona,
    };

    context.set(authContext, authCtx);
  } catch (error) {
    console.error("Auth middleware error:", error);

    // Continue without auth context on error
    const authCtx: AuthContext = {
      isAuthenticated: false,
    };

    context.set(authContext, authCtx);
  } finally {
    return next();
  }
};

export function getAuthContext(
  context: unstable_RouterContextProvider
): AuthContext {
  const authCtx = context.get(authContext);
  if (!authCtx) {
    throw new Error("Auth context not found");
  }
  return authCtx;
}

export function requireAuth(
  context: unstable_RouterContextProvider
): LoggedInContext {
  const authCtx = getAuthContext(context);
  if (!authCtx.isAuthenticated) {
    throw new Response("User is not authenticated", { status: 401 });
  }
  return authCtx as LoggedInContext;
}
