const jwt = require("jsonwebtoken");

require("dotenv").config();

const { createClient } = require("redis");

const myredis = createClient({
  url: "redis://default:u2Pl4XkTWzqr9N1XkOUzsKZ0qnsAxqwf@redis-14012.c264.ap-south-1-1.ec2.cloud.redislabs.com:14012",
});

myredis.on("error", (err) => console.log("Redis Client Error", err));

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  await myredis.connect();

  const red_token = await myredis.get("token");
  await myredis.disconnect();
  if (!token) {
    console.log("access denied");
    res.send("Please login first");
  } else {
    if (token == red_token) {
      res.send("please login again");
    } else {
      jwt.verify(token, process.env.JWT, (err, decoded) => {
        if (decoded) {
          next();
        } else {
          res.send("Please login first");
        }
      });
    }
  }
};

module.exports = {
  authenticate,
};
