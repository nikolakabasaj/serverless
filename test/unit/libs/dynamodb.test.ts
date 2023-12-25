import {DynamoDB} from '../../../lib/dynamodb/dynamodb';
import {expect as expectCDK, haveResourceLike} from '@aws-cdk/assert';
import * as cdk from 'aws-cdk-lib';
import {App, Stack, Token} from 'aws-cdk-lib';
import {CdkAppStack} from '../../../lib/cdk-app-stack';
import {AppConstants} from '../../../functions/constants/application';

test('DynamoDB Construct', () => {
  // Create a new stack
  const app = new App();
  const stack = new Stack(app, 'TestStack');

  // Create an instance of your DynamoDB construct
  const dynamoDB = new DynamoDB(stack, 'TestStack', 'DynamoDBTable');

  // Validate that the table has the correct configuration
  expectCDK(stack).to(
    haveResourceLike('AWS::DynamoDB::Table', {
      // Add your resource properties here
      TableName: dynamoDB.getTableName(),
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    })
  );
});
