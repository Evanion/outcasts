import { IsNumberString, IsString } from "class-validator";

export class CreateProfileDto {
  @IsNumberString()
  nid: string;

  @IsString()
  givenName: string;

  @IsString()
  surname: string;
}
