import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { ContentSchemaController } from './schemas/content-schema.controller';
import { ContentSchemaService } from './schemas/content-schema.service';
import { AuthModule } from '@auth';
import { ContentEntryController } from './entries/content-entry.controller';
import { ContentEntryService } from './entries/content-entry.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ContentSchemaController, ContentEntryController],
  providers: [ContentSchemaService, ContentEntryService],
})
export class ContentModule {}
