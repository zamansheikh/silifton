import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../auth/admin.guard";
import { PUBLIC_KEYS, SettingsService } from "./settings.service";

@Controller("settings")
export class SettingsController {
  constructor(private readonly svc: SettingsService) {}

  // Public, unauthenticated read of the keys whitelisted in PUBLIC_KEYS.
  @Get()
  async listPublic() {
    return this.svc.getPublic();
  }

  // Public single-key read — only allowed for whitelisted site.* keys.
  @Get(":key")
  async getPublicKey(@Param("key") key: string) {
    if (!PUBLIC_KEYS.has(key)) return {};
    return this.svc.get(key);
  }
}

@Controller("admin/settings")
@UseGuards(AdminGuard)
export class AdminSettingsController {
  constructor(private readonly svc: SettingsService) {}

  @Get()
  list() {
    return this.svc.getMany([...PUBLIC_KEYS, "workspace.general"]);
  }

  @Get(":key")
  get(@Param("key") key: string) {
    return this.svc.get(key);
  }

  @Patch(":key")
  set(@Param("key") key: string, @Body() body: Record<string, unknown>) {
    return this.svc.set(key, body);
  }
}
