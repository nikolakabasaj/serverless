import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CognitoUserPool } from './user-pool/user-pool';
import { InstagramAPI } from './api/api';
import { AppConstants } from '../functions/constants/application';
import { DynamoDB } from './dynamodb/dynamodb';
import { S3Bucket } from './s3/s3-bucket';

export class CdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { userPoolId, userPoolClientId } = new CognitoUserPool(this, id, AppConstants.UserPoolName);

    const postS3Bucket = new S3Bucket(this, id, AppConstants.PostS3BucketName);

    const userDynamoDBTable = new DynamoDB(this, id, AppConstants.UserTableName);
    const followDynamoDBTable = new DynamoDB(this, id, AppConstants.FollowTableName);
    const postDynamoDBTable = new DynamoDB(this, id, AppConstants.PostTableName);
    const commentDynamoDBTable = new DynamoDB(this, id, AppConstants.CommentTableName);
    const dynamoDBTables = {
      userTable: userDynamoDBTable, followTable: followDynamoDBTable, postTable: postDynamoDBTable, commentTable: commentDynamoDBTable,
    };

    new InstagramAPI(this, {
      userPoolId,
      userPoolClientId,
      postS3Bucket,
      dynamoDBTables,
    });
  }
}
