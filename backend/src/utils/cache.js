const { getRedis } = require('./redis');

async function invalidateUserNotesCache(userId) {
  const redis = getRedis();
  if (!redis) return;
  // delete keys notes:userId:*
  const pattern = `notes:${userId}:*`;
  let cursor = '0';
  do {
    const result = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 50);
    cursor = result[0];
    const keys = result[1];
    if (keys.length) await redis.del(keys);
  } while (cursor !== '0');
}

module.exports = { invalidateUserNotesCache };
