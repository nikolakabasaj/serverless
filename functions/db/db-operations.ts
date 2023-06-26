import * as AWS from 'aws-sdk';


const db = new AWS.DynamoDB.DocumentClient();

export async function add(tableName: string, 
                          item: any={}) : Promise <any> {
  const params = {
      TableName: tableName,
      Item: item
  };

  return await db.put(params).promise();
}

export async function deleteById(tableName: string, id: string) : Promise<any> {
  const params = {
    TableName: tableName,
    Key: {
      'id':  id
    }
  };

  const response = await db.delete(params).promise();
  return response;
}

export async function getAll(tableName: string) : Promise <any> {
  const params = {
    TableName: tableName
  };

  const response = await db.scan(params).promise();
  return response.Items;
}

export async function getById(tableName: string, id: string) : Promise <any> {
  const params = {
    TableName: tableName,
    Key: {
      'id':  id
    }
  };

  const response = await db.get(params).promise();
  return response.Item;
}


export async function getByMultipleFields(tableName: string, indexName: string, filterValues: any) : Promise <any> {
  const filterExpression = Object.keys(filterValues)
  .map((key) => `${key} = :${key}`)
  .join(' AND ');

  const keyConditionExpression = Object.entries(filterValues).reduce(
  (values, [key, value]) => ({ ...values, [`:${key}`]: value }),
  {});

  
  const params = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: filterExpression,
    ExpressionAttributeValues: keyConditionExpression,
  };

  const response = await db.query(params).promise();
  return response.Items;
}

export async function getAllByIds(tableName: string, ids: string[]) : Promise <any> {
  return await getAllByParamsArray(tableName, 'id', ids);
}

export async function getAllByParamsArray(tableName: string, key: string, values: string[]) : Promise <any> {
  const params: AWS.DynamoDB.DocumentClient.BatchGetItemInput = {
    RequestItems: {
      [tableName]: {
        Keys: values.map(value => ({ [key]: value }))
      }
    }
  };
  
  const response = await db.batchGet(params).promise();
  return response.Responses ? response.Responses[tableName] : []
}

