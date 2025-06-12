import { DatabaseService } from '@database/database.service';
import { Injectable } from '@nestjs/common';
import { BlogCMSModule } from 'libs/cmsmodules/src/modules/blog/blog.cms';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';
import { HomepageCMSModule } from 'libs/cmsmodules/src/modules/homepage/homepage.cms';
import { WipMSModule } from 'libs/cmsmodules/src/modules/wip/wip.cms';

@Injectable()
export class AppService {
  private modules = [BlogCMSModule, HomepageCMSModule, WipMSModule];

  constructor(private databaseService: DatabaseService) {}

  async initCMSModules(): Promise<void> {
    const uniqueModules: CmsModule[] = [];

    for (const mod of this.modules) {
      this.initModule(mod, uniqueModules);
    }

    for (const module of uniqueModules) {
      const exists = await this.databaseService.contentSchemaRepository.findOne(
        {
          where: { slug: module.slug },
        },
      );

      if (!exists) {
        await this.databaseService.contentSchemaRepository.save({
          name: module.name,
          slug: module.slug,
          renderer: module.renderer,
          definition: module.schema,
        });
        console.log(`Module "${module.slug}" registered.`);
      } else {
        this.databaseService.contentSchemaRepository.update(exists, {
          name: module.name,
          slug: module.slug,
          renderer: module.renderer,
          definition: module.schema,
        });
        console.log(`Module "${module.slug}" already exists, updated.`);
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
