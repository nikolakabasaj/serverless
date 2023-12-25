// create-post.integration.test.ts

import {handler} from '../../../../functions/post/create-post';
import * as db from '../../../../functions/db/db-operations';
import * as s3 from '../../../../functions/s3/s3-bucket-operations';
import * as eventParser from '../../../../functions/utils/event-parser';
import * as parser from '../../../../functions/utils/base64-string-parser';

jest.mock('../../../../functions/db/db-operations');
jest.mock('../../../../functions/s3/s3-bucket-operations');

const POST_CONTENT = 'base64encodedimage...';
const POST_DESCRIPTION = 'test';

describe('create-post handler (Integration Test)', () => {
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
    jest.spyOn(db, 'add').mockResolvedValueOnce({});
    jest.spyOn(s3, 'upload').mockResolvedValueOnce({});
    jest.spyOn(parser, 'parseContentType').mockReturnValue('');

    // Act - Call the handler
    const result = await handler(event);

    // Assertions
    expect(db.add).toHaveBeenCalledWith(
      process.env.POST_TABLE_NAME,
      expect.anything()
    );
    expect(s3.upload).toHaveBeenCalledWith(
      undefined,
      expect.any(String),
      expect.any(String),
      expect.any(String)
    );
    expect(result.statusCode).toBe(200);
  });
});
