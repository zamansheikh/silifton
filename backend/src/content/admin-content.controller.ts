import {
  BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards,
} from "@nestjs/common";
import { AdminGuard } from "../auth/admin.guard";
import { ContentService } from "./content.service";
import { COLLECTIONS, type Collection } from "./schemas/content-item.schema";

function assertCollection(value: string): Collection {
  if (!(COLLECTIONS as readonly string[]).includes(value)) {
    throw new BadRequestException(`Unknown collection '${value}'`);
  }
  return value as Collection;
}

/**
 * Admin-protected mirror of /content/* — reachable at /api/admin/content/*.
 * Lets the admin UI read collections (like `users`) that the public route refuses.
 */
@Controller("admin/content/:collection")
@UseGuards(AdminGuard)
export class AdminContentController {
  constructor(private readonly svc: ContentService) {}

  @Get()
  list(@Param("collection") c: string) {
    return this.svc.list(assertCollection(c));
  }

  @Get(":id")
  get(@Param("collection") c: string, @Param("id") id: string) {
    return this.svc.get(assertCollection(c), id);
  }

  @Post()
  @HttpCode(201)
  create(@Param("collection") c: string, @Body() body: Record<string, unknown>) {
    return this.svc.create(assertCollection(c), body);
  }

  @Patch(":id")
  update(@Param("collection") c: string, @Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.svc.update(assertCollection(c), id, body);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("collection") c: string, @Param("id") id: string) {
    return this.svc.remove(assertCollection(c), id);
  }
}
