import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { AdminGuard } from "../auth/admin.guard";
import { UploadsService } from "./uploads.service";

@Controller("admin/uploads")
@UseGuards(AdminGuard)
export class UploadsController {
  constructor(
    private readonly svc: UploadsService,
    private readonly config: ConfigService,
  ) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: {
        // Will be re-checked at request time using env var if you want stricter
        fileSize: 50 * 1024 * 1024,
      },
    }),
  )
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Missing 'file' part in form-data");
    }

    const maxBytes = Number(this.config.get<string>("UPLOAD_MAX_BYTES") ?? 10 * 1024 * 1024);
    if (file.size > maxBytes) {
      throw new BadRequestException(
        `File too large: ${file.size} bytes > ${maxBytes} (${(maxBytes / 1024 / 1024).toFixed(1)} MB)`,
      );
    }

    return this.svc.upload(file);
  }

  @Delete()
  @HttpCode(204)
  async remove(@Body() body: { publicId: string }) {
    if (!body?.publicId) {
      throw new BadRequestException("publicId is required");
    }
    await this.svc.destroy(body.publicId);
  }
}
