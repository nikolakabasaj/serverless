import {handler} from '../../../../functions/follower/get-all-followers';
import * as db from '../../../../functions/db/db-operations';
import * as eventParser from '../../../../functions/utils/event-parser';
import {HttpStatusCode} from 'axios';

const FOLLOW_TABLE_NAME = 'mockFollowTable';
const USER_TABLE_NAME = 'mockUserTable';

describe('Get All Followers Integration Test', () => {
  beforeAll(() => {
    process.env.FOLLOW_TABLE_NAME = FOLLOW_TABLE_NAME;
    process.env.USER_TABLE_NAME = USER_TABLE_NAME;
  });

  afterAll(() => {
    delete process.env.FOLLOW_TABLE_NAME;
    delete process.env.USER_TABLE_NAME;
  });

  it('should return all followers when there are followers', async () => {
    // Arrange
    const currentUserId = '123';
    const followerIds = ['1', '2'];
    const follows = followerIds.map(followerId => ({followerId}));

    const followers = [
      {id: '1', username: 'follower1', email: 'follower1@example.com'},
      {id: '2', username: 'follower2', email: 'follower2@example.com'},
    ];

    // Mock the eventParser and db functions
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
    const emptyFollows = [];

    // Mock the eventParser and db functions
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
