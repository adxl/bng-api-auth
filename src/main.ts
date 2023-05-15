import { LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 9000,
    },
    logger: ['error', 'warn', 'debug', 'log'] as LogLevel[],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen();
}

bootstrap();
