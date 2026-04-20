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
    enduranceUserSignup: {
      executor: 'constant-vus',
      exec: 'userSignup',
      vus: 20,
      duration: '30m',
    },

    endurancePostCreate: {
      executor: 'constant-vus',
      exec: 'createPost',
      vus: 10,
      duration: '30m',
    },

    enduranceLikePost: {
      executor: 'constant-vus',
      exec: 'likePost',
      vus: 10,
      duration: '30m',
    },

    enduranceFollow: {
      executor: 'constant-vus',
      exec: 'followUser',
      vus: 7,
      duration: '20m',
    },

    enduranceFeed: {
      executor: 'constant-vus',
      exec: 'getFeed',
      vus: 10,
      duration: '30m',
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

  const ok = check(res, {
    'signup status is 200': (r) => r.status === 200,
  });
  if (!ok) console.log(`[endurance][signup FAIL] status=${res.status} body=${res.body}`);
}

export function createPost() {
  const payload = JSON.stringify({
    content: SMALL_IMAGE,
    description: 'k6 endurance test post',
  });

  const res = http.post(`${BASE_URL}/post`, payload, {
    headers: authHeaders(TEST_USER_ID),
  });

  const ok = check(res, {
    'create post status is 200': (r) => r.status === 200,
  });
  if (!ok) console.log(`[endurance][createPost FAIL] status=${res.status} body=${res.body}`);
}

export function likePost() {
  const res = http.post(
    `${BASE_URL}/post/${TEST_POST_ID}/like`,
    null,
    { headers: authHeaders(TEST_USER_ID) }
  );

  const ok = check(res, {
    'like post status is 200': (r) => r.status === 200,
  });
  if (!ok) console.log(`[endurance][likePost FAIL] status=${res.status} body=${res.body}`);
}

export function followUser() {
  const res = http.post(
    `${BASE_URL}/user/${TEST_TARGET_USER_ID}/follow`,
    null,
    { headers: authHeaders(TEST_USER_ID) }
  );

  const ok = check(res, {
    'follow user status is 200 or 409': (r) =>
      r.status === 200 || r.status === 409,
  });
  if (!ok) console.log(`[endurance][followUser FAIL] status=${res.status} body=${res.body}`);
}

export function getFeed() {
  const res = http.get(`${BASE_URL}/feed`, {
    headers: authHeaders(TEST_USER_ID),
  });

  const ok = check(res, {
    'get feed status is 200': (r) => r.status === 200,
  });
  if (!ok) console.log(`[endurance][getFeed FAIL] status=${res.status} body=${res.body}`);
}
