import supertest from 'supertest';
import app from '../../../../app'; // Import your Express app

const request = supertest(app);

describe('Get All Followers End-to-End Test', () => {
  it('should return all followers when there are followers', async () => {
    // Act
    const response = await request.get('/followers');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'All followers fetched');
    expect(response.body).toHaveProperty('body');
  });

  it('should return an error message when there are no followers', async () => {
    // Act
    const response = await request.get('/followers');

    // Assert
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'There are no followers');
  });
});
