import { RemovalPolicy } from "aws-cdk-lib";
import { UserPool, 
         StringAttribute, 
         AccountRecovery, 
         ClientAttributes, 
         UserPoolClientIdentityProvider, 
         UserPoolClientProps } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { AppConstants } from "../../functions/constants/application";

export class CognitoUserPool extends Construct {
    readonly userPoolId: string
    readonly userPoolClientId: string;

    constructor(scope: Construct, id: string, name: string) {
        super(scope, id)

        const userPool = new UserPool(this, AppConstants.UserPoolName, {
            signInAliases: { username: true, email: true },
            selfSignUpEnabled: true,
            userPoolName: `${id}-${name}`,
            customAttributes: {
                userId: new StringAttribute({ mutable: false }),
            },
            passwordPolicy: {
                minLength: 8,
                requireLowercase: true,
                requireDigits: true,
                requireUppercase: true,
                requireSymbols: true,
            },
            accountRecovery: AccountRecovery.EMAIL_ONLY,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        const standardCognitoAttributes = {
            givenName: true,
            familyName: true,
            email: true,
            emailVerified: true,
            address: true,
            birthdate: true,
            gender: true,
            locale: true,
            middleName: true,
            fullname: true,
            nickname: true,
            phoneNumber: true,
            phoneNumberVerified: true,
            profilePicture: true,
            preferredUsername: true,
            profilePage: true,
            timezone: true,
            lastUpdateTime: true,
            website: true,
        };
        const clientReadAttributes = new ClientAttributes()
            .withStandardAttributes(standardCognitoAttributes)
            .withCustomAttributes(...["userId"]);
        const clientWriteAttributes = new ClientAttributes().withStandardAttributes({
            ...standardCognitoAttributes,
            emailVerified: false,
            phoneNumberVerified: false,
        }).withCustomAttributes(...["userId"]);

        const userPoolClientProps: UserPoolClientProps = {
            userPool: userPool,
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userSrp: true,
                userPassword: true
            },
            supportedIdentityProviders: [
                UserPoolClientIdentityProvider.COGNITO,
            ],
            readAttributes: clientReadAttributes,
            writeAttributes: clientWriteAttributes,
            generateSecret: false,
            
        };

        const appClient = userPool.addClient(AppConstants.AppClientName, userPoolClientProps)

        this.userPoolId = userPool.userPoolId;
        this.userPoolClientId = appClient.userPoolClientId

    }
}