import { HttpStatusCode } from 'axios';
import * as db from '../db/db-operations';
import { httpResponse } from '../utils/http/http-response';
import { Indexes } from '../constants/indexes';
import { FollowerIdIndexFields } from '../constants/indexes-fields';
import { Follow } from '../../model/follow';
import { UserDTO } from '../../lib/dto/user-dto';
import { User } from '../../model/user';
import { getAuthorizedUserId } from '../utils/event-parser';

const FOLLOW_TABLE_NAME = process.env.FOLLOW_TABLE_NAME!;
const USER_TABLE_NAME = process.env.USER_TABLE_NAME!;

export async function handler(event: any = {}) : Promise <any> {
  const currentUserId = getAuthorizedUserId(event);

  const followingIds = await getFollowingIds(currentUserId);
  if (followingIds.length === 0) {
    return httpResponse(HttpStatusCode.InternalServerError, 'There are no followings');
  }

  const followings: User[] = await db.getAllByIds(USER_TABLE_NAME, followingIds);
  if (followings.length === 0) {
    return httpResponse(HttpStatusCode.InternalServerError, 'There are no followings');
  }

  const followingUsersDTO: UserDTO[] = followings.map((user) => new UserDTO(user));
  return httpResponse(HttpStatusCode.Ok, 'All followings fetched', followingUsersDTO);
}

async function getCurrentUserFollows(currentUserId: string) {
  const fields = new FollowerIdIndexFields(currentUserId);
  return db.getByMultipleFields(FOLLOW_TABLE_NAME, Indexes.FollowerIdIndex, fields);
}

async function getFollowingIds(currentUserId: string) {
  const follows: Follow[] = await getCurrentUserFollows(currentUserId);
  return follows.map((follow) => follow.followedId);
}
