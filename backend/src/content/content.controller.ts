import {
  BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards,
} from "@nestjs/common";
import { AdminGuard } from "../auth/admin.guard";
import { ContentService } from "./content.service";
import { COLLECTIONS, type Collection } from "./schemas/content-item.schema";

const PUBLIC_READ: ReadonlySet<Collection> = new Set([
  "services",
  "portfolio",
  "posts",
  "team",
  "testimonials",
  "careers",
]);

function assertCollection(value: string): Collection {
  if (!(COLLECTIONS as readonly string[]).includes(value)) {
    throw new BadRequestException(`Unknown collection '${value}'`);
  }
  return value as Collection;
}

@Controller("content/:collection")
export class ContentController {
  constructor(private readonly svc: ContentService) {}

  /**
   * Reads are public for marketing collections; users collection is admin-only.
   * Mutations always require admin.
   */
  @Get()
  list(@Param("collection") raw: string) {
    const c = assertCollection(raw);
    if (!PUBLIC_READ.has(c)) {
      throw new BadRequestException(
        `${c} is admin-only; use the /api/admin proxy with an authorized session`,
      );
    }
    return this.svc.list(c);
  }

  @Get(":id")
  get(@Param("collection") raw: string, @Param("id") id: string) {
    const c = assertCollection(raw);
    if (!PUBLIC_READ.has(c)) {
      throw new BadRequestException(`${c} is admin-only`);
    }
    return this.svc.get(c, id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(201)
  create(@Param("collection") raw: string, @Body() body: Record<string, unknown>) {
    return this.svc.create(assertCollection(raw), body);
  }

  @Patch(":id")
  @UseGuards(AdminGuard)
  update(@Param("collection") raw: string, @Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.svc.update(assertCollection(raw), id, body);
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  @HttpCode(204)
  remove(@Param("collection") raw: string, @Param("id") id: string) {
    return this.svc.remove(assertCollection(raw), id);
  }
}
