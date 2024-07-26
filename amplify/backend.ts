import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { refreshApiKey } from './jobs/refreshApiKey/resource';

const backend = defineBackend({
  auth,
  data,
  refreshApiKey,
});

backend.auth.resources.unauthenticatedUserIamRole.addToPrincipalPolicy(
  new PolicyStatement({
    actions: ['appsync:UpdateApiKey'],
    resources: ['*'],
  }),
);
