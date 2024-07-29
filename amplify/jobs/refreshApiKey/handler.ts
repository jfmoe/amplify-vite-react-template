import { AppSyncClient, UpdateApiKeyCommand } from '@aws-sdk/client-appsync';

const region = process.env.AWS_REGION;
const apiId = 'kb23q4cnwrejndxxfzldlryt2e';
const apiKey = 'da2-eoxuusx3sbcqfailgk43mgfioe';

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

    console.log('Refresh apiKey params', { input, region });

    const command = new UpdateApiKeyCommand(input);
    const response = await client.send(command);

    console.log('Refresh apikey success', response);
  } catch (error) {
    console.error('Refresh apikey error', error);
  }
};
