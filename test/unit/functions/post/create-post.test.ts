// create-post.test.ts

import {handler} from '../../../../functions/post/create-post';
import {HttpStatusCode} from 'axios';
import * as db from '../../../../functions/db/db-operations';
import * as s3 from '../../../../functions/s3/s3-bucket-operations';
import {Post} from '../../../../model/post';
import * as eventParser from '../../../../functions/utils/event-parser';
import * as parser from '../../../../functions/utils/base64-string-parser';

// Mock the dependencies
jest.mock('../../../../functions/db/db-operations');
jest.mock('../../../../functions/s3/s3-bucket-operations');

const POST_S3_BUCKET_NAME = 'S3_bucket_name';

const POST_CONTENT = 'base64encodedimage...';
const POST_DESCRIPTION = 'test';
const DB_RESULT = 'message';

describe('create-post handler', () => {
  it('should handle the creation of a post', async () => {
    // Mock the event object
    const event = {
      body: JSON.stringify({
        content: POST_CONTENT,
        description: POST_DESCRIPTION,
      }),
    };

    // Arrange
    jest.spyOn(eventParser, 'getAuthorizedUserId').mockReturnValue('1');
    jest.spyOn(db, 'add').mockResolvedValueOnce(new Post('1', '', ''));
    jest.spyOn(s3, 'upload').mockResolvedValueOnce({});
    jest.spyOn(parser, 'parseContentType').mockReturnValue('');

    // Act - Call the handler
    const result = await handler(event);

    // Assertions
    expect(db.add).toHaveBeenCalledWith(
      process.env.POST_TABLE_NAME,
      expect.any(Post)
    );
    expect(s3.upload).toHaveBeenCalledWith(
      undefined,
      expect.any(String),
      expect.any(String),
      expect.any(String)
    );
    expect(result.statusCode).toBe(HttpStatusCode.Ok);
    expect(result.body).toContain(DB_RESULT);
  });

  it('should handle errors during post creation', async () => {
    const event = {
      body: JSON.stringify({
        content: POST_CONTENT,
        description: POST_DESCRIPTION,
      }),
    };

    // Arrange
    jest.spyOn(eventParser, 'getAuthorizedUserId').mockReturnValue('1');
    jest.spyOn(db, 'add').mockRejectedValueOnce(new Error('Database error')); // Mock to reject with an error
    jest.spyOn(s3, 'upload').mockResolvedValueOnce({});
    jest.spyOn(parser, 'parseContentType').mockReturnValue('test');

    // Act - Call the handler
    const result = await handler(event);

    // Assertions
    expect(db.add).toHaveBeenCalledWith(
      process.env.POST_TABLE_NAME,
      expect.any(Post)
    );
    expect(result.statusCode).toBe(HttpStatusCode.InternalServerError);
    expect(result.body).toContain(DB_RESULT);
  });
});
