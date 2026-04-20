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

const SCENARIO = __ENV.SCENARIO;

const allScenarios = {
  spikeUserSignup: {
    executor: 'ramping-arrival-rate',
    exec: 'userSignup',
    startRate: 1,
    timeUnit: '1s',
    preAllocatedVUs: 10,
    maxVUs: 30,
    stages: [
      { duration: '1m', target: 20 },
      { duration: '3m', target: 20 },
      { duration: '1m', target: 10 },
    ],
  },
  spikePostCreate: {
    executor: 'ramping-arrival-rate',
    exec: 'createPost',
    startRate: 1,
    timeUnit: '1s',
    preAllocatedVUs: 10,
    maxVUs: 30,
    stages: [
      { duration: '1m', target: 15 },
      { duration: '3m', target: 15 },
      { duration: '1m', target: 10 },
    ],
  },
  spikeLikePost: {
    executor: 'ramping-arrival-rate',
    exec: 'likePost',
    startRate: 1,
    timeUnit: '1s',
    preAllocatedVUs: 10,
    maxVUs: 30,
    stages: [
      { duration: '1m', target: 20 },
      { duration: '3m', target: 20 },
      { duration: '1m', target: 10 },
    ],
  },
  spikeFollow: {
    executor: 'ramping-arrival-rate',
    exec: 'followUser',
    startRate: 1,
    timeUnit: '1s',
    preAllocatedVUs: 10,
    maxVUs: 30,
    stages: [
      { duration: '1m', target: 20 },
      { duration: '3m', target: 20 },
      { duration: '1m', target: 10 },
    ],
  },
  spikeFeed: {
    executor: 'ramping-arrival-rate',
    exec: 'getFeed',
    startRate: 1,
    timeUnit: '1s',
    preAllocatedVUs: 10,
    maxVUs: 30,
    stages: [
      { duration: '1m', target: 20 },
      { duration: '3m', target: 20 },
      { duration: '1m', target: 10 },
    ],
  },
};

const scenarioMap = {
  signup: 'spikeUserSignup',
  post: 'spikePostCreate',
  like: 'spikeLikePost',
  follow: 'spikeFollow',
  feed: 'spikeFeed',
};

function getScenarios() {
  if (!SCENARIO) return allScenarios;
  const key = scenarioMap[SCENARIO];
  return key ? { [key]: allScenarios[key] } : allScenarios;
}

export const options = {
  scenarios: getScenarios(),
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
  if (!ok) console.log(`[spike][signup FAIL] status=${res.status} body=${res.body}`);
}

export function createPost() {
  const payload = JSON.stringify({
    content: SMALL_IMAGE,
    description: 'k6 spike test post',
  });

  const res = http.post(`${BASE_URL}/post`, payload, {
    headers: authHeaders(TEST_USER_ID),
  });

  const ok = check(res, {
    'create post status is 200': (r) => r.status === 200,
  });
  if (!ok) console.log(`[spike][createPost FAIL] status=${res.status} body=${res.body}`);
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
  if (!ok) console.log(`[spike][likePost FAIL] status=${res.status} body=${res.body}`);
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
  if (!ok) console.log(`[spike][followUser FAIL] status=${res.status} body=${res.body}`);
}

export function getFeed() {
  const res = http.get(`${BASE_URL}/feed`, {
    headers: authHeaders(TEST_USER_ID),
  });

  const ok = check(res, {
    'get feed status is 200': (r) => r.status === 200,
  });
  if (!ok) console.log(`[spike][getFeed FAIL] status=${res.status} body=${res.body}`);
}
