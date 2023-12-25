import {handler} from '../../../../functions/user/get-all';
import * as db from '../../../../functions/db/db-operations';
import * as s3 from '../../../../functions/s3/s3-bucket-operations';
import * as eventParser from '../../../../functions/utils/event-parser';
import * as parser from '../../../../functions/utils/base64-string-parser';
import {HttpStatusCode} from 'axios';

const USER_TABLE_NAME = 'mockUserTable';
const DB_MESSAGE_ERROR = 'Database error';

describe('User Handler Integration Test', () => {
  beforeAll(() => {
    process.env.USER_TABLE_NAME = USER_TABLE_NAME;
  });

  afterAll(() => {
    delete process.env.USER_TABLE_NAME;
  });

  it('should fetch all users successfully', async () => {
    // Arrange
    const mockUsers = [
      {id: '1', username: 'user1', email: 'user1@example.com'},
      {id: '2', username: 'user2', email: 'user2@example.com'},
    ];

    // Mock the db.getAll function to return mockUsers
    (db.getAll as jest.Mock).mockResolvedValueOnce(mockUsers);

    // Act
    const result = await handler();

    // Assert
    expect(db.getAll).toHaveBeenCalledWith(USER_TABLE_NAME);
    expect(result.statusCode).toBe(HttpStatusCode.Ok);
    expect(result.body).toContain('Successfully fetched all users');
    expect(JSON.parse(result.body).body).toEqual(
      expect.arrayContaining(mockUsers)
    );
  });

  it('should handle database error', async () => {
    // Arrange
    // Mock the db.getAll function to throw an error
    (db.getAll as jest.Mock).mockRejectedValueOnce(DB_MESSAGE_ERROR);

    // Act
    const result = await handler();

    // Assert
    expect(db.getAll).toHaveBeenCalledWith(USER_TABLE_NAME);
    expect(result.statusCode).toBe(HttpStatusCode.InternalServerError);
    expect(result.body).toContain(DB_MESSAGE_ERROR);
  });
});
