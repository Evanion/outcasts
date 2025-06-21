import { CodeChallengeMethod, OAuth2Strategy } from "remix-auth-oauth2";
import { plainToInstance } from "class-transformer";
import { UserInfoDto } from "../dtos/userinfo";
import { AuthDTO } from "../dtos";

export const battleNetStrategy = await OAuth2Strategy.discover<AuthDTO>(
  "https://oauth.battle.net",
  {
    clientId: process.env.BNET_CLIENT_ID!,
    clientSecret: process.env.BNET_CLIENT_SECRET!,
    authorizationEndpoint: "https://oauth.battle.net/authorize",
    tokenEndpoint: "https://oauth.battle.net/token",
    redirectURI: process.env.BNET_REDIRECT_URI!,
    scopes: ["wow.profile"],
    codeChallengeMethod: CodeChallengeMethod.S256,
  },
  async ({ tokens, request, ...rest }) => {
    console.log("BattleNet Strategy verify", {
      tokens,
      ...rest,
    });

    const userInfo = await fetch("https://oauth.battle.net/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    }).then<UserInfoDto>((res) => plainToInstance(UserInfoDto, res.json()));

    console.log("User info response", userInfo);
    tokens.accessTokenExpiresAt();

    return plainToInstance(AuthDTO, {
      sub: userInfo.id,
      accessToken: tokens.accessToken(),
      expiresAt: tokens.accessTokenExpiresAt(),
    });
  }
);
