# Serverless Social Media Application

This is a serverless application built to showcase the basics of using various AWS resources. It leverages the AWS Cloud Development Kit (CDK) to provision and configure the required infrastructure resources.

AWS CDK
AWS CDK (Cloud Development Kit) is an open-source software development framework provided by Amazon Web Services (AWS) that enables you to define cloud infrastructure resources using familiar programming languages such as TypeScript, JavaScript, Python, and more. With CDK, you can define your infrastructure as code, making it easier to manage and deploy your AWS resources.

## Resources Used
The serverless application utilizes the following AWS resources:

* **Lambda**: AWS Lambda is a serverless compute service that allows you to run your application code without provisioning or managing servers. In this application, Lambda functions are used to handle various functionalities.

* **S3**: Amazon Simple Storage Service (S3) is an object storage service that offers industry-leading scalability, data availability, security, and performance. S3 is used to store various assets like user profile pictures, post images, and other media files.

* **Cognito**: Amazon Cognito provides authentication, authorization, and user management for your applications. It allows you to easily add user sign-up, sign-in, and access control to your serverless application.

* **API Gateway**: Amazon API Gateway is a fully managed service that makes it easy to create, publish, and manage APIs at any scale. It acts as the entry point for the serverless application's RESTful API endpoints.

* **DynamoDB**: Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance. It is used to store data related to users, posts, followers, and comments in this social media application.

## Application Domain
The serverless application simulates a social media platform similar to Instagram. The main features of the application include:

* **User Management**: Users can create accounts, sign in, and manage their profile information.

* **Followers**: Each user can view their list of followers and the users they are following.

* **Posts**: Users can view their own posts and posts from the users they follow. They can also create new posts and upload images.

* **Comments**: Users can comment on posts made by other users, enabling interaction and engagement within the application.

This serverless application serves as a starting point for understanding and exploring the capabilities of AWS services in a social media context.

## Deployment
To deploy the serverless application, follow these steps:

Clone the repository to your local machine.

Install the required dependencies by running the following command:

Copy code
`npm install`
Configure the AWS credentials on your local machine using the AWS CLI.

Build and deploy the application using the following command:

Copy code
`cdk deploy`
This command will create the necessary AWS resources and configure the application stack based on the defined infrastructure-as-code.

Once the deployment is complete, you will receive the necessary endpoints and credentials to interact with the application.

Conclusion
The serverless social media application demonstrates how to leverage AWS services like Lambda, S3, Cognito, API Gateway, and DynamoDB to build a scalable and functional social media platform. Feel free to explore the code and customize it according to your requirements. For further details and documentation, refer to the project repository and the official AWS documentation for the respective services.
