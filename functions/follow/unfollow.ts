import { HttpStatusCode } from 'axios';
import * as db from '../db/db-operations';
import { Follow, FollowStatus } from '../../model/follow';
import { httpResponse } from '../utils/http/http-response';
import { isEmpty } from '../utils/object-validator';
import { FollowerAndFollowedIdIndexFiels } from '../constants/indexes-fields';
import { Indexes } from '../constants/indexes';
import { getAuthorizedUserId, getPathParameter } from '../utils/event-parser';

const USER_TABLE_NAME = process.env.USER_TABLE_NAME!;
const FOLLOW_TABLE_NAME = process.env.FOLLOW_TABLE_NAME!;

export async function handler(event: any = {}) : Promise <any> {
  const currentUserId = getAuthorizedUserId(event);
  const followedUserId = getPathParameter(event, 'userId');

  if (currentUserId === followedUserId) {
    return httpResponse(HttpStatusCode.Conflict, `User with id ${currentUserId} cannot follow himself`);
  }

  const followedUser = await db.getById(USER_TABLE_NAME, followedUserId);
  if (isEmpty(followedUser)) {
    return httpResponse(HttpStatusCode.NotFound, `User with id ${followedUserId} does not exist`);
  }

  const follows: Follow[] = await getCurrentUserFollows(FOLLOW_TABLE_NAME, currentUserId, followedUserId);
  if (follows.length === 0) {
    return httpResponse(HttpStatusCode.Conflict, `User with id ${currentUserId} does not follow user with id ${followedUserId}`);
  }
  const follow : Follow = follows[0];
  if (follow.status === FollowStatus.Unfollowed) {
    return httpResponse(HttpStatusCode.Conflict, `User with id ${currentUserId} does not follow user with id ${followedUserId}`);
  }

  follow.status = FollowStatus.Unfollowed;

  try {
    await db.add(FOLLOW_TABLE_NAME, follow);
    return httpResponse(HttpStatusCode.Ok, `User with id ${followedUserId} successfully unfollowed`);
  } catch (dbError) {
    return httpResponse(HttpStatusCode.InternalServerError, dbError);
  }
}

async function getCurrentUserFollows(tableName: string, currentUserId: string, followedUserId: string) {
  const followerAndFollowedIdIndexFiels = new FollowerAndFollowedIdIndexFiels(currentUserId, followedUserId);
  return db.getByMultipleFields(tableName, Indexes.FollowerAndFollowedIdIndex, followerAndFollowedIdIndexFiels);
}
