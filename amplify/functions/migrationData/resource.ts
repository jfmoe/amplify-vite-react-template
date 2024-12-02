import { defineFunction } from '@aws-amplify/backend';

export const migrationData = defineFunction({
  name: 'migration-data',
  entry: './handler.ts',
});
