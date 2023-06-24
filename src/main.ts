import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

import * as Sentry from '@sentry/node';
import { SentryHttpFilter, SentryRpcFilter } from './filters/sentry.filter';
import { CustomValidationPipe } from './pipes/validation.pipe';

export async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number(process.env.PORT) || 9000,
    },
    logger: ['error', 'warn', 'debug', 'log'] as LogLevel[],
  });

  if (process.env.STAGE === 'production') {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
  }

  app.useGlobalPipes(new CustomValidationPipe());

  app.useGlobalFilters(new SentryRpcFilter());
  app.useGlobalFilters(new SentryHttpFilter());

  await app.listen();

  return app;
}

if (process.env.STAGE !== 'test') {
  bootstrap();
}
