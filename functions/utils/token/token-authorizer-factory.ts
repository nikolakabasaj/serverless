import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {  TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { Duration } from 'aws-cdk-lib';
import { AuthorizationType } from 'aws-cdk-lib/aws-apigateway';

const tokenAuthorizerEntry = './functions/auth/authorizer.ts';

export function createLambdaIntegrationOptions(tokenAuthorizer: TokenAuthorizer) {
	return {
		authorizer: tokenAuthorizer,
		authorizationType: AuthorizationType.CUSTOM,
	}
}

export function createTokenAuthorizer(api: any, fnProps: any) {
	const authorizerFn = new NodejsFunction(api, 'AuthorizerFn', {
		...fnProps,
		entry: tokenAuthorizerEntry,
	});

	return new TokenAuthorizer(api, 'TokenAuthorizer', {
		handler: authorizerFn,
		resultsCacheTtl: Duration.minutes(0),
	});
}

