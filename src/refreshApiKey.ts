import { useEffect } from 'react';
import { AppSyncClient, UpdateApiKeyCommand } from '@aws-sdk/client-appsync';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { Amplify } from 'aws-amplify';

const oneYearFromNow = new Date();
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

const useApiKeyRefresh = () => {
  const config = Amplify.getConfig();
  const region = config.API?.GraphQL?.region;
  const identityPoolId = config.Auth?.Cognito.identityPoolId ?? '';
  const apiKey = config.API?.GraphQL?.apiKey;
  const apiId = 'yftopeau2bbx3jxpcnckecisc4';

  const refresh = async () => {
    try {
      const client = new AppSyncClient({
        region,
        credentials: fromCognitoIdentityPool({
          client: new CognitoIdentityClient({ region }),
          identityPoolId,
        }),
      });
      const input = {
        apiId,
        id: apiKey,
        description: 'Refresh apikey',
        expires: oneYearFromNow.getTime() / 1000, // 单位是秒
      };
      const command = new UpdateApiKeyCommand(input);
      const response = await client.send(command);

      console.log('Refresh apikey success!', response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    refresh();
  }, []);
};

export default useApiKeyRefresh;
