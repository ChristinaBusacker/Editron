import { MigrationPatch } from '../../../declarations/interfaces/migration-patch.interfaces';

export function MigrationPatch(value: MigrationPatch) {
  return function <T extends { new (...args: any[]): object }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        (this as any).name = value.name;
        (this as any).values = value.values;
        (this as any).forceUpgrade = value.forceUpgrade;
      }
    };
  };
}
