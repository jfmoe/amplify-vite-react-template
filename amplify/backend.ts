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

// 赋予 Lambda 函数更新 API Key 的权限
const refreshApiKeyLambda = backend.refreshApiKey.resources.lambda;
refreshApiKeyLambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['appsync:UpdateApiKey'],
    resources: ['*'],
  }),
);

const { cfnResources } = backend.data.resources;

// 容灾处理：为所有 table 开启时间点恢复功能
for (const table of Object.values(cfnResources.amplifyDynamoDbTables)) {
  table.pointInTimeRecoveryEnabled = true;
}

// 根据表中设定的 TTL 属性，为表开启 TTL 功能（如果当前时间超过设定的 Unix timestamp，则该条数据过期）
cfnResources.amplifyDynamoDbTables['Todo'].timeToLiveAttribute = {
  attributeName: '_ttl',
  enabled: true,
};
