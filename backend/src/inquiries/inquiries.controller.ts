import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../auth/admin.guard";
import { CreateInquiryDto } from "./dto/create-inquiry.dto";
import { UpdateInquiryDto } from "./dto/update-inquiry.dto";
import { InquiriesService } from "./inquiries.service";

@Controller("inquiries")
export class InquiriesController {
  constructor(private readonly svc: InquiriesService) {}

  // ---- public: contact form ----
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateInquiryDto) {
    return this.svc.create(dto);
  }

  // ---- admin only ----
  @Get()
  @UseGuards(AdminGuard)
  list() {
    return this.svc.list();
  }

  @Get(":id")
  @UseGuards(AdminGuard)
  get(@Param("id") id: string) {
    return this.svc.get(id);
  }

  @Patch(":id")
  @UseGuards(AdminGuard)
  update(@Param("id") id: string, @Body() dto: UpdateInquiryDto) {
    return this.svc.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  @HttpCode(204)
  remove(@Param("id") id: string) {
    return this.svc.remove(id);
  }
}
