const Redis = require('ioredis');
const { REDIS_URL } = require('../config');
let client = null;
function getRedis() {
  if (!REDIS_URL) return null;
  if (!client) client = new Redis(REDIS_URL);
  return client;
}
module.exports = { getRedis };
