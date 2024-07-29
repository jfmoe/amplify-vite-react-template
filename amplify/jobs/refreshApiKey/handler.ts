import { AppSyncClient, UpdateApiKeyCommand } from '@aws-sdk/client-appsync';
import { secret } from '@aws-amplify/backend';

const region = process.env.REGION;
const apiId = process.env.API_ID;
const apiKey = secret('API_KEY') as unknown as string;

const oneYearFromNow = new Date();
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

export const handler = async () => {
  try {
    const client = new AppSyncClient({
      region,
    });

    const input = {
      apiId,
      id: apiKey,
      description: 'Refresh apikey',
      expires: oneYearFromNow.getTime() / 1000, // 单位是秒
    };

    const command = new UpdateApiKeyCommand(input);
    const response = await client.send(command);

    console.log('Refresh apikey error', response);
  } catch (error) {
    console.error('Refresh apikey error', error);
  }
};
