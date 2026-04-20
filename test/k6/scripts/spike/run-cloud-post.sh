#!/bin/bash
# Spike test — samo createPost scenario, maxVUs: 30
k6 cloud run \
  --env BASE_URL=https://znd45r22s6.execute-api.eu-central-1.amazonaws.com/prod \
  --env TEST_USER_ID=f7585756-0b40-4ae8-ace7-cc390f8dbedb \
  --env TEST_TARGET_USER_ID=3fc3625a-7ac4-48ff-9553-1bb962103b78 \
  --env TEST_POST_ID=bff53aca-29ad-4a26-a6e7-89637ce14d1f \
  --env SCENARIO=post \
  test/k6/spike.test.js
