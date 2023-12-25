import * as handlerModule from '../../../../functions/post/get-feed';
import {HttpStatusCode} from 'axios';
import * as db from '../../../../functions/db/db-operations';
import * as s3 from '../../../../functions/s3/s3-bucket-operations';
import {Post} from '../../../../model/post';
import * as eventParser from '../../../../functions/utils/event-parser';
import * as parser from '../../../../functions/utils/base64-string-parser';

// import {getAuthorizedUserId} from '../yourLambdaFile'; // Update with the correct path
// import {decodeToken} from '../token/jwt-token-decoder'; // Update with the correct path

jest.mock('../../../../functions/db/db-operations');
jest.mock('../../../../functions/s3/s3-bucket-operations');

describe('Get Feed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return posts for authorized user', async () => {
    //   // Arrange
    //   const userId = '1';
    //   const mockFollowingIds = ['1', '2'];
    //   const mockPosts = [
    //     {postId: '1', userId: 'user1', content: 'Post 1'},
    //     {postId: '2', userId: 'user2', content: 'Post 2'},
    //     {postId: '3', userId: 'user3', content: 'Post 3'},
    //   ];
    //   const followedUsersIds = [{followedId: '1'}, {followedId: '2'}];
    //   jest.spyOn(eventParser, 'getAuthorizedUserId').mockReturnValue(userId);
    //   jest.spyOn(db, 'getAll').mockResolvedValueOnce(mockPosts);
    //   jest
    //     .spyOn(handlerModule, 'getCurrentUserFollows')
    //     .mockResolvedValue(followedUsersIds);
    //   // Mock the event object with Authorization header
    //   const event = {
    //     headers: {
    //       Authorization: 'mockAccessToken',
    //     },
    //   };
    //   // Act
    //   const result = await handlerModule.handler(event);
    //   // Assert
    //   expect(result).not.toBe(undefined);
    //   expect(result.statusCode).toBe(HttpStatusCode.Ok);
    //   expect(result.body).toBe('All posts fetched');
    //   expect(eventParser.getAuthorizedUserId).toHaveBeenCalledWith(
    //     'mockAccessToken'
    //   );
    //   expect(db.getAll).toHaveBeenCalledWith(process.env.FOLLOW_TABLE_NAME!);
    //   expect(db.getAll).toHaveBeenCalledWith(process.env.POST_TABLE_NAME!);
    //   const expectedFilteredPosts = mockPosts.filter(post =>
    //     mockFollowingIds.includes(post.userId)
    //   );
    //   expect(result.body).toContain(JSON.stringify(expectedFilteredPosts));
  });
});
