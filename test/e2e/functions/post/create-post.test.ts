// create-post.e2e.test.ts

import {handler} from '../../../../functions/post/create-post';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import * as AWS from 'aws-sdk';

// Initialize the DynamoDB client
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const POST_CONTENT = 'base64encodedimage...';
const POST_DESCRIPTION = 'test';

describe('create-post handler (End-to-End Test)', () => {
  it('should handle the creation of a post', async () => {
    // Arrange - Mock the event object
    const event = {
      body: JSON.stringify({
        content: POST_CONTENT,
        description: POST_DESCRIPTION,
      }),
    };

    // Act - Call the handler
    const result = await handler(event);

    // Assertions
    expect(result.statusCode).toBe(200);

    const dynamoDbParams: DocumentClient.GetItemInput = {
      TableName: process.env.POST_TABLE_NAME!,
      Key: {
        // Use the appropriate key structure based on your data model
      },
    };

    const dynamoDbResult = await dynamoDb.get(dynamoDbParams).promise();
    const createdPost = dynamoDbResult.Item;
    expect(createdPost).toBeDefined();
  });
});
