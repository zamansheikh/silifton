import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

const BUDGETS = ["$50k–$100k", "$100k–$250k", "$250k–$500k", "$500k+", "Not sure yet"] as const;

export class CreateInquiryDto {
  @IsString() @IsNotEmpty() @MaxLength(120)
  name!: string;

  @IsString() @IsNotEmpty() @MaxLength(120)
  company!: string;

  @IsEmail() @MaxLength(200)
  email!: string;

  @IsOptional() @IsString() @MaxLength(200)
  subject?: string;

  @IsIn(BUDGETS)
  budget!: (typeof BUDGETS)[number];

  @IsString() @IsNotEmpty() @MaxLength(5000)
  message!: string;
}
