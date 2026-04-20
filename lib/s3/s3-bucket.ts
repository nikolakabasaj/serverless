import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class S3Bucket extends Construct {
  public readonly s3Bucket: s3.Bucket;

  constructor(scope: Construct, stackId: string, name: string) {
    const constructName = `${stackId}-${name}`;
    super(scope, constructName);
    this.s3Bucket = new s3.Bucket(this, constructName, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }

  public getBucketName() {
    return this.s3Bucket.bucketName;
  }

  public grantWriteData(fn: any) {
    this.s3Bucket.grantWrite(fn);
  }

  public grantReadWriteData(fn: any) {
    this.s3Bucket.grantReadWrite(fn);
  }

  public grantReadData(fn: any) {
    this.s3Bucket.grantRead(fn);
  }
}
