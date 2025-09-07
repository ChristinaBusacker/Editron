import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { DatabaseModule } from '@database/database.module';
import { ProjectService } from './project.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}