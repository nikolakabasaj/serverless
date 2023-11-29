import { Aws } from 'aws-cdk-lib';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { APIGatewayAuthorizerEvent, PolicyDocument } from 'aws-lambda';

export type Policy = { principalId: string; email: string } | null;

export const createPolicy = (event: APIGatewayAuthorizerEvent, effect: string): PolicyDocument => ({
  Version: '2012-10-17',
  Statement: [
    {
      Effect: effect,
      Action: 'execute-api:Invoke',
      Resource: [event.methodArn],
    },
  ],
});

export function createPolicyStatement(userPoolId: string, actions: string) {
  return new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [actions],
    resources: [`arn:aws:cognito-idp:${Aws.REGION}:${Aws.ACCOUNT_ID}:userpool/${userPoolId}`],
  });
}
