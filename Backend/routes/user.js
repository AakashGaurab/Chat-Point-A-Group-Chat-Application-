const bcrypt = require("bcryptjs");
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

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Welcome message for users
 *     description: Returns a welcome message for users accessing the API
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: welcome user
 */
user.get("/", (req, res) => {
  res.send("welcome user");
});

user.get("/userdata", authenticate, authorise(["User"]), (req, res) => {
  res.send("this is the main page for users");
});

/**
 * @swagger
 * /user/protected:
 *   get:
 *     summary: Only verified users can access this endpoint
 *     description: Returns a message for verified users accessing the API
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: only verified users can use this
 *       401:
 *         description: Unauthorized
 */
user.get("/protected", authenticate, (req, res) => {
  res.send("only verified users can use this");
});


  //create a new User


/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with a name, email, and password
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or registration failed
 */
user.post("/register", async (req, res) => { 
  try{                  //create a new User 

  const { name, email, password } = req.body;

  const already_exists = await UserModel.find({ email });
  if (already_exists.length > 0) {
    res.send("User already exists");
  } else {
    const hashed_pass = await bcrypt.hash(password, 8)
    console.log(hashed_pass);
      req.body.password=hashed_pass;
      const user = await new UserModel({ name, email,password: req.body.password});
      user.save();
      res.send({msg:`user registered successfully`});
  }
}catch(err){
  console.log(err);
}
});


  //  login a user


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login endpoint
 *     description: Endpoint for user login
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: mypassword123
 *     responses:
 *       '200':
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Login success message
 *                   example: login successful
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *                 ref_token:
 *                   type: string
 *                   description: Refresh token for authentication
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       '401':
 *         description: Wrong credentials supplied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Wrong Credentials
 */
user.post("/login", async (req, res) => {         //  login a user 

  const { email, password } = req.body;
  
  const user = await UserModel.find({ email });
  console.log(user)

  const match = await bcrypt.compare( password,user[0].password);
  console.log(match)

  if (match) {
    const token = jwt.sign({ userId: user[0] }, process.env.JWT, {
      expiresIn: "1h",
    });
    const ref_token = jwt.sign({ userId: user[0] }, process.env.REF_JWT, {
      expiresIn: "5h",
    });

    res.send({ msg: "login successful", token, ref_token });
  } else {
    res.send({msg:"wrong credential"});
  }
});

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Logout user
 *     description: This endpoint allows a logged-in user to logout by invalidating the JWT token and storing it in Redis cache.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: logout successful
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
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
