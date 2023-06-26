import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AppConstants } from '../../functions/constants/application';
import { off } from 'process';
import { Kendra } from 'aws-sdk';

export class DynamoDB extends Construct {
    public readonly dynamoDbTable: dynamodb.Table;

    constructor(scope: Construct, stackId: string, name: string) {
        const constructName = `${stackId}-${name}`;
        super(scope, constructName)
        this.dynamoDbTable = new dynamodb.Table(this, constructName, {
            partitionKey: {name: AppConstants.TablePrimaryKeyName, type: dynamodb.AttributeType.STRING},
            readCapacity: 1,
            writeCapacity: 1,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            tableName: constructName
        });

    }

    public getTableName() {
        return this.dynamoDbTable.tableName;
    }

    public grantWriteData(fn: any) {
        this.dynamoDbTable.grantWriteData(fn);
    }

    public grantReadWriteData(fn: any) {
        this.dynamoDbTable.grantReadWriteData(fn);
    }

    public grantReadData(fn: any) {
        this.dynamoDbTable.grantReadData(fn);
    }


    public addGlobalSecondaryIndex(indexName: string, keys: string[]) {
        const secondaryIndex = this.getSecondaryIndex(indexName, keys)
        this.dynamoDbTable.addGlobalSecondaryIndex(secondaryIndex);
    }

    private getSecondaryIndex(indexName: string, keys: string[]) {
        if(keys.length === 1) {
            return this.getSecondaryIndexWithPartiotionKey(indexName, keys[0]);
        }
        return this.getSecondaryIndexWithPartiotionAndSortKey(indexName, keys[0], keys[1]);
    }

    private getSecondaryIndexWithPartiotionKey(indexName: string, partitionKey: string) {
        return {
            indexName: indexName,
            partitionKey: { name: partitionKey, type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
          }
    }

    private getSecondaryIndexWithPartiotionAndSortKey(indexName: string, partitionKey: string, sortKey: string) {
        return {
            indexName: indexName,
            partitionKey: { name: partitionKey, type: dynamodb.AttributeType.STRING },
            sortKey: { name: sortKey, type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
          }
    }
}