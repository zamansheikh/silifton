import { IsIn, IsOptional } from "class-validator";

const STATUSES = ["New", "In review", "Replied", "Won", "Closed"] as const;
const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;

export class UpdateInquiryDto {
  @IsOptional() @IsIn(STATUSES)
  status?: (typeof STATUSES)[number];

  @IsOptional() @IsIn(PRIORITIES)
  priority?: (typeof PRIORITIES)[number];
}
