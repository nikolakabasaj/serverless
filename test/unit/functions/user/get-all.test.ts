import * as db from '../../../../functions/db/db-operations';
import {User} from '../../../../model/user';
import {UserDTO} from '../../../../lib/dto/user-dto';
import {HttpStatusCode} from 'axios';
import {handler} from '../../../../functions/user/get-all';

jest.mock('../../../../functions/db/db-operations');

const DB_MESSAGE_ERROR = 'Database error';

describe('User Handler', () => {
  it('should fetch all users successfully', async () => {
    // Arrange
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'user1',
        email: 'user1@example.com',
        password: 'test',
        createdAt: '2023-01-01T14:30:00Z',
      },
      {
        id: '2',
        username: 'user2',
        email: 'user2@example.com',
        password: 'test',
        createdAt: '2023-01-01T14:30:00Z',
      },
    ];
    const mockUsersDTO: UserDTO[] = mockUsers.map(user => new UserDTO(user));

    // Mock the db.getAll function to return mockUsers
    (db.getAll as jest.Mock).mockResolvedValueOnce(mockUsers);

    // Act
    const result = await handler();

    // Assert
    const receivedBody = JSON.parse(result.body);
    expect(db.getAll).toHaveBeenCalledWith(process.env.USER_TABLE_NAME!);
    expect(result.statusCode).toBe(HttpStatusCode.Ok);
    expect(result.body).toContain('Successfully fetched all users');
    expect(receivedBody.body).toEqual(expect.arrayContaining(mockUsersDTO));
  });

  it('should handle database error', async () => {
    // Arrange
    const mockError = 'Database error';

    // Mock the db.getAll function to throw an error
    (db.getAll as jest.Mock).mockRejectedValueOnce(DB_MESSAGE_ERROR);

    // Act
    const result = await handler();

    // Assert
    expect(db.getAll).toHaveBeenCalledWith(process.env.USER_TABLE_NAME!);
    expect(result.statusCode).toBe(HttpStatusCode.InternalServerError);
    expect(result.body).toContain(DB_MESSAGE_ERROR);
  });
});
