import { ForbiddenException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  index(): string {
    throw new RpcException(new ForbiddenException('Not Authorized !'));
    return 'Auth API';
  }
}
