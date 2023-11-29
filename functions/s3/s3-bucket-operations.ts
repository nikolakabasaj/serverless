import * as AWS from 'aws-sdk';

const s3Client = new AWS.S3({ apiVersion: '2006-03-01' });

export async function upload(bucketName: string, contentType: string, key: string, body: any = {}) : Promise <any> {
  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: Buffer.from(body, 'base64'),
    ContentType: contentType,
  };
  const result = await s3Client.upload(uploadParams).promise();
  return result;
}

export async function read(bucketName: string, key: string) : Promise <any> {
  const readParams = {
    Bucket: bucketName,
    Key: key,
  };
  const response = await s3Client.getObject(readParams).promise();
  return Buffer.from(response.Body as Buffer).toString('base64');
}
