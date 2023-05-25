import { LogLevel, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

import * as Sentry from '@sentry/node';
import { SentryFilter } from './filters/sentry.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 9000,
    },
    logger: ['error', 'warn', 'debug', 'log'] as LogLevel[],
  });

  if (process.env.STAGE === 'production') {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    app.useGlobalFilters(
      new SentryFilter(app.get(HttpAdapterHost).httpAdapter),
    );
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen();
}

bootstrap();
