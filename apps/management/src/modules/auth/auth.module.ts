import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '@database/database.module';
import { AuthGuard } from './auth.guard';


@Module({
  imports: [DatabaseModule],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthGuard, AuthService]
})
export class AuthModule {}
