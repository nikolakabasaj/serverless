import {HttpStatusCode} from 'axios';
import * as db from '../db/db-operations';
import {Follow} from '../../model/follow';
import {httpResponse} from '../utils/http/http-response';
import {isEmpty} from '../utils/object-validator';
import {FollowerAndFollowedIdIndexFiels} from '../constants/indexes-fields';
import {Indexes} from '../constants/indexes';
import {getAuthorizedUserId, getPathParameter} from '../utils/event-parser';

export async function handler(event: any = {}): Promise<any> {
  const currentUserId = getAuthorizedUserId(event);
  const followedUserId = getPathParameter(event, 'userId');

  if (currentUserId === followedUserId) {
    return httpResponse(
      HttpStatusCode.Conflict,
      `User with id ${currentUserId} cannot follow himself`
    );
  }

  const followedUser = await db.getById(
    process.env.USER_TABLE_NAME!,
    followedUserId
  );
  if (isEmpty(followedUser)) {
    return httpResponse(
      HttpStatusCode.NotFound,
      `User with id ${followedUserId} does not exist`
    );
  }

  if (
    await isAllreadyFollowing(
      process.env.FOLLOW_TABLE_NAME!,
      currentUserId,
      followedUserId
    )
  ) {
    return httpResponse(
      HttpStatusCode.Conflict,
      `User with id ${currentUserId} already follows user with id ${followedUserId}`
    );
  }

  const newFollow = new Follow(currentUserId, followedUserId);
  try {
    await db.add(process.env.FOLLOW_TABLE_NAME!, newFollow);
    return httpResponse(
      HttpStatusCode.Ok,
      `User with id ${followedUserId} successfully followed`
    );
  } catch (dbError) {
    return httpResponse(HttpStatusCode.InternalServerError, dbError);
  }
}

export async function isAllreadyFollowing(
  tableName: string,
  followerId: string,
  followedId: string
) {
  const followerAndFollowedIdIndexFiels = new FollowerAndFollowedIdIndexFiels(
    followerId,
    followedId
  );
  const follow = await db.getByMultipleFields(
    tableName,
    Indexes.FollowerAndFollowedIdIndex,
    followerAndFollowedIdIndexFiels
  );
  return follow.length !== 0;
}
