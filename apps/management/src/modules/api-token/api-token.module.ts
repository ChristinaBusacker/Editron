import { Module } from '@nestjs/common';

import { AuthModule } from '@auth';
import { DatabaseModule } from '@database/database.module';
import { ApiTokenController } from './api-token.controller';
import { ApiTokenService } from './api-token.service';


@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ApiTokenController],
  providers: [ApiTokenService],
})
export class ApiTokenModule {}
