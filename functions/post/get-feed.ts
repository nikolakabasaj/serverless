import { HttpStatusCode } from 'axios';
import * as db from '../db/db-operations';
import { httpResponse } from '../utils/http/http-response';
import { Indexes } from '../constants/indexes';
import { FollowerIdIndexFields, PostUserIdIndexFields } from '../constants/indexes-fields';
import { Follow } from '../../model/follow';
import { getAuthorizedUserId } from '../utils/event-parser';
import { Post } from '../../model/post';

const FOLLOW_TABLE_NAME = process.env.FOLLOW_TABLE_NAME!;
const POST_TABLE_NAME = process.env.POST_TABLE_NAME!;

export async function handler(event: any = {}) : Promise <any> {
  const currentUserId = getAuthorizedUserId(event);

  const followingIds = await getFollowingIds(currentUserId);
  if (followingIds.length === 0) {
    return httpResponse(HttpStatusCode.Ok, 'All posts fetched', []);
  }

  const postArrays = await Promise.all(
    followingIds.map((id) => db.getByMultipleFields(POST_TABLE_NAME, Indexes.PostUserIdIndex, new PostUserIdIndexFields(id))),
  );
  const followersPosts: Post[] = ([] as Post[]).concat(...postArrays);

  return httpResponse(HttpStatusCode.Ok, 'All posts fetched', followersPosts);
}

async function getCurrentUserFollows(currentUserId: string) {
  const fields = new FollowerIdIndexFields(currentUserId);
  return db.getByMultipleFields(FOLLOW_TABLE_NAME, Indexes.FollowerIdIndex, fields);
}

async function getFollowingIds(currentUserId: string) {
  const follows: Follow[] = await getCurrentUserFollows(currentUserId);
  return follows.map((follow) => follow.followedId);
}
