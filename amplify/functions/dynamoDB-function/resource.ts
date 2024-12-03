import { defineFunction } from '@aws-amplify/backend';

export const dynamoDBFunction = defineFunction({
  name: 'dynamoDB-function',
  entry: './handler.ts',
  environment: {
    TABLE_NAME: process.env.TABLE_NAME as string,
  },
});
