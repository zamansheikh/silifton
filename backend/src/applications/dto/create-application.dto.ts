import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateApplicationDto {
  @IsString() @IsNotEmpty() @MaxLength(120)
  candidate!: string;

  @IsEmail() @MaxLength(200)
  email!: string;

  @IsString() @IsNotEmpty() @MaxLength(120)
  roleId!: string;

  @IsOptional() @IsString() @MaxLength(200)
  linkedin?: string;

  @IsOptional() @IsString() @MaxLength(200)
  portfolio?: string;

  @IsOptional() @IsString() @MaxLength(5000)
  note?: string;

  @IsOptional() @IsString() @MaxLength(80)
  source?: string;
}
