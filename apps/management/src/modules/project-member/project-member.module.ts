import { Module } from '@nestjs/common';
import { ProjectMemberService } from './project-member.service';
import { ProjectMemberController } from './project-member.controller';
import { DatabaseModule } from '@database/database.module';
import { AuthModule } from '@auth';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ProjectMemberController],
  providers: [ProjectMemberService],
})
export class ProjectMemberModule {}
