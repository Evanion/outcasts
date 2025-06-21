import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { AreaStatus } from "../enums/area-status.enum";
import { Field } from "~/lib/form";

export class CreateAreaDto {
  @IsString()
  @IsNotEmpty()
  @Field("input", { label: "Name" })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Field("input", { label: "URL Slug" })
  slug: string;

  @IsString()
  @IsNotEmpty()
  @Field("textarea", { label: "Description" })
  description: string;

  @IsString()
  @IsNotEmpty()
  @Field("input", { label: "Location" })
  location: string;

  @IsEnum(AreaStatus)
  status: AreaStatus = AreaStatus.AVAILABLE;
}
