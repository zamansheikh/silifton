import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthModule } from "../auth/auth.module";
import { ContentModule } from "../content/content.module";
import { Inquiry, InquirySchema } from "../inquiries/schemas/inquiry.schema";
import { Application, ApplicationSchema } from "../applications/schemas/application.schema";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";
import { PageView, PageViewSchema } from "./schemas/page-view.schema";

@Module({
  imports: [
    AuthModule,
    ContentModule, // re-uses Mongoose models registered there (Posts, Portfolio, ...)
    MongooseModule.forFeature([
      { name: "PageView", schema: PageViewSchema },
      { name: Inquiry.name, schema: InquirySchema },
      { name: Application.name, schema: ApplicationSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {
  // Keep the schema classes referenced so they aren't tree-shaken from the bundle.
  static _ref() { void [PageView]; }
}
