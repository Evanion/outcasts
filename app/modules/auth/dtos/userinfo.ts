import { IsNumber, IsString } from "class-validator";

export class UserInfoDto {
  @IsNumber()
  id!: number;

  @IsString()
  sub!: string;

  @IsString()
  battletag!: string;
}
