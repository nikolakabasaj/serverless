import { HttpStatusCode } from 'axios';
import * as db from '../db/db-operations';
import { httpResponse } from '../utils/http/http-response';
import { Indexes } from '../constants/indexes';
import { FollowedIdIndexFields } from '../constants/indexes-fields';
import { Follow } from '../../model/follow';
import { UserDTO } from '../../lib/dto/user-dto';
import { User } from '../../model/user';
import { getAuthorizedUserId } from '../utils/event-parser';

const FOLLOW_TABLE_NAME = process.env.FOLLOW_TABLE_NAME!;
const USER_TABLE_NAME = process.env.USER_TABLE_NAME!;

export async function handler(event: any = {}) : Promise <any> {
  const currentUserId = getAuthorizedUserId(event);

  const followerIds = await getFollowerIds(currentUserId);
  if (followerIds.length === 0) {
    return httpResponse(HttpStatusCode.InternalServerError, 'There are no followers');
  }

  const followers: User[] = await db.getAllByIds(USER_TABLE_NAME, followerIds);
  if (followers.length === 0) {
    return httpResponse(HttpStatusCode.InternalServerError, 'There are no followers');
  }

  const followerUsersDTO: UserDTO[] = followers.map((user) => new UserDTO(user));
  return httpResponse(HttpStatusCode.Ok, 'All followers fetched', followerUsersDTO);
}

async function getCurrentUserFollows(currentUserId: string) {
  const fields = new FollowedIdIndexFields(currentUserId);
  return db.getByMultipleFields(FOLLOW_TABLE_NAME, Indexes.FollowedIdIndex, fields);
}

async function getFollowerIds(currentUserId: string) {
  const follows = await getCurrentUserFollows(currentUserId) as Follow[];
  return follows.map((follower) => follower.followerId);
}
