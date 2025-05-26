import { DatabaseService } from '@database/database.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentEntryEntity } from '@database/content-entry/content-entry.entity';
import { CreateEntryDto } from '../dto/create-entry.dto';
import { validateContentValues } from '@management/core/helpers/utils/content-validation.util';
import { UpdateEntryDto } from '../dto/update-entry.dto';
import { ValidateEntryDto } from '../dto/validate-entry.dto';
import { UserEntity } from '@database/user/user.entity';

@Injectable()
export class ContentEntryService {
  constructor(private readonly db: DatabaseService) {}

  // Fetch all entries for a given schema and project
  async getEntriesForSchema(
    projectId: string,
    schemaSlug: string,
  ): Promise<ContentEntryEntity[]> {
    const schema = await this.db.contentSchemaRepository.findOne({
      where: { slug: schemaSlug },
    });
    if (!schema)
      throw new NotFoundException(`Schema "${schemaSlug}" not found`);

    return this.db.contentEntryRepository.find({
      where: {
        project: { id: projectId },
        schema: { id: schema.id },
      },
      relations: ['schema', 'project'],
      order: { id: 'ASC' },
    });
  }

  // Create a new entry, recording the user who created it
  async createEntry(
    projectId: string,
    schemaSlug: string,
    dto: CreateEntryDto,
    user: UserEntity,
  ): Promise<ContentEntryEntity> {
    const schema = await this.db.contentSchemaRepository.findOne({
      where: { slug: schemaSlug },
    });
    if (!schema)
      throw new NotFoundException(`Schema "${schemaSlug}" not found`);

    const project = await this.db.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project)
      throw new NotFoundException(`Project "${projectId}" not found`);

    const existing = await this.db.contentEntryRepository.findOne({
      where: {
        key: dto.key,
        schema: { id: schema.id },
        project: { id: projectId },
      },
    });
    if (existing) {
      throw new ConflictException(`Entry with key "${dto.key}" already exists`);
    }

    const entry = this.db.contentEntryRepository.create({
      key: dto.key,
      schema,
      project,
      createdBy: user,
    });

    return this.db.contentEntryRepository.save(entry);
  }

  // Update entry by creating a new version and validating values
  async updateEntry(entryId: number, dto: UpdateEntryDto, user: UserEntity) {
    const entry = await this.db.contentEntryRepository.findOne({
      where: { id: entryId },
      relations: ['schema'],
    });
    if (!entry) throw new NotFoundException('Entry not found');

    const schema = entry.schema.definition;

    const valueMap: Record<string, Record<string | null, any>> = {};
    for (const v of dto.values) {
      if (!valueMap[v.fieldName]) valueMap[v.fieldName] = {};
      valueMap[v.fieldName][v.locale ?? null] = v.value;
    }

    const flatValues = Object.entries(valueMap).flatMap(([field, locales]) =>
      Object.entries(locales).map(([locale, val]) => ({
        fieldName: field,
        locale: locale === 'null' ? null : locale,
        value: val,
      })),
    );

    const validationErrors = validateContentValues(
      schema,
      Object.fromEntries(flatValues.map((v) => [v.fieldName, v.value])),
    );

    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    const lastVersion = await this.db.contentVersionRepository.findOne({
      where: { entry: { id: entry.id } },
      order: { version: 'DESC' },
    });

    const newVersion = this.db.contentVersionRepository.create({
      entry,
      version: (lastVersion?.version ?? 0) + 1,
      isPublished: false,
    });
    await this.db.contentVersionRepository.save(newVersion);

    for (const value of flatValues) {
      await this.db.contentValueRepository.save({
        version: newVersion,
        fieldName: value.fieldName,
        locale: value.locale,
        value: value.value,
      });
    }

    entry.updatedBy = user;
    await this.db.contentEntryRepository.save(entry);

    return {
      message: 'Entry updated',
      versionId: newVersion.id,
    };
  }

  // List all versions of an entry
  async getVersions(entryId: number) {
    const entry = await this.db.contentEntryRepository.findOne({
      where: { id: entryId },
    });
    if (!entry) throw new NotFoundException('Entry not found');

    return this.db.contentVersionRepository.find({
      where: { entry: { id: entryId } },
      order: { createdAt: 'DESC' },
    });
  }

  // Publish a specific version (only one can be published at a time)
  async publishVersion(versionId: number) {
    const version = await this.db.contentVersionRepository.findOne({
      where: { id: versionId },
      relations: ['entry'],
    });
    if (!version) throw new NotFoundException('Version not found');

    await this.db.contentVersionRepository.update(
      { entry: { id: version.entry.id } },
      { isPublished: false },
    );

    version.isPublished = true;
    version.publishedAt = new Date();

    await this.db.contentVersionRepository.save(version);

    return { message: 'Version published', versionId: version.id };
  }

  // Restore a previous version by copying its values into a new draft
  async restoreVersion(versionId: number) {
    const version = await this.db.contentVersionRepository.findOne({
      where: { id: versionId },
      relations: ['entry'],
    });
    if (!version) throw new NotFoundException('Version not found');

    const values = await this.db.contentValueRepository.find({
      where: { version: { id: version.id } },
    });

    const lastVersion = await this.db.contentVersionRepository.findOne({
      where: { entry: { id: version.entry.id } },
      order: { version: 'DESC' },
    });

    const newVersion = this.db.contentVersionRepository.create({
      entry: version.entry,
      version: (lastVersion?.version ?? 0) + 1,
      isPublished: false,
    });
    await this.db.contentVersionRepository.save(newVersion);

    for (const value of values) {
      await this.db.contentValueRepository.save({
        version: newVersion,
        fieldName: value.fieldName,
        locale: value.locale,
        value: value.value,
      });
    }

    return {
      message: 'Version restored',
      versionId: newVersion.id,
    };
  }

  // Validate content against schema without saving
  async validateEntry(dto: ValidateEntryDto) {
    const schema = dto.schemaDefinition;
    const valuesByField = Object.fromEntries(
      dto.values.map((v) => [v.fieldName, v.value]),
    );

    const errors = validateContentValues(schema, valuesByField);

    return errors.length > 0 ? { valid: false, errors } : { valid: true };
  }

  // Get entry along with latest version and values
  async getEntryWithLatestVersion(entryId: number) {
    const entry = await this.db.contentEntryRepository.findOne({
      where: { id: entryId },
      relations: ['schema', 'project'],
    });
    if (!entry)
      throw new NotFoundException(`Entry with ID ${entryId} not found`);

    const version = await this.db.contentVersionRepository.findOne({
      where: { entry: { id: entry.id } },
      order: { createdAt: 'DESC' },
    });

    const values = version
      ? await this.db.contentValueRepository.find({
          where: { version: { id: version.id } },
        })
      : [];

    return {
      id: entry.id,
      key: entry.key,
      schema: {
        slug: entry.schema.slug,
        definition: entry.schema.definition,
      },
      version: version
        ? {
            id: version.id,
            version: version.version,
            isPublished: version.isPublished,
            createdAt: version.createdAt,
            values: values.map((v) => ({
              fieldName: v.fieldName,
              locale: v.locale,
              value: v.value,
            })),
          }
        : null,
    };
  }

  // Delete entry by ID
  async deleteEntry(entryId: number) {
    const entry = await this.db.contentEntryRepository.findOne({
      where: { id: entryId },
    });

    if (!entry) {
      throw new NotFoundException(`Entry with ID ${entryId} not found`);
    }

    await this.db.contentEntryRepository.remove(entry);

    return { message: 'Entry deleted', entryId };
  }
}
