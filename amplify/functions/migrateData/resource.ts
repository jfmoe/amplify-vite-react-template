import { defineFunction } from '@aws-amplify/backend';

export const migrateData = defineFunction({
  name: 'migration-data',
  entry: './handler.ts',
});
