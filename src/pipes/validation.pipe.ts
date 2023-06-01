import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, ValidationPipe } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CustomValidationPipe extends ValidationPipe implements PipeTransform<any> {
  constructor() {
    super({ whitelist: true });
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new RpcException(new BadRequestException(error.getResponse()));
      }
      throw error;
    }
  }
}
