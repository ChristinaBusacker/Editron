import { Controller, Get } from '@nestjs/common';
import { PublicApiService } from './public-api.service';

@Controller()
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  @Get()
  getHello(): string {
    return this.publicApiService.getHello();
  }
}
