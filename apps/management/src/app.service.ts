import { ContentSchemaEntity } from '@database/content-schema/content-schema.entity';
import { DatabaseService } from '@database/database.service';
import { Injectable } from '@nestjs/common';
import { PetCMSModule } from 'libs/cmsmodules/src/modules/blog copy/pet.cms';
import { BlogCMSModule } from 'libs/cmsmodules/src/modules/blog/blog.cms';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';
import { HomepageCMSModule } from 'libs/cmsmodules/src/modules/homepage/homepage.cms';
import { Test2Module } from 'libs/cmsmodules/src/modules/test2/test2';
import { WipMSModule } from 'libs/cmsmodules/src/modules/wip/wip.cms';

@Injectable()
export class AppService {
  private modules = [
    BlogCMSModule,
    HomepageCMSModule,
    WipMSModule,
    Test2Module,
    PetCMSModule,
  ];

  constructor(private databaseService: DatabaseService) {}

  async initCMSModules(): Promise<void> {
    const uniqueModules: CmsModule[] = [];

    for (const mod of this.modules) {
      this.initModule(mod, uniqueModules);
    }

    const entries: { [key: string]: ContentSchemaEntity } = {};

    for (const module of uniqueModules) {
      const exists = await this.databaseService.contentSchemaRepository.findOne(
        {
          where: { slug: module.slug },
        },
      );

      if (!exists) {
        entries[module.slug] =
          await this.databaseService.contentSchemaRepository.save({
            name: module.name,
            slug: module.slug,
            renderer: module.renderer,
            definition: module.schema,
          });
        console.log(`Module "${module.slug}" registered.`);
      } else {
        entries[module.slug] = exists;
        this.databaseService.contentSchemaRepository.update(
          { id: exists.id },
          {
            name: module.name,
            slug: module.slug,
            renderer: module.renderer,
            definition: module.schema,
          },
        );
        console.log(`Module "${module.slug}" already exists, updated.`);
      }
    }

    for (const module of uniqueModules) {
      if (module.extensions) {
        const entry = entries[module.slug];
        const extensions = module.extensions
          .map((ext) => entries[ext.slug])
          .filter((e): e is ContentSchemaEntity => !!e);

        if (extensions.length > 0) {
          entry.extensions = extensions;
          await this.databaseService.contentSchemaRepository.save(entry);

          console.log(
            `Updated ${entry.name} with extensions: ${extensions
              .map((e) => e.slug)
              .join(', ')}`,
          );
        }
      }
    }
  }

  private initModule(module: CmsModule, uniqueModules: CmsModule[]): void {
    const isIncluded = uniqueModules.some((m) => m.slug === module.slug);
    if (!isIncluded) {
      uniqueModules.push(module);
    }

    if (module.extensions) {
      for (const ext of Object.values(module.extensions)) {
        this.initModule(ext, uniqueModules);
      }
    }
  }
}
