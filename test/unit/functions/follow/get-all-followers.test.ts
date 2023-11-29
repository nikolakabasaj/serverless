import {handler} from '../../../../functions/follow/get-all-followers';
import * as db from '../../../../functions/db/db-operations';
import {httpResponse} from '../../../../functions/utils/http/http-response';
import {Indexes} from '../../../../functions/constants/indexes';
import {FollowedIdIndexFields} from '../../../../functions/constants/indexes-fields';
import {Follow} from '../../../../model/follow';
import * as eventParser from '../../../../functions/utils/event-parser';
import {HttpStatusCode} from 'axios';

jest.mock('../../../../functions/utils/event-parser');
jest.mock('../../../../functions/db/db-operations');
jest.mock('../../../../functions/constants/indexes-fields');
jest.mock('../../../../functions/constants/indexes');

describe('Get All Followers Handler', () => {
  it('should return all followers when there are followers', async () => {
    // Arrange
    const currentUserId = '123';
    const followerIds = ['1', '2'];
    const follows = followerIds.map(followerId => ({followerId}));

    const followers = [
      {id: '1', username: 'follower1', email: 'follower1@example.com'},
      {id: '2', username: 'follower2', email: 'follower2@example.com'},
    ];

    jest
      .spyOn(eventParser, 'getAuthorizedUserId')
      .mockReturnValue(currentUserId);
    jest.spyOn(db, 'getByMultipleFields').mockResolvedValueOnce(follows);
    jest.spyOn(db, 'getAllByIds').mockResolvedValueOnce(followers);

    // Act
    const result = await handler();

    // Assert
    const receivedBody = JSON.parse(result.body);
    expect(result.statusCode).toBe(HttpStatusCode.Ok);
    expect(result.body).toContain('All followers fetched');
    expect(receivedBody.body).toEqual(expect.arrayContaining(followers));
  });

  it('should return an error message when there are no followers', async () => {
    // Arrange
    const currentUserId = '123';
    const emptyFollows: Follow[] = [];

    jest
      .spyOn(eventParser, 'getAuthorizedUserId')
      .mockReturnValue(currentUserId);
    jest.spyOn(db, 'getByMultipleFields').mockResolvedValueOnce(emptyFollows);

    // Act
    const result = await handler();

    // Assert
    expect(result.statusCode).toBe(HttpStatusCode.InternalServerError);
    expect(result.body).toContain('There are no followers');
  });
});
