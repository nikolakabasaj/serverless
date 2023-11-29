import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { createPolicy } from '../utils/policy-factory';
import { decodeToken } from '../utils/token/jwt-token-decoder';

exports.handler = async (event: APIGatewayTokenAuthorizerEvent) => {
  console.log('[EVENT]', event);

  const { authorizationToken } = event;
  if (!authorizationToken) {
    console.log('There is no authorization token!');
    return {
      principalId: '',
      policyDocument: createPolicy(event, 'Deny'),
    };
  }

  const decodedToken = await decodeToken(authorizationToken);
  return {
    principalId: decodedToken ? decodedToken.sub!.toString() : '',
    policyDocument: createPolicy(event, decodedToken ? 'Allow' : 'Deny'),
  };
};
