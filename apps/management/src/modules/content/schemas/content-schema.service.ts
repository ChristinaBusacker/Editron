import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';

@Injectable()
export class ContentSchemaService {
  constructor(private readonly db: DatabaseService) {}

  async getAllSchemas() {
    return this.db.contentSchemaRepository.find({
      order: { name: 'ASC' },
      select: ['id', 'name', 'slug'],
    });
  }

  async getSchemaBySlug(slug: string) {
    const schema = await this.db.contentSchemaRepository.findOne({
      where: { slug },
    });

    if (!schema) {
      throw new NotFoundException(`Schema with slug "${slug}" not found`);
    }

    return schema;
  }
}
