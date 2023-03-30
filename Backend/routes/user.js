const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { createClient } = require("redis");

const UserModel = require("../Models/user_model");

const { authenticate } = require("../middleware/authentacation");

const { authorise } = require("../middleware/authorization.js");

const express = require("express");
const user = express.Router();
require("dotenv").config();

const myredis = createClient({
  url: process.env.REDIS_URL,
});

myredis.on("error", (err) => console.log("Redis Client Error", err));

user.get("/", (req, res) => {
  res.send("welcome user");
});

user.get("/userdata", authenticate, authorise(["User"]), (req, res) => {
  res.send("this is the main page for users");
});

user.get("/protected", authenticate, (req, res) => {
  res.send("only verified users can use this");
});

user.post("/register", async (req, res) => {
  //create a new User
  const { name, email, password } = req.body;

  const already_exists = await UserModel.find({ email });
  if (already_exists.length > 0) {
    res.send("User already exists");
  } else {
    const hashed_pass = bcrypt.hash(password, 8, async (err, result) => {
      if (err) {
        res.send("registration failed");
      }
      const user = await new UserModel({ name, email, password: result });
      user.save();
      res.send("user registered successfully");
    });
  }
});

user.post("/login", async (req, res) => {
  //  login a user
  const { email, password } = req.body;

  const user = await UserModel.find({ email });

  const match = await bcrypt.compare(password, user[0].password);

  if (match) {
    const token = jwt.sign({ userId: user[0] }, process.env.JWT, {
      expiresIn: "1h",
    });
    const ref_token = jwt.sign({ userId: user[0] }, process.env.REF_JWT, {
      expiresIn: "5h",
    });

    res.send({ msg: "login successful", token, ref_token });
  } else {
    res.send("Wrong Credentials");
  }
});

user.get("/logout", async (req, res) => {
  //  logout user
  const token = req.headers.authorization;
  if (!token) {
    res.send("Please login first");
  } else {
    await myredis.connect();
    await myredis.set("token", token);
    // const red_token = await myredis.get("token");
    // console.log("redis_token", red_token);
    await myredis.disconnect();
    res.send("logout successful");
  }
});

// refresh token
user.get("/newtoken", (req, res) => {
  const refresh_token = req.headers.authorization;
  if (!refresh_token) {
    res.send({ msg: "please login first" });
  } else {
    jwt.verify(refresh_token, process.env.REF_JWT, (err, decoded) => {
      if (err) {
        res.send({ msg: "please login again" });
      } else {
        const token = jwt.sign({ userId: decoded.userId }, process.env.JWT, {
          expiresIn: "1h",
        });
        res.cookie("signintoken", token);
        res.send({ msg: "login successful", token });
      }
    });
  }
});

module.exports = {
  user,
};
