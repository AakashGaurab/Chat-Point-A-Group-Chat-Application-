const express = require("express");
const bcrypt = require("bcrypt");
const jwt = requrie("jsonwebtoken");
const admin = express.Router();


app.get("/read",async(req,res)=>{
    try {
        let data = await user_model.find({});
        res.json(data);
    } catch (error) {
        res.status(404).send(error);
    }
})


app.post("/create",async(req,res)=>{
    let payload = req.body;
    let {name,email,password} = payload;
    bcrypt.hash(password,process.env.salt,async(err,hash)=>{
        if(err){
            res.send("Error Hashing Password");
        }
        else {
            try {
                await user_model.insertMany([{name,email,password:hash,role:"Admin"}]) 
                res.send("Admin Added Succesfully");
             } catch (error) {
                res.status(404).send(error);
             }
        }
    })
})


app.put("/update",async(req,res)=>{
    let {email} = req.body;
    try {
        await user_model.updateOne({email:email},{$set:{role:"Admin"}});
        res.send("User Updated To admin");

    } catch (error) {
        res.status(404).send(error);
    }
})


app.delete("/delete",async(req,res)=>{
      try {
        await user_model.deleteOne({email:email});
        res.send("User Removed from Data Base");
      } catch (error) {
        res.status(404).send("Error deleting user")
      }
})




module.exports={admin};
