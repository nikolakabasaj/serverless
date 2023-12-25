import {HttpStatusCode} from 'axios';
import {Follow} from '../../model/follow';
import {Post} from '../../model/post';
import {Indexes} from '../constants/indexes';
import {FollowerIdIndexFields} from '../constants/indexes-fields';
import * as db from '../db/db-operations';
import {getAuthorizedUserId} from '../utils/event-parser';
import {httpResponse} from '../utils/http/http-response';

const FOLLOW_TABLE_NAME = process.env.FOLLOW_TABLE_NAME!;
const POST_TABLE_NAME = process.env.POST_TABLE_NAME!;

export async function handler(event: any = {}): Promise<any> {
  const currentUserId = getAuthorizedUserId(event);

  const followingIds = await getFollowingIds(currentUserId);

  const allPosts: Post[] = (await db.getAll(POST_TABLE_NAME)) as Post[];
  if (allPosts.length === 0) {
    return httpResponse(
      HttpStatusCode.InternalServerError,
      'There are no posts'
    );
  }

  const followersPosts = allPosts.filter(post =>
    followingIds.includes(post.userId)
  );
  return httpResponse(HttpStatusCode.Ok, 'All posts fetched', followersPosts);
}

export async function getCurrentUserFollows(currentUserId: string) {
  const fields = new FollowerIdIndexFields(currentUserId);
  return db.getByMultipleFields(
    FOLLOW_TABLE_NAME,
    Indexes.FollowerIdIndex,
    fields
  );
}

async function getFollowingIds(currentUserId: string) {
  const follows: Follow[] = await getCurrentUserFollows(currentUserId);
  return follows.map(follow => follow.followedId);
}
