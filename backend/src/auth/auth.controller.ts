import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AdminGuard, type AdminPrincipal } from "./admin.guard";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly svc: AuthService) {}

  @Post("login")
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.svc.login(dto.email, dto.password);
  }

  @Get("me")
  @UseGuards(AdminGuard)
  me(@Req() req: Request) {
    const principal = (req as unknown as { user: AdminPrincipal }).user;
    return this.svc.me(principal.sub);
  }
}
