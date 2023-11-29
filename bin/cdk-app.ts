#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkAppStack } from '../lib/cdk-app-stack';
import { AppConstants } from '../functions/constants/application';

const app = new cdk.App();
new CdkAppStack(app, AppConstants.StackName, {

  stackName: AppConstants.StackName,

  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
