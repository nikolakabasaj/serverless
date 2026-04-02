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
    loadUserSignup_10u_2min: {
      executor: 'constant-arrival-rate',
      exec: 'userSignup',
      rate: 2,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 10,
      maxVUs: 10,
    },

    loadUserSignup_15u_5min: {
      executor: 'ramping-arrival-rate',
      exec: 'userSignup',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 11,
      maxVUs: 11,
      stages: [{ duration: '5m', target: 15 }],
    },

    loadPostCreate_10u_2min: {
      executor: 'constant-arrival-rate',
      exec: 'createPost',
      rate: 2,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 10,
      maxVUs: 10,
    },

    loadPostCreate_20u_5min: {
      executor: 'constant-arrival-rate',
      exec: 'createPost',
      rate: 3,
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 20,
      maxVUs: 20,
    },

    loadLikePost_10u_2min: {
      executor: 'constant-arrival-rate',
      exec: 'likePost',
      rate: 2,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 10,
      maxVUs: 10,
    },

    loadLikePost_20u_5min: {
      executor: 'constant-arrival-rate',
      exec: 'likePost',
      rate: 3,
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 20,
      maxVUs: 20,
    },

    loadFollowUser_10u_2min: {
      executor: 'constant-arrival-rate',
      exec: 'followUser',
      rate: 2,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 10,
      maxVUs: 10,
    },

    loadFollowUser_20u_5min: {
      executor: 'constant-arrival-rate',
      exec: 'followUser',
      rate: 4,
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 20,
      maxVUs: 20,
    },

    loadGetFeed_10u_2min: {
      executor: 'constant-arrival-rate',
      exec: 'getFeed',
      rate: 2,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 10,
      maxVUs: 10,
    },

    loadGetFeed_20u_5min: {
      executor: 'constant-arrival-rate',
      exec: 'getFeed',
      rate: 3,
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 20,
      maxVUs: 20,
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
    description: 'k6 load test post',
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
