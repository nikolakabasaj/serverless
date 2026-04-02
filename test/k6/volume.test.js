import http from 'k6/http';
import { check } from 'k6';
import {
  BASE_URL,
  TEST_USER_ID,
  TEST_TARGET_USER_ID,
  TEST_POST_ID,
  SMALL_IMAGE,
  authHeaders,
  jsonHeaders,
  randomUsername,
} from './helpers/utils.js';

export const options = {
  scenarios: {
    volumeUserSignup: {
      executor: 'constant-vus',
      exec: 'userSignup',
      vus: 40,
      duration: '15m',
    },

    volumePostCreate: {
      executor: 'constant-vus',
      exec: 'createPost',
      vus: 20,
      duration: '10m',
    },

    volumeLikePost: {
      executor: 'constant-vus',
      exec: 'likePost',
      vus: 20,
      duration: '10m',
    },

    volumeFollow: {
      executor: 'constant-vus',
      exec: 'followUser',
      vus: 17,
      duration: '10m',
    },

    volumeFeed: {
      executor: 'constant-vus',
      exec: 'getFeed',
      vus: 20,
      duration: '10m',
    },
  },
};

export function userSignup() {
  const username = randomUsername();
  const payload = JSON.stringify({
    username: username,
    email: `${username}@test.com`,
    password: 'Test@1234!',
  });

  const res = http.post(`${BASE_URL}/auth/signup`, payload, {
    headers: jsonHeaders(),
  });

  check(res, {
    'signup status is 200': (r) => r.status === 200,
  });
}

export function createPost() {
  const payload = JSON.stringify({
    content: SMALL_IMAGE,
    description: 'k6 volume test post',
  });

  const res = http.post(`${BASE_URL}/post`, payload, {
    headers: authHeaders(TEST_USER_ID),
  });

  check(res, {
    'create post status is 200': (r) => r.status === 200,
  });
}

export function likePost() {
  const res = http.post(
    `${BASE_URL}/post/${TEST_POST_ID}/like`,
    null,
    { headers: jsonHeaders() }
  );

  check(res, {
    'like post status is 200': (r) => r.status === 200,
  });
}

export function followUser() {
  const res = http.post(
    `${BASE_URL}/user/${TEST_TARGET_USER_ID}/follow`,
    null,
    { headers: authHeaders(TEST_USER_ID) }
  );

  check(res, {
    'follow user status is 200 or 409': (r) =>
      r.status === 200 || r.status === 409,
  });
}

export function getFeed() {
  const res = http.get(`${BASE_URL}/feed`, {
    headers: authHeaders(TEST_USER_ID),
  });

  check(res, {
    'get feed status is 200': (r) => r.status === 200,
  });
}
