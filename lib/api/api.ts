import { Cors, EndpointType, IResource, LambdaIntegration, RestApi, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { createLambdaIntegrationOptions, createTokenAuthorizer } from '../../functions/utils/token/token-authorizer-factory';
import { createFn, createFnProps } from '../../functions/utils/lambda-function-util';
import { createPolicyStatement } from '../../functions/utils/policy-factory';
import { HTTPMethod } from '../../functions/constants/http';
import { AppConstants } from '../../functions/constants/application';
import { DynamoDB } from '../dynamodb/dynamodb';
import { Indexes } from '../../functions/constants/indexes';
import { S3Bucket } from '../s3/s3-bucket';
import { INDEX_FIELDS_MAP } from '../../functions/constants/indexes-fields-map';


type ApiProps = {
    userPoolId: string,
    userPoolClientId: string,
    postS3Bucket: S3Bucket
    dynamoDBTables: DynamoDBTables
}

type DynamoDBTables = {
    userTable: DynamoDB;
    followTable: DynamoDB;
    postTable: DynamoDB;
    commentTable: DynamoDB;
}

class ResourceData {
    resourceName: string;
    method: string;
    resource: IResource;
    isResourceProtected: boolean;

    constructor(resourceName: string, 
        method: string, 
        resource: IResource,
        isResourceProtected = true) { 
        this.resourceName = resourceName;
        this.method = method;
        this.resource = resource;
        this.isResourceProtected = isResourceProtected
    }
}

export class InstagramAPI extends Construct {
    private apiProps: ApiProps;
    private tokenAuthorizer: TokenAuthorizer

    private authResource: IResource;
    private userResource: IResource;
    private singleUserResource: IResource;
    private followResource: IResource;
    private postResource: IResource;
    private singlePostResource: IResource;
    private feedResource: IResource;

    constructor(scope: Construct, props: ApiProps) {
        const constructName = AppConstants.RestApiName;
        super(scope, constructName);
        this.initializeProps(props);

        const api = new RestApi(this, constructName, {
			description: AppConstants.RestApiDescription,
			endpointTypes: [EndpointType.REGIONAL],
			defaultCorsPreflightOptions: {
				allowOrigins: Cors.ALL_ORIGINS,
			},
            restApiName: constructName
		});

        this.setUpRoutes(api);
    }

    private initializeProps(props: ApiProps) {
        this.apiProps = props;
        this.tokenAuthorizer = createTokenAuthorizer(this, { 
            userPoolId: this.apiProps.userPoolId,
            userPoolClientId: this.apiProps.userPoolClientId
        });
    }

    private setUpRoutes(api: RestApi) {
        this.authResource = api.root.addResource('auth');
        this.userResource = api.root.addResource('user');
        this.singleUserResource = this.userResource.addResource('{userId}');
        this.followResource = api.root.addResource('follow');
        this.postResource = api.root.addResource('post');
        this.singlePostResource = this.postResource.addResource("{postId}");
        this.feedResource = api.root.addResource('feed');

        const functions = this.createRouteFunctions();
        this.grantDBActions(functions);
        this.grantS3Actions(functions);
        this.createSecondaryIndexes();

        // auth
        this.addRoute(new ResourceData('signout', HTTPMethod.GET, this.authResource, false), functions.signOutFn);
		this.addRoute(new ResourceData('signup', HTTPMethod.POST, this.authResource, false), functions.signupFn);
		this.addRoute(new ResourceData('signin', HTTPMethod.POST, this.authResource, false), functions.signinFn);
		this.addRoute(new ResourceData('confirm-signup', HTTPMethod.POST, this.authResource, false), functions.confirmSignupFn);
        
        // user
        this.addRoute(new ResourceData('all', HTTPMethod.GET, this.userResource), functions.getAllUsersFn);
        this.addRoute(new ResourceData('current', HTTPMethod.GET, this.userResource), functions.getCurrentlyLoggedUserFn);
        this.addRoute(new ResourceData('add', HTTPMethod.POST, this.userResource), functions.createUserFn);

        // follow
        this.addRoute(new ResourceData("followers", HTTPMethod.GET, api.root), functions.getAllfollowersFn);
        this.addRoute(new ResourceData("followings", HTTPMethod.GET, api.root), functions.getAllfollowingsFn);
        this.addRoute(new ResourceData("follow", HTTPMethod.POST, this.singleUserResource), functions.followUserFn);
        this.addRoute(new ResourceData("unfollow", HTTPMethod.POST, this.singleUserResource), functions.unfollowUserFn);
       
        // post
        this.addRoute(new ResourceData("", HTTPMethod.GET, this.postResource), functions.getPostsForCurrentUserFn);
        this.addRoute(new ResourceData("", HTTPMethod.GET, this.feedResource), functions.getFeedFn);
        this.addRoute(new ResourceData("", HTTPMethod.POST, this.postResource), functions.createPostFn);
        this.addRoute(new ResourceData("like", HTTPMethod.POST, this.singlePostResource), functions.likePostFn);
        this.addRoute(new ResourceData("", HTTPMethod.PUT, this.singlePostResource), functions.updatePostFn);
        this.addRoute(new ResourceData("", HTTPMethod.DELETE, this.singlePostResource), functions.deletePostFn);

        // comment
        this.addRoute(new ResourceData("comment", HTTPMethod.POST, this.singlePostResource), functions.commentPostFn);
    }


    private addRoute(
        resourceData: ResourceData,
        fn: any,
        actions?: string,
    ): void {
        const newResource = resourceData.resourceName === "" ? resourceData.resource : resourceData.resource.addResource(resourceData.resourceName);
        if (actions) {
			fn.addToRolePolicy(createPolicyStatement(this.apiProps.userPoolId, actions));
		}

        const options = resourceData.isResourceProtected ? createLambdaIntegrationOptions(this.tokenAuthorizer) : undefined;
		newResource.addMethod(resourceData.method, new LambdaIntegration(fn), options);
    }

    private createRouteFunctions() {
        // entry
        const baseEntry = './functions';
        const authEntry = baseEntry + '/auth';
        const userEntry = baseEntry + '/user';
        const followEntry = baseEntry + '/follow';
        const postEntry = baseEntry + '/post';

        // fn props
        const cognitoProps = createFnProps({ USER_POOL_ID:  this.apiProps.userPoolId, CLIENT_ID: this.apiProps.userPoolClientId });
        const userDynamoDbProps = createFnProps({ USER_TABLE_NAME: this.getUserTable().getTableName() });
        const userCognitoDynamoProps = createFnProps({ USER_POOL_ID:  this.apiProps.userPoolId, CLIENT_ID: this.apiProps.userPoolClientId, USER_TABLE_NAME: this.getUserTable().getTableName() });
        const followProps = createFnProps({ FOLLOW_TABLE_NAME: this.getFollowTable().getTableName(), USER_TABLE_NAME: this.getUserTable().getTableName() });
        const postProps = createFnProps({ POST_TABLE_NAME: this.getPostTable().getTableName(), POST_S3_BUCKET_NAME: this.getPostS3Bucket().getBucketName(), FOLLOW_TABLE_NAME: this.getFollowTable().getTableName(), USER_TABLE_NAME: this.getUserTable().getTableName(), COMMENT_TABLE_NAME: this.getCommentTable().getTableName() });
        const commentProps = createFnProps({ COMMENT_TABLE_NAME: this.getCommentTable().getTableName() });

        // fn
        // auth 
        const signOutFn = createFn(this, 'SignoutFn', `${authEntry}/signout.ts`, cognitoProps);
        const signupFn = createFn(this, 'SignupFn', `${authEntry}/signup.ts`, userCognitoDynamoProps);
        const signinFn = createFn(this, 'SigninFn', `${authEntry}/signin.ts`, cognitoProps);
        const confirmSignupFn = createFn(this, 'ConfirmFn', `${authEntry}/confirm-signup.ts`,  cognitoProps);

        // user
        const createUserFn = createFn(this, 'CreateUserFn', `${userEntry}/create-user.ts`, userDynamoDbProps);
        const getAllUsersFn = createFn(this, 'GetAllUsersFn', `${userEntry}/get-all.ts`, userDynamoDbProps);
        const getCurrentlyLoggedUserFn = createFn(this, 'GetCurrentlyLoggedUserFn', `${userEntry}/get-current-user.ts`, userDynamoDbProps);

        // follow
        const followUserFn = createFn(this, 'FollowUserFn', `${followEntry}/follow.ts`, followProps);
        const unfollowUserFn = createFn(this, 'UnfollowUserFn', `${followEntry}/unfollow.ts`, followProps);
        const getAllfollowersFn = createFn(this, 'GetAllFollowersFn', `${followEntry}/get-all-followers.ts`, followProps);
        const getAllfollowingsFn = createFn(this, 'GetAllFollowingsFn', `${followEntry}/get-all-followings.ts`, followProps);

        // post 
        const createPostFn = createFn(this, 'CreatePostFn', `${postEntry}/create-post.ts`, postProps);
        const likePostFn = createFn(this, 'LikePostFn', `${postEntry}/like-post.ts`, postProps);
        const getPostsForCurrentUserFn = createFn(this, 'GetPostsForCurrentUserFn', `${postEntry}/get-all-current-user-posts.ts`, postProps);
        const getFeedFn = createFn(this, 'GetFeedFn', `${postEntry}/get-feed.ts`, postProps);
        const updatePostFn = createFn(this, 'UpdatePostFn', `${postEntry}/update-post.ts`, postProps);
        const deletePostFn = createFn(this, 'DeletePostFn', `${postEntry}/delete-post.ts`, postProps);

        // comment
        const commentPostFn = createFn(this, 'CommmentPostFn', `${postEntry}/comment-post.ts`, commentProps);

        return {
            // auth
            signOutFn,
            signupFn,
            signinFn,
            confirmSignupFn,
            // user
            getAllUsersFn,
            getCurrentlyLoggedUserFn,
            createUserFn,
            // follow
            getAllfollowersFn,
            getAllfollowingsFn,
            followUserFn,
            unfollowUserFn,
            // post
            createPostFn,
            likePostFn,
            getPostsForCurrentUserFn,
            getFeedFn,
            updatePostFn,
            deletePostFn,
            // comment
            commentPostFn,

        }
    }

    private grantDBActions(functions: any) {
        // user table
        this.getUserTable().grantWriteData(functions.createUserFn);
        this.getUserTable().grantWriteData(functions.signupFn);
        this.getUserTable().grantReadData(functions.getAllUsersFn);
        this.getUserTable().grantReadData(functions.getCurrentlyLoggedUserFn);
        this.getUserTable().grantReadData(functions.followUserFn);
        this.getUserTable().grantReadData(functions.unfollowUserFn);
        this.getUserTable().grantReadData(functions.getAllfollowersFn);
        this.getUserTable().grantReadData(functions.getAllfollowingsFn);
        this.getUserTable().grantReadData(functions.getFeedFn);

        // follow table
        this.getFollowTable().grantReadData(functions.getAllfollowersFn);
        this.getFollowTable().grantReadData(functions.getAllfollowingsFn);
        this.getFollowTable().grantReadWriteData(functions.followUserFn);
        this.getFollowTable().grantReadWriteData(functions.unfollowUserFn);
        this.getFollowTable().grantReadData(functions.getFeedFn);

        // post table
        this.getPostTable().grantWriteData(functions.createPostFn);
        this.getPostTable().grantReadWriteData(functions.likePostFn);
        this.getPostTable().grantReadData(functions.getPostsForCurrentUserFn);
        this.getPostTable().grantReadData(functions.getFeedFn);
        this.getPostTable().grantReadWriteData(functions.updatePostFn);
        this.getPostTable().grantReadWriteData(functions.deletePostFn);

        // comment
        this.getCommentTable().grantWriteData(functions.commentPostFn);
    }

    private grantS3Actions(functions: any) {
        this.getPostS3Bucket().grantReadWriteData(functions.createPostFn);
    }

    private createSecondaryIndexes() {
        this.getFollowTable().addGlobalSecondaryIndex(Indexes.FollowedIdIndex, INDEX_FIELDS_MAP.get(Indexes.FollowedIdIndex)!);
        this.getFollowTable().addGlobalSecondaryIndex(Indexes.FollowerIdIndex, INDEX_FIELDS_MAP.get(Indexes.FollowerIdIndex)!);
        this.getFollowTable().addGlobalSecondaryIndex(Indexes.FollowerAndFollowedIdIndex, INDEX_FIELDS_MAP.get(Indexes.FollowerAndFollowedIdIndex)!);

        this.getPostTable().addGlobalSecondaryIndex(Indexes.PostUserIdIndex, INDEX_FIELDS_MAP.get(Indexes.PostUserIdIndex)!)
    }

    private getUserTable() { return this.apiProps.dynamoDBTables.userTable; }

    private getFollowTable() { return this.apiProps.dynamoDBTables.followTable; }

    private getPostTable() { return this.apiProps.dynamoDBTables.postTable; }

    private getCommentTable() { return this.apiProps.dynamoDBTables.commentTable; }

    private getPostS3Bucket() { return this.apiProps.postS3Bucket; }
}


