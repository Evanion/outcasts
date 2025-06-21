import { Persona } from "~/modules/persona";

export class AuthDTO {
  accessToken!: string;
  expiresAt!: Date;
  sub!: number;
  persona!: Persona;
}
