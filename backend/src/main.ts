import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true, // Cần cho Stripe webhook signature verification
  });

  // ─── Global Validation Pipe ────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ─── Serve static files from 'public' folder ──────────
  const publicPath = join(process.cwd(), 'public');
  app.use('/', express.static(publicPath));

  // ─── Enable CORS for frontend ─────────────────────────
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // ─── Global API prefix ────────────────────────────────
  app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');

  await app.listen(process.env.PORT ?? 4000);
  console.log(`🚀 Backend running on http://localhost:${process.env.PORT ?? 4000}`);
  console.log(`📂 Static assets: ${publicPath}`);
}
bootstrap();
