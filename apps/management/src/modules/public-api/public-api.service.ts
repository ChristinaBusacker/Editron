import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { ApiTokenEntity } from '@database/api-token/api-token.entity';
import { ContentSchemaEntity } from '@database/content-schema/content-schema.entity';
import { ContentEntryEntity } from '@database/content-entry/content-entry.entity';
import {
  localizeAndFlatten,
  isLocaleMap,
  pickFromLocaleMap,
} from '@shared/utils/i18n.util';

/**
 * Public reading operations for published content.
 * All queries are implicitly scoped to the token's project.
 */
@Injectable()
export class PublicApiService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Resolve schema by slug or throw 404.
   */
  private async getSchemaOr404(
    moduleSlug: string,
  ): Promise<ContentSchemaEntity> {
    const schema = await this.db.contentSchemaRepository.findOne({
      where: { slug: moduleSlug },
    });
    if (!schema) {
      throw new NotFoundException(`Schema "${moduleSlug}" not found`);
    }
    return schema;
  }

  /**
   * Resolve the latest published version (if any) and its value payload for an entry.
   * Returns { value, versionId } or null when no published version exists.
   */
  private async getPublishedValueForEntry(
    entryId: string,
  ): Promise<{ value: any; versionId: string } | null> {
    const published = await this.db.contentVersionRepository.findOne({
      where: { entry: { id: entryId }, isPublished: true },
      order: { createdAt: 'DESC' },
    });
    if (!published) return null;

    const contentValue = await this.db.contentValueRepository.findOne({
      where: { version: { id: published.id } },
    });

    return { value: contentValue?.value ?? {}, versionId: published.id };
  }

  /**
   * List all entries for a module that have a published version.
   * Scoped to the token's project. Returns flattened, localized objects.
   */
  async listPublishedByModule(
    moduleSlug: string,
    token: ApiTokenEntity,
    lang?: string | null,
    fallbackLang?: string | null,
  ): Promise<Array<Record<string, any>>> {
    const schema = await this.getSchemaOr404(moduleSlug);

    const projectId = token.project?.id ?? (token as any).projectId;
    if (!projectId) {
      throw new BadRequestException('API key is not associated with a project');
    }

    const entries = await this.db.contentEntryRepository.find({
      where: {
        schema: { id: schema.id },
        project: { id: projectId },
        inBin: false,
      },
      order: { id: 'ASC' },
    });

    const result: Array<Record<string, any>> = [];
    for (const entry of entries) {
      const published = await this.getPublishedValueForEntry(entry.id);
      if (!published) continue;

      const flattened = localizeAndFlatten(published.value, lang, fallbackLang);
      result.push({ id: entry.id, ...flattened });
    }
    return result;
  }

  /**
   * Get a single published entry by field/value pair (e.g., id or slug).
   * Matching respects language -> fallback. Returns flattened, localized object.
   */
  async getPublishedByField(
    moduleSlug: string,
    fieldName: string,
    fieldValue: string,
    token: ApiTokenEntity,
    lang?: string | null,
    fallbackLang?: string | null,
  ): Promise<Record<string, any>> {
    const schema = await this.getSchemaOr404(moduleSlug);

    if (!fieldName?.trim()) {
      throw new BadRequestException('fieldName must not be empty');
    }

    const projectId = token.project?.id ?? (token as any).projectId;
    if (!projectId) {
      throw new BadRequestException('API key is not associated with a project');
    }

    // Special-case: direct ID lookup => no scan
    if (fieldName === 'id') {
      const entry = await this.db.contentEntryRepository.findOne({
        where: {
          id: fieldValue,
          schema: { id: schema.id },
          project: { id: projectId },
          inBin: false,
        },
      });
      if (!entry) {
        throw new NotFoundException(
          `Entry with id "${fieldValue}" not found in module "${moduleSlug}"`,
        );
      }
      const published = await this.getPublishedValueForEntry(entry.id);
      if (!published) {
        throw new NotFoundException(
          `Entry "${fieldValue}" has no published version`,
        );
      }
      const flattened = localizeAndFlatten(published.value, lang, fallbackLang);
      return { id: entry.id, ...flattened };
    }

    // Generic: scan entries of the module & project and match on published value[fieldName]
    const entries = await this.db.contentEntryRepository.find({
      where: {
        schema: { id: schema.id },
        project: { id: projectId },
        inBin: false,
      },
      order: { id: 'ASC' },
    });

    for (const entry of entries) {
      const published = await this.getPublishedValueForEntry(entry.id);
      if (!published) continue;

      const rawField = (published.value ?? {})[fieldName];

      if (rawField == null) {
        // nothing to compare
      } else if (isLocaleMap(rawField)) {
        const candidate = pickFromLocaleMap(rawField, lang, fallbackLang);
        if (candidate != null && String(candidate) === String(fieldValue)) {
          const flattened = localizeAndFlatten(
            published.value,
            lang,
            fallbackLang,
          );
          return { id: entry.id, ...flattened };
        }
      } else {
        if (String(rawField) === String(fieldValue)) {
          const flattened = localizeAndFlatten(
            published.value,
            lang,
            fallbackLang,
          );
          return { id: entry.id, ...flattened };
        }
      }
    }

    throw new NotFoundException(
      `No published entry in "${moduleSlug}" where ${fieldName} == "${fieldValue}" (scoped to project)`,
    );
  }
}
