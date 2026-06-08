import { Injectable, Logger, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Model } from "mongoose";

import { MODEL_NAMES } from "../content/schemas/content-item.schema";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  passwordHash?: string;
  initials?: string;
  lastActive?: string;
};

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(MODEL_NAMES.users) private readonly users: Model<AdminUser>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const email = this.config.get<string>("ADMIN_EMAIL");
    const password = this.config.get<string>("ADMIN_PASSWORD");
    if (!email || !password) {
      this.logger.warn(
        "ADMIN_EMAIL / ADMIN_PASSWORD not set — admin login disabled until you fill them in .env and restart.",
      );
      return;
    }

    const existing = await this.users.findOne({ email }).lean();
    if (existing?.passwordHash) {
      return; // Already provisioned.
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (existing) {
      await this.users.updateOne({ email }, { $set: { passwordHash } });
      this.logger.log(`Set initial password for existing admin ${email}`);
      return;
    }

    const name = this.config.get<string>("ADMIN_NAME") ?? "Admin";
    const initials = name
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    await this.users.create({
      id: `u-${Date.now().toString(36)}`,
      email,
      name,
      role: "Owner",
      initials,
      lastActive: "never",
      passwordHash,
    });
    this.logger.log(`Seeded admin user ${email}`);
  }

  async login(email: string, password: string) {
    const user = await this.users.findOne({ email }).lean();
    if (!user?.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const secret = this.config.get<string>("JWT_SECRET");
    if (!secret) {
      throw new UnauthorizedException("Server auth not configured");
    }
    const expiresIn = this.config.get<string>("JWT_EXPIRES_IN") ?? "7d";

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] },
    );

    return {
      token,
      expiresIn,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async me(userId: string) {
    const user = await this.users.findOne({ id: userId }).select("-passwordHash -_id -__v").lean();
    if (!user) throw new UnauthorizedException("User no longer exists");
    return user;
  }
}
