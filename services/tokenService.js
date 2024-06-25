const IORedis = require('ioredis');

// Create a connection to your Redis server
const redisClient = new IORedis({
  host: 'localhost',
  port: 6379,
});

// Function to store tokens in Redis
const storeTokens = async (accessToken, refreshToken) => {
  console.log('Storing tokens:', accessToken, refreshToken); // Add log
  await redisClient.set('accessToken', accessToken);
  await redisClient.set('refreshToken', refreshToken);
};

// Function to get stored tokens from Redis
const getStoredTokens = async () => {
  const accessToken = await redisClient.get('accessToken');
  const refreshToken = await redisClient.get('refreshToken');

//   console.log('Retrieved tokens:', accessToken, refreshToken); // Add log

//   if (!accessToken) {
//     console.log('accessToken not found in storage');
//   }
//   if (!refreshToken) {
//     console.log('refreshToken not found in storage');
//   }

  return { accessToken, refreshToken };
};

module.exports = { storeTokens, getStoredTokens };
