const connection = require("./config/db.js");
const mongoose=require("mongoose")
const express = require("express");
const {user} = require("./routes/user")
const {admin} = require("./routes/admin")
const cors = require("cors");
const app = express();

app.use(cors({origin:"*"}))

app.use(express.json());
app.use ("/admin",admin);
app.use("/user",user)


app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
