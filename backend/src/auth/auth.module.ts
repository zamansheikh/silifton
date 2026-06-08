import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MODEL_NAMES, buildContentSchema } from "../content/schemas/content-item.schema";
import { AdminGuard } from "./admin.guard";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    // Re-register the users collection so AuthService can read/write password hashes.
    // (Mongoose only instantiates each named model once across the app.)
    MongooseModule.forFeature([
      {
        name: MODEL_NAMES.users,
        schema: buildContentSchema(),
        collection: "users",
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminGuard],
  exports: [AdminGuard, AuthService],
})
export class AuthModule {}
