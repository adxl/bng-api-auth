import { Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import * as Sentry from '@sentry/node';

@Catch(RpcException)
export class SentryRpcFilter implements ExceptionFilter {
  private readonly logger = new Logger(SentryRpcFilter.name);

  catch(exception: RpcException) {
    if (process.env.STAGE === 'production') {
      Sentry.captureException(exception);
    }

    this.logger.error(exception.getError().toString());
  }
}

@Catch(HttpException)
export class SentryHttpFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(SentryHttpFilter.name);

  catch(exception: HttpException) {
    if (process.env.STAGE === 'production') {
      Sentry.captureException(exception);
    }

    this.logger.error(exception.getResponse());
  }
}
