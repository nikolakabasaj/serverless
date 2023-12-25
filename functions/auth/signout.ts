import {APIGatewayProxyResult} from 'aws-lambda';
import {CognitoIdentityServiceProvider} from 'aws-sdk';
import {HttpStatusCode} from 'axios';
import {httpResponse} from '../utils/http/http-response';

const cognito = new CognitoIdentityServiceProvider();

exports.handler = async function (): Promise<APIGatewayProxyResult> {
  console.log('usao');
  const res = await cognito.globalSignOut().promise();
  console.log('Sign out', res);
  return httpResponse(HttpStatusCode.Ok, 'Signout successfull');
};
