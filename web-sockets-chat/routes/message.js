const express = require("express");
const data = express.Router();
const {msg_model} = require("../models/message_model");


data.get("/",async (req,res)=>{
     try {
       let response =  await msg_model.find().limit(10);
       res.send(1);

     } catch (error) {
        res.send(error);
     }
})


data.post("/",async (req,res)=>{
    let {username,text,time} = req.body;
    try {
      let response =  await msg_model.insertMany([{username,text,time}]);
      res.send(response);

    } catch (error) {
       res.send(error);
    }
})



module.exports={data};

