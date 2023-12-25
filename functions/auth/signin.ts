import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {CognitoIdentityServiceProvider, HttpResponse} from 'aws-sdk';
import {InitiateAuthRequest} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import {HttpStatusCode} from 'axios';
import {httpResponse} from '../utils/http/http-response';

const cognito = new CognitoIdentityServiceProvider();

exports.handler = async function (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  console.log('[EVENT]', event);
  if (!event.body) {
    return httpResponse(
      HttpStatusCode.BadRequest,
      'You must provide a username and password'
    );
  }

  const {username, password} = JSON.parse(event.body);
  const params: InitiateAuthRequest = {
    ClientId: process.env.CLIENT_ID!,
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const {AuthenticationResult} = await cognito.initiateAuth(params).promise();
    console.log('[AUTH]', AuthenticationResult);

    if (!AuthenticationResult) {
      return httpResponse(HttpStatusCode.Unauthorized, 'User signin failed');
    }

    const token = AuthenticationResult.IdToken;
    return httpResponse(HttpStatusCode.Ok, 'Auth successfull', {token});
  } catch (err) {
    return httpResponse(HttpStatusCode.InternalServerError, err);
  }
};
