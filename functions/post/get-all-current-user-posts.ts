import {HttpStatusCode} from 'axios';
import {httpResponse} from '../utils/http/http-response';
import * as db from '../db/db-operations';
import {PostUserIdIndexFields} from '../constants/indexes-fields';
import {Indexes} from '../constants/indexes';
import {getAuthorizedUserId} from '../utils/event-parser';

const POST_TABLE_NAME = process.env.POST_TABLE_NAME!;

export async function handler(event: any = {}): Promise<any> {
  const currentUserId = getAuthorizedUserId(event);

  const posts = await getCurrentUserPosts(currentUserId);
  return httpResponse(
    HttpStatusCode.Ok,
    'Fetched posts for current user',
    posts
  );
}

async function getCurrentUserPosts(currentUserId: string) {
  const fields = new PostUserIdIndexFields(currentUserId);
  return db.getByMultipleFields(
    POST_TABLE_NAME,
    Indexes.PostUserIdIndex,
    fields
  );
}
