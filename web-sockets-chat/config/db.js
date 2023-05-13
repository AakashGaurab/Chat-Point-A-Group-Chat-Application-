require("dotenv").config();
const mongoose = require("mongoose");

const connect  = mongoose.connect(process.env.db_url);


module.exports={connect};
