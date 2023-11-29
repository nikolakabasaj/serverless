import { Indexes } from './indexes';

export const INDEX_FIELDS_MAP: Map<string, string[]> = new Map([
  // follow
  [Indexes.FollowedIdIndex, ['followedId']],
  [Indexes.FollowerIdIndex, ['followerId']],
  [Indexes.FollowerAndFollowedIdIndex, ['followerId', 'followedId']],

  // post
  [Indexes.PostUserIdIndex, ['userId']],
]);
