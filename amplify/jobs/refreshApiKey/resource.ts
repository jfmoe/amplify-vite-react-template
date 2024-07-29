import { defineFunction } from '@aws-amplify/backend-function';

export const refreshApiKey = defineFunction({
  name: 'refresh-api-key',
  schedule: 'every 5m',
  entry: './handler.ts',
});
