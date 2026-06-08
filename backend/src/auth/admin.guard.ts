import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import jwt from "jsonwebtoken";

export interface AdminPrincipal {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();

    const header = req.headers["authorization"];
    let token: string | undefined;
    if (header?.startsWith("Bearer ")) {
      token = header.slice("Bearer ".length);
    }
    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const secret = this.config.get<string>("JWT_SECRET");
    if (!secret) {
      throw new UnauthorizedException("Server auth not configured");
    }

    try {
      const payload = jwt.verify(token, secret) as AdminPrincipal;
      (req as unknown as { user?: AdminPrincipal }).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
