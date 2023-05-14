const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createClient } = require("redis");
const UserModel = require("../Models/user_model");
const { authenticate } = require("../middleware/authentacation");
const express = require("express")
const user = express.Router()
require("dotenv").config();

const myredis = createClient({
  url: "redis://default:u2Pl4XkTWzqr9N1XkOUzsKZ0qnsAxqwf@redis-14012.c264.ap-south-1-1.ec2.cloud.redislabs.com:14012",
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
user.post("/register", async (req, res) => {                   //create a new User 
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
user.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.find({ email });

  const match = await bcrypt.compare(password, user[0].password);

  if (match) {
    const token = jwt.sign({ email }, process.env.JWT, { expiresIn: "1h" });
    const ref_token = jwt.sign({ email }, process.env.REF_JWT, {
      expiresIn: "5h",
    });

    res.send({ msg: "login successful", token, ref_token });
  } else {
    res.send("Wrong Credentials");
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
user.get("/logout", async (req, res) => {                   //  logout user 
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

module.exports = { user }