import encoding from 'k6/encoding';

export const BASE_URL = __ENV.BASE_URL;

// Pre-seeded test user IDs — set via env vars when running k6
// Example: k6 run --env BASE_URL=https://... --env TEST_USER_ID=abc-123 ...
export const TEST_USER_ID = __ENV.TEST_USER_ID || 'test-user-id';
export const TEST_TARGET_USER_ID = __ENV.TEST_TARGET_USER_ID || 'test-target-user-id';
export const TEST_POST_ID = __ENV.TEST_POST_ID || 'test-post-id';

// Minimal valid 1x1 JPEG (base64) for normal load tests
export const SMALL_IMAGE =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDB' +
  'QNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARC' +
  'AABAAEDAREAAQIDAQIDAQID/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAA' +
  'AAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwD' +
  'AQACEQMRAAT8AJQAB/9k=';

// Large image for volume tests (~50 KB encoded payload)
export const LARGE_IMAGE = 'data:image/jpeg;base64,' + 'A'.repeat(65536);

/**
 * Generates a fake JWT token accepted by the no-auth branch.
 * API Gateway authorization is disabled on that branch, so Lambda
 * only decodes the payload without verifying the signature.
 *
 * @param {string} userId - UUID of the user stored in DynamoDB
 */
export function generateFakeToken(userId) {
  const header = encoding.b64encode(
    JSON.stringify({ alg: 'HS256', typ: 'JWT' })
  );
  const payload = encoding.b64encode(
    JSON.stringify({
      sub: userId,
      email: `${userId}@test.com`,
      'custom:userId': userId,
    })
  );
  return `${header}.${payload}.fake_signature`;
}

export function authHeaders(userId) {
  return {
    'Content-Type': 'application/json',
    Authorization: generateFakeToken(userId),
  };
}

export function jsonHeaders() {
  return { 'Content-Type': 'application/json' };
}

export function randomUsername() {
  return `testuser_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
}
