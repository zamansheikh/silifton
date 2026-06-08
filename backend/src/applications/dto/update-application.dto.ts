import { IsIn, IsInt, IsOptional, Max, Min } from "class-validator";

const STAGES = [
  "New",
  "Tech screen",
  "Portfolio review",
  "Hiring manager",
  "Onsite",
  "Offer",
  "Hired",
  "Rejected",
] as const;

export class UpdateApplicationDto {
  @IsOptional() @IsIn(STAGES)
  stage?: (typeof STAGES)[number];

  @IsOptional() @IsInt() @Min(0) @Max(100)
  score?: number;
}
