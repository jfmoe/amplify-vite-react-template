import { defineFunction, secret } from '@aws-amplify/backend';

export const refreshApiKey = defineFunction({
  name: 'refresh-api-key',
  schedule: 'every 5m',
  entry: './handler.ts',
  environment: {
    apiKey: secret('apiKey'),
    apiId: secret('apiId'),
  },
});
