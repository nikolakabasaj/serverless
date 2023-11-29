import { HttpStatusCode } from 'axios';
import { PostUserIdIndexFields } from '../constants/indexes-fields';
import { getAuthorizedUserId, getPathParameter } from '../utils/event-parser';
import * as db from '../db/db-operations';
import { Indexes } from '../constants/indexes';
import { Post } from '../../model/post';
import { httpResponse } from '../utils/http/http-response';

const POST_TABLE_NAME = process.env.POST_TABLE_NAME!;

export async function handler(event: any = {}) : Promise <any> {
  const currentUserId = getAuthorizedUserId(event);
  const postId = getPathParameter(event, 'postId');

  if (!(await isPostMine(currentUserId, postId))) {
    return httpResponse(HttpStatusCode.Conflict, `User with id ${currentUserId} does not have a permission to delete post with id ${postId}`);
  }

  await db.deleteById(POST_TABLE_NAME, postId);
  return httpResponse(HttpStatusCode.Ok, `Post with id ${postId} is successfully deleted`);
}

async function isPostMine(currentUserId: string, postId: string) : Promise<boolean> {
  const currentUserPosts : Post[] = await getCurrentUserPosts(currentUserId);
  return currentUserPosts.some((post) => post.id === postId);
}

async function getCurrentUserPosts(currentUserId: string) {
  const fields = new PostUserIdIndexFields(currentUserId);
  return db.getByMultipleFields(POST_TABLE_NAME, Indexes.PostUserIdIndex, fields);
}
