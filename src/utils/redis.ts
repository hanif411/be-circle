import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient
  .connect()
  .then(() => {
    console.log("redis connected sucess");
  })
  .catch((err) => {
    console.log(err);
  });

export default redisClient;
