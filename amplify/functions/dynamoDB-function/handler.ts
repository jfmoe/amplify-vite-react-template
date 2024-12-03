import type { DynamoDBStreamHandler } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { Logger } from '@aws-lambda-powertools/logger';
import { env } from '$amplify/env/dynamoDB-function';
import dayjs from 'dayjs';

const logger = new Logger({
  logLevel: 'INFO',
  serviceName: 'dynamodb-stream-handler',
});

const dynamoDBClient = new DynamoDBClient({});

export const handler: DynamoDBStreamHandler = async event => {
  for (const record of event.Records) {
    logger.info(`Processing record: ${record}`);

    if (record.eventName === 'INSERT') {
      const newImage = record.dynamodb?.NewImage;
      logger.info(`New Image: ${JSON.stringify(newImage)}`);

      // 插入 expiredAt 字段，使得数据在一段时间后过期
      const input = {
        TableName: env.TABLE_NAME,
        Key: {
          id: { S: newImage?.id.S as string },
        },
        UpdateExpression: 'SET #expiredAt = :expiredAt',
        ExpressionAttributeNames: {
          '#expiredAt': 'expiredAt',
        },
        ExpressionAttributeValues: {
          ':expiredAt': {
            N: dayjs((newImage?.createdAt as number) ?? dayjs())
              .add(1, 'minute')
              .unix(),
          },
        },
      };

      try {
        // @ts-expect-error input
        const command = new UpdateItemCommand(input);
        const response = await dynamoDBClient.send(command);
        logger.info(`Item updated successfully: ${JSON.stringify(response)}`);
      } catch (error) {
        logger.error('Error updating item:', error as Error);
        return {
          batchItemFailures: [{ itemIdentifier: record.dynamodb?.SequenceNumber ?? 'unknown' }],
        };
      }
    }
  }
  logger.info(`Successfully processed ${event.Records.length} records.`);

  return {
    batchItemFailures: [],
  };
};
