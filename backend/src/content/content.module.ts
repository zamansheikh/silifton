import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthModule } from "../auth/auth.module";
import { AdminContentController } from "./admin-content.controller";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";
import { COLLECTIONS, MODEL_NAMES, buildContentSchema } from "./schemas/content-item.schema";

const features = COLLECTIONS.map((c) => ({
  name: MODEL_NAMES[c],
  // Each collection gets its own schema instance to avoid Mongoose's
  // "OverwriteModelError" and so timestamps/hooks stay isolated.
  schema: buildContentSchema(),
  collection: c,
}));

const contentMongoose = MongooseModule.forFeature(features);

@Module({
  imports: [contentMongoose, AuthModule],
  controllers: [ContentController, AdminContentController],
  providers: [ContentService],
  // Re-export the Mongoose module so other modules that import ContentModule
  // (AnalyticsModule) can inject the per-collection models.
  exports: [ContentService, contentMongoose],
})
export class ContentModule {}
