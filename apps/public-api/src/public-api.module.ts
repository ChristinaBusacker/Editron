import { Module } from '@nestjs/common';
import { PublicApiController } from './public-api.controller';
import { PublicApiService } from './public-api.service';

@Module({
  imports: [],
  controllers: [PublicApiController],
  providers: [PublicApiService],
})
export class PublicApiModule {}
