const connection = require("./config/db.js");
const mongoose = require("mongoose");
const express = require("express");
const { user } = require("./routes/user");
const { admin } = require("./routes/admin");


const app = express();
app.use(cors())

app.use(cors({origin:"*"}))

app.use(express.json());

app.use("/admin", admin);
app.use("/user", user);
// const {admin} = require("./routes/admin");

// require("dotenv").config();

// const myredis = createClient({
//   url: "",
// });

// myredis.on("error", (err) => console.log("Redis Client Error", err));

// app.get("/", (req, res) => {
//   res.send("welcome user");
// });

// app.get("/protected", authenticate, (req, res) => {
//   res.send("only verified users can use this");
// });



app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
