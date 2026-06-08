import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../auth/admin.guard";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { ApplicationsService } from "./applications.service";

@Controller("applications")
export class ApplicationsController {
  constructor(private readonly svc: ApplicationsService) {}

  // ---- public: careers application form ----
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateApplicationDto) {
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
  update(@Param("id") id: string, @Body() dto: UpdateApplicationDto) {
    return this.svc.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  @HttpCode(204)
  remove(@Param("id") id: string) {
    return this.svc.remove(id);
  }
}
