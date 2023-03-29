const express = require("express");
const app = express();
require("dotenv").config
app.use(express.json());








app.listen(process.env.port,()=>{
    console.log(`Server running at http://localhost:${process.env.port}`);
})