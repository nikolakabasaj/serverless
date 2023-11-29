import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { SignUpRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { HttpStatusCode } from 'axios';
import * as db from '../db/db-operations';
import { httpResponse } from '../utils/http/http-response';
import { User } from '../../model/user';

const cognito = new CognitoIdentityServiceProvider();

type eventBody = {
  username: string;
  email: string;
  password: string;
};

exports.handler = async function (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log('[EVENT]', event);

  if (!event.body) {
    return httpResponse(HttpStatusCode.BadRequest, 'You must provide an email and password');
  }

  const { username, email, password }: eventBody = JSON.parse(event.body);
  const user = new User(username, email, password);
  const params: SignUpRequest = createSignupRequestParams(user);

  try {
    const res = await cognito.signUp(params).promise();
    await db.add(process.env.USER_TABLE_NAME!, user);

    return httpResponse(HttpStatusCode.Ok, 'Successfully signed up', res);
  } catch (err) {
    console.error(err);
    return httpResponse(HttpStatusCode.InternalServerError, err);
  }
};

function createSignupRequestParams(user: User): SignUpRequest {
  const params: SignUpRequest = {
    ClientId: process.env.CLIENT_ID!,
    Username: user.username,
    Password: user.password,
    UserAttributes: [{ Name: 'email', Value: user.email }, { Name: 'custom:userId', Value: user.id }],
  };

  return params;
}
