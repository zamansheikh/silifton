import { Injectable, Logger, OnModuleInit, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resourceType: string;
}

@Injectable()
export class UploadsService implements OnModuleInit {
  private readonly logger = new Logger(UploadsService.name);
  private configured = false;
  private folder = "silifton";

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const url = this.config.get<string>("CLOUDINARY_URL");
    if (!url) {
      this.logger.warn(
        "CLOUDINARY_URL not set — uploads will reject with 503 until configured.",
      );
      return;
    }
    // Parse cloudinary://<api_key>:<api_secret>@<cloud_name>
    // (more reliable than relying on the SDK's implicit env auto-load.)
    const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (!match) {
      this.logger.error(
        `Invalid CLOUDINARY_URL format. Expected cloudinary://<key>:<secret>@<cloud_name>`,
      );
      return;
    }
    const [, api_key, api_secret, cloud_name] = match;
    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
    this.folder = this.config.get<string>("CLOUDINARY_FOLDER") ?? this.folder;
    this.configured = true;
    this.logger.log(`Cloudinary configured (cloud: ${cloud_name}, folder: ${this.folder})`);
  }

  async upload(file: Express.Multer.File): Promise<UploadResult> {
    if (!this.configured) {
      throw new ServiceUnavailableException(
        "Uploads are not configured. Set CLOUDINARY_URL and restart the server.",
      );
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: this.folder,
          resource_type: "auto",
          // Reasonable defaults — autocrop large images, return progressive jpegs
          quality: "auto",
        },
        (err, res) => {
          if (err) return reject(err);
          if (!res) return reject(new Error("Empty Cloudinary response"));
          resolve(res);
        },
      );
      stream.end(file.buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      resourceType: result.resource_type,
    };
  }

  async destroy(publicId: string): Promise<void> {
    if (!this.configured) return;
    await cloudinary.uploader.destroy(publicId);
  }
}
