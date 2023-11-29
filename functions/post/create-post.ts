import { HttpStatusCode } from 'axios';
import { httpResponse } from '../utils/http/http-response';
import { upload } from '../s3/s3-bucket-operations';
import { Post } from '../../model/post';
import * as db from '../db/db-operations';
import { getAuthorizedUserId } from '../utils/event-parser';
import { parseContentType, parseImageBase64String } from '../utils/base64-string-parser';

const POST_S3_BUCKET_NAME = process.env.POST_S3_BUCKET_NAME!;

export async function handler(event: any = {}): Promise<any> {
  const body = JSON.parse(event.body);
  const currentUserId = getAuthorizedUserId(event);

  const contentType: string = parseContentType(body.content);
  const img_data = parseImageBase64String(body.content);

  const post = new Post(currentUserId, body.description);
  const imageBucketLocation = await upload(POST_S3_BUCKET_NAME,
    contentType,
    post.getImageKey(),
    img_data);
  post.setImageLocation(imageBucketLocation);

  try {
    await db.add(process.env.POST_TABLE_NAME!, post);
    return httpResponse(HttpStatusCode.Ok, 'Post created successfully');
  } catch (dbError) {
    return httpResponse(HttpStatusCode.InternalServerError, dbError);
  }
}
