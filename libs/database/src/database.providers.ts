import { AppDataSource } from './database.source';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useValue: AppDataSource,
  },
];
