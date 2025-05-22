import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MigrationModule } from './core/migration/migration.module';

@Module({
  imports: [AuthModule, MigrationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
