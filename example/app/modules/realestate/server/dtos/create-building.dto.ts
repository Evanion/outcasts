import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { IsFrn } from "~/lib/validation";

export class CreateBuildingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsInt()
  @Min(1)
  floors: number;

  @IsFrn("area")
  areaFrn: string;
}
