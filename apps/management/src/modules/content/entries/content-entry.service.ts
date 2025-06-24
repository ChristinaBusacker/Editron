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
import { ContentValueEntity } from '@database/content-value/content-value.entity';
import { In } from 'typeorm';

@Injectable()
export class ContentEntryService {
  constructor(private readonly db: DatabaseService) {}

  // Fetch all entries for a given schema and project
  async getEntriesForSchema(
    projectId: string,
    schemaSlug: string,
  ): Promise<
    {
      entryId: string;
      versionId: string;
      versionNumber: number;
      createdAt: Date;
      isPublished: boolean;
      content: any;
    }[]
  > {
    const schema = await this.db.contentSchemaRepository.findOne({
      where: { slug: schemaSlug },
    });
    if (!schema)
      throw new NotFoundException(`Schema "${schemaSlug}" not found`);

    const entries = await this.db.contentEntryRepository.find({
      where: {
        project: { id: projectId },
        schema: { id: schema.id },
      },
      order: { id: 'ASC' },
    });

    const result = [];

    for (const entry of entries) {
      const version = await this.db.contentVersionRepository.findOne({
        where: { entry: { id: entry.id } },
        order: { createdAt: 'DESC' },
        relations: ['createdBy'],
      });

      if (!version) continue;

      const value = await this.db.contentValueRepository.findOne({
        where: { version: { id: version.id } },
      });

      result.push({
        id: entry.id,
        versionId: version.id,
        versionNumber: version.version,
        updatedAt: version.createdAt,
        updatedBy: version.createdBy,
        isPublished: version.isPublished,
        content: value?.value ?? {},
      });
    }

    return result;
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

    const validationErrors = validateContentValues(schema.definition, dto.data);
    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    const entry = this.db.contentEntryRepository.create({
      schema,
      project,
      createdBy: user,
    });
    await this.db.contentEntryRepository.save(entry);

    const version = this.db.contentVersionRepository.create({
      entry,
      version: 1,
      isPublished: false,
      createdBy: user,
    });
    await this.db.contentVersionRepository.save(version);

    await this.db.contentValueRepository.save({
      version,
      value: dto.data,
    });

    return entry;
  }

  // Duplicate an existing entry using the latest version as a base
  async duplicateEntry(
    entryId: string,
    user: UserEntity,
  ): Promise<ContentEntryEntity> {
    const originalEntry = await this.db.contentEntryRepository.findOne({
      where: { id: entryId },
      relations: ['schema', 'project'],
    });
    if (!originalEntry) {
      throw new NotFoundException(`Entry with ID ${entryId} not found`);
    }

    const latestVersion = await this.db.contentVersionRepository.findOne({
      where: { entry: { id: entryId } },
      order: { createdAt: 'DESC' },
    });
    if (!latestVersion) {
      throw new NotFoundException(`No version found for entry ${entryId}`);
    }

    const value = await this.db.contentValueRepository.findOne({
      where: { version: { id: latestVersion.id } },
    });

    const dto: CreateEntryDto = {
      data: value?.value ?? {},
    };

    return this.createEntry(
      originalEntry.project.id,
      originalEntry.schema.slug,
      dto,
      user,
    );
  }

  // Update entry by creating a new version and validating values
  async updateEntry(entryId: string, dto: UpdateEntryDto, user: UserEntity) {
    const entry = await this.db.contentEntryRepository.findOne({
      where: { id: entryId },
      relations: ['schema'],
    });
    if (!entry) throw new NotFoundException('Entry not found');

    const schema = entry.schema.definition;

    // Validate the submitted data against the schema definition
    const validationErrors = validateContentValues(schema, dto.data);
    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Retrieve the most recent version to determine the next version number
    const lastVersion = await this.db.contentVersionRepository.findOne({
      where: { entry: { id: entry.id } },
      order: { version: 'DESC' },
    });

    // Create a new version
    const newVersion = this.db.contentVersionRepository.create({
      entry,
      version: (lastVersion?.version ?? 0) + 1,
      isPublished: false,
      createdBy: user,
      createdAt: new Date(),
    });
    await this.db.contentVersionRepository.save(newVersion);

    // Store the entire JSON blob as a single value
    await this.db.contentValueRepository.save({
      version: newVersion,
      value: dto.data,
    });

    return {
      message: 'Entry updated',
      versionId: newVersion.id,
    };
  }

  // List all versions of an entry
  async getVersions(entryId: string) {
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
  async publishVersion(versionId: string) {
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
  async restoreVersion(versionId: string) {
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

    await this.db.contentValueRepository.save({
      version,
      value: values,
    });

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
  async getEntryWithLatestVersion(entryId: string) {
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

    const value = await this.db.contentValueRepository.findOne({
      where: { version: { id: version.id } },
    });

    return {
      id: entry.id,
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
            values: value?.value ?? {}, // <- direkt der Blob
          }
        : null,
    };
  }

  async getEntryDetails(entryId: string) {
    const entry = await this.db.contentEntryRepository.findOne({
      where: { id: entryId },
      relations: ['schema', 'project'],
    });

    if (!entry) {
      throw new NotFoundException(`Entry with ID ${entryId} not found`);
    }

    const versions = await this.db.contentVersionRepository.find({
      where: { entry: { id: entryId } },
      order: { createdAt: 'DESC' },
      relations: ['createdBy'],
    });

    if (!versions.length) {
      return {
        entryId,
        value: null,
        versions: [],
      };
    }

    const allValues = await this.db.contentValueRepository.find({
      where: {
        version: {
          id: In(versions.map((v) => v.id)),
        },
      },
      relations: ['version'],
    });

    const valueMap = new Map<string, any>();
    allValues.forEach((val) => {
      valueMap.set(val.version.id, val.value);
    });

    const publishedVersion = versions.find((v) => v.isPublished);
    const fallbackVersion = versions[0];
    const mainVersion = publishedVersion || fallbackVersion;
    const mainValue = valueMap.get(mainVersion.id) ?? {};

    return {
      id: entry.id,
      value: mainValue,
      versions: versions.map((v) => ({
        id: v.id,
        version: v.version,
        isPublished: v.isPublished,
        createdAt: v.createdAt,
        createdBy: v.createdBy
          ? {
              id: v.createdBy.id,
              name: v.createdBy.name,
            }
          : null,
        value: valueMap.get(v.id) ?? {},
      })),
    };
  }

  // Delete entry by ID
  async deleteEntry(entryId: string) {
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
