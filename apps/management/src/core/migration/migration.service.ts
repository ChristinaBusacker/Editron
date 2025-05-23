import { DatabaseService } from '@database/database.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as cliProgress from 'cli-progress';
import { MigrationPatch } from '../../declarations/interfaces/migration-patch.interfaces';
import { InitialPatch } from './patches/initial.patch';
import { LoginPatch } from './patches/login.patch';
import { DefaultPatch } from './patches/default.patch';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class MigrationService implements OnModuleInit {
  private migrationPatches = [InitialPatch, LoginPatch, DefaultPatch];

  constructor(private databaseService: DatabaseService) {}

  async migrate() {
    try {
      const migrationEntries =
        await this.databaseService.migrationRepository.find();
      const doneMigrations = migrationEntries.map(
        (migration) => migration.name,
      );

      for (const patchEntry of this.migrationPatches) {
        const patch = new patchEntry() as MigrationPatch;

        if (!doneMigrations.includes(patch.name) || patch.forceUpgrade) {
          Logger.log(`Processing migration with name ${patch.name}`);

          if (patch.values.localizations) {
            await this.migrateLocalizations(patch);
          }

          if (patch.values.users) {
            await this.migrateUsers(patch);
          }

          await this.databaseService.migrationRepository.save({
            name: patch.name,
          });
        }
      }
      Logger.log('Migrations done successfully');
    } catch (error) {
      Logger.error('Migration failed', error);
    }
  }

  async migrateUsers(patch: MigrationPatch) {
    const progressBar = new cliProgress.SingleBar(
      {
        format: 'Progress |{bar}| {percentage}% || {value}/{total} Users',
      },
      cliProgress.Presets.shades_classic,
    );

    try {
      progressBar.start(patch.values.users.length, 0);

      for (let index = 0; index < patch.values.users.length; index++) {
        const user = patch.values.users[index];
        user.password = await bcrypt.hash(user.password, 10);
        await this.databaseService.userRepository.save(user);
        progressBar.update(index + 1);
      }
    } catch (error) {
      Logger.error('Error migrating users', error);
    } finally {
      progressBar.stop();
    }
  }

  async migrateLocalizations(patch: MigrationPatch) {
    const progressBar = new cliProgress.SingleBar(
      {
        format:
          'Progress |{bar}| {percentage}% || {value}/{total} Localizations',
      },
      cliProgress.Presets.shades_classic,
    );

    try {
      progressBar.start(patch.values.localizations.length, 0);

      for (let index = 0; index < patch.values.localizations.length; index++) {
        const localization = patch.values.localizations[index];
        await this.databaseService.localizationRepository.save(localization);
        progressBar.update(index + 1);
      }
    } catch (error) {
      Logger.error('Error migrating localizations', error);
    } finally {
      progressBar.stop();
    }
  }

  public onModuleInit() {
    setTimeout(() => {
      this.migrate();
    }, 2000);
  }
}
