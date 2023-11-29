import { HttpStatusCode } from 'axios';
import { getAuthorizedUserId, getPathParameter } from '../utils/event-parser';
import * as db from '../db/db-operations';
import { Post } from '../../model/post';
import { httpResponse } from '../utils/http/http-response';
import { updateObject } from '../utils/object-validator';
import { PostUserIdIndexFields } from '../constants/indexes-fields';
import { Indexes } from '../constants/indexes';

const POST_TABLE_NAME = process.env.POST_TABLE_NAME!;

export async function handler(event: any = {}) : Promise <any> {
  const currentUserId = getAuthorizedUserId(event);
  const postId = getPathParameter(event, 'postId');

  const updatePost = JSON.parse(event.body);
  const post : Post = await db.getById(POST_TABLE_NAME, postId);
  if (!(await isPostMine(currentUserId, post.id))) {
    return httpResponse(HttpStatusCode.Conflict, 'You cannot update someone else\'s posts');
  }

  await updateObject<Post>(post as Post, updatePost);

  await db.add(POST_TABLE_NAME, post);
  return httpResponse(HttpStatusCode.Ok, `Post with id ${postId} is successfully updated`);
}

async function isPostMine(currentUserId: string, postId: string) : Promise<boolean> {
  const currentUserPosts : Post[] = await getCurrentUserPosts(currentUserId);
  return currentUserPosts.some((post) => post.id === postId);
}

async function getCurrentUserPosts(currentUserId: string) {
  const fields = new PostUserIdIndexFields(currentUserId);
  return db.getByMultipleFields(POST_TABLE_NAME, Indexes.PostUserIdIndex, fields);
}
