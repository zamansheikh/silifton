/**
 * Vercel serverless entrypoint for the NestJS API.
 *
 * Vercel Functions handle a single request and return — they don't keep a
 * long-running TCP listener like main.ts does. This file boots the Nest app
 * once on cold start, caches the underlying Express handler, and forwards
 * subsequent requests through it.
 *
 * Local development still uses src/main.ts (`npm run start:dev`).
 */
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express, { type Express, type Request, type Response } from "express";
import { AppModule } from "../src/app.module";

// Cache the bootstrap PROMISE (not just the result) so concurrent cold-start
// requests share a single initialization instead of racing to create
// duplicate Nest apps and Mongoose connections.
let bootstrapPromise: Promise<Express> | null = null;

function bootstrap(): Promise<Express> {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    const server = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
      bufferLogs: true,
    });

    app.setGlobalPrefix("api");
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const origins = (process.env.CORS_ORIGIN ?? "*")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    app.enableCors({
      origin: origins.includes("*") ? true : origins,
      credentials: true,
    });

    await app.init();
    return server;
  })().catch((err) => {
    // Reset so the next request can retry, otherwise a transient bootstrap
    // failure (e.g. Atlas timeout on cold start) would poison the cache.
    bootstrapPromise = null;
    throw err;
  });

  return bootstrapPromise;
}

export default async function handler(req: Request, res: Response): Promise<void> {
  const app = await bootstrap();
  app(req, res);
}
