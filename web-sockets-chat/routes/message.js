const express = require("express");
const data = express.Router();
const {msg_model} = require("../models/message_model");


data.post("/",async (req,res)=>{
  let {rooms} = req.body;
     try {
       let response =  await msg_model.find({"rooms":rooms});
       res.json(response);

     } catch (error) {
        res.json(error);
     }
})


data.get("/",async (req,res)=>{
    let {username,text,time} = req.body;
    try {
      let response =  await msg_model.insertMany([{username,text,time}]);
      res.send(response);

    } catch (error) {
       res.send(error);
    }
})




module.exports={data};

