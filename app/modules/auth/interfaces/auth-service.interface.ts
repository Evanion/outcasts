import { Strategy } from "remix-auth/strategy";
import { AuthDTO } from "../dtos";
import { Provider } from "../enums/provider.enum";

export interface IAuthService {
  authenticate(provider: Provider, request: Request): Promise<AuthDTO>;

  strategy(provider: Provider): Strategy<AuthDTO, never>;

  getAuth(request: Request, required: true): Promise<AuthDTO>;
  getAuth(request: Request, required?: boolean): Promise<AuthDTO | null>;

  login(request: Request): Promise<Response>;
  logout(request: Request): Promise<Response>;
  callback(request: Request, provider: Provider): Promise<Response | null>;
}
