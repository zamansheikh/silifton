import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AdminGuard } from "../auth/admin.guard";
import { AnalyticsService } from "./analytics.service";
import { TrackDto } from "./dto/track.dto";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService) {}

  // Public beacon. Rate-limited by the global ThrottlerGuard.
  @Post("track")
  @HttpCode(204)
  async track(@Body() dto: TrackDto, @Req() req: Request): Promise<void> {
    const ip =
      ((req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0] ?? req.ip ?? "0.0.0.0").trim();
    const ua = (req.headers["user-agent"] as string | undefined) ?? "";
    const host = (req.headers["host"] as string | undefined)?.split(":")[0] ?? "";
    await this.svc.track({ path: dto.path, referrer: dto.referrer, ip, ua, host });
  }

  @Get("overview")
  @UseGuards(AdminGuard)
  overview() {
    return this.svc.overview();
  }

  @Get("series")
  @UseGuards(AdminGuard)
  series() {
    return this.svc.series();
  }
}
