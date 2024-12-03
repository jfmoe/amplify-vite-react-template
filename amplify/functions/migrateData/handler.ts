/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Schema } from '../../data/resource';
import { DynamoDBClient, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});

export const handler: Schema['migrateData']['functionHandler'] = async event => {
  try {
    const { sourceTable, targetTable } = event.arguments;

    console.log(`Migrating data from ${sourceTable} to ${targetTable}`);

    if (!sourceTable || !targetTable || sourceTable === targetTable) return false;

    const allItems = await getAllItemsFromSourceTable(sourceTable);

    const batchSize = 25;
    let count = 1;
    const chunks = chunk(allItems, batchSize);

    for (const chunk of chunks) {
      console.log('creating tasks for chunk:', count);
      await Promise.all(updateItemsInTargetTable(chunk, targetTable));
      console.log(`Processed chunk ${count++} of ${chunks.length}，`);
    }
    return true;
  } catch (error) {
    console.error('migration error =>', error);
    return false;
  }
};

function chunk(array: any[], size: number) {
  const chunked_arr = [];
  for (let i = 0; i < array.length; i += size) {
    chunked_arr.push(array.slice(i, i + size));
  }
  return chunked_arr;
}

async function getAllItemsFromSourceTable(sourceTable: string) {
  const input = {
    TableName: sourceTable,
  };
  const command = new ScanCommand(input);

  let nextScan = await client.send(command);
  console.log('scan response:', nextScan);
  let items = [...(nextScan.Items || [])];

  while (nextScan.LastEvaluatedKey) {
    const input = {
      TableName: sourceTable,
      ExclusiveStartKey: nextScan.LastEvaluatedKey,
    };
    nextScan = await client.send(new ScanCommand(input));
    items = items.concat(nextScan.Items || []);
  }
  console.log('items count =>', items.length);
  return items;
}

async function createPutPromise(item: any, targetTable: string) {
  const input = {
    Item: item,
    TableName: targetTable,
  };

  const command = new PutItemCommand(input);
  return client.send(command);
}

function updateItemsInTargetTable(items: any[], targetTable: string) {
  return items.map(item => createPutPromise(item, targetTable));
}
