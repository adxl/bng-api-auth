import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('index')
  index(): string {
    return this.appService.index();
  }

  @EventPattern('kill')
  kill(): void {
    return this.appService.kill();
  }
}
