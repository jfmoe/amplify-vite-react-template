import { defineFunction } from '@aws-amplify/backend';

export const refreshApiKey = defineFunction({
  name: 'refresh-api-key',
  schedule: 'every 1day',
  entry: './handler.ts',
});
