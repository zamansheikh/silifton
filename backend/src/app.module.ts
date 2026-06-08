import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

import { AuthModule } from "./auth/auth.module";
import { HealthController } from "./health/health.controller";
import { InquiriesModule } from "./inquiries/inquiries.module";
import { ApplicationsModule } from "./applications/applications.module";
import { ContentModule } from "./content/content.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { SettingsModule } from "./settings/settings.module";
import { UploadsModule } from "./uploads/uploads.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const uri = cfg.get<string>("MONGODB_URI");
        if (!uri) {
          throw new Error(
            "MONGODB_URI is required. Set it in backend/.env (see .env.example).",
          );
        }
        return {
          uri,
          dbName: cfg.get<string>("MONGODB_DB") ?? "silifton",
          serverSelectionTimeoutMS: 15_000,
        };
      },
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    ContentModule, // must be imported before AuthModule so the users model is registered
    AuthModule,
    InquiriesModule,
    ApplicationsModule,
    AnalyticsModule,
    SettingsModule,
    UploadsModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
