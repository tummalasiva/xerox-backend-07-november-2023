const redis = require("redis");
const RedisConfig = {};
RedisConfig.config = async (url) => {
  const redisClient = redis.createClient({ url: url });
  try {
    await redisClient.connect();
  } catch (error) {
    console.log("Error while making connection to redis client: ", error);
  }
  redisClient.on("error", (err) => {
    console.log("Error while making connection to redis client: ", err);
  });
  global.redisClient = redisClient;
};
module.exports = RedisConfig;
