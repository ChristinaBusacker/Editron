import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MigrationModule } from './core/migration/migration.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { ProjectMemberModule } from './modules/project-member/project-member.module';
import { ContentModule } from './modules/content/content.module';

@Module({
  imports: [
    AuthModule, 
    MigrationModule, 
    UserModule, 
    ProjectModule, 
    ProjectMemberModule, 
    ContentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
