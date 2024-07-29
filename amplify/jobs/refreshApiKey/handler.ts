import { AppSyncClient, UpdateApiKeyCommand } from '@aws-sdk/client-appsync';
import { env } from '$amplify/env/refresh-api-key';

const oneYearFromNow = new Date();
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

export const handler = async () => {
  const region = process.env.AWS_REGION;
  const apiId = env.apiId;
  const apiKey = env.apiKey;

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

    console.log('Refresh apiKey params', { input, region });

    const command = new UpdateApiKeyCommand(input);
    const response = await client.send(command);

    console.log('Refresh apikey success', response);
  } catch (error) {
    console.error('Refresh apikey error', error);
  }
};
