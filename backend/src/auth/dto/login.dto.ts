import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail() @MaxLength(200)
  email!: string;

  @IsString() @IsNotEmpty() @MinLength(6) @MaxLength(200)
  password!: string;
}
