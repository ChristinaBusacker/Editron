import { Module } from '@nestjs/common';
import { PublicApiService } from './public-api.service';
import { PublicAuthModule } from './public-auth.module';
import { PublicApiController } from './public-api.controller';


@Module({
  imports: [PublicAuthModule],
  providers: [PublicApiService],
  exports: [PublicApiService],
  controllers: [PublicApiController],
})
export class PublicApiModule {}
