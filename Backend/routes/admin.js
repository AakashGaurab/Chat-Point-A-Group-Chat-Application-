const express = require("express");
const admin = express.Router();
const {UserModel} = require("../Models/user_model");

admin.get("/read",async(req,res)=>{
    try {
        let data = await UserModel.find({});
        res.json(data);
    } catch (error) {
        res.status(404).send(error);
    }
})


admin.post("/create",async(req,res)=>{
    let payload = req.body;
    let {name,email,password} = payload;
    bcrypt.hash(password,process.env.salt,async(err,hash)=>{
        if(err){
            res.send("Error Hashing Password");
        }
        else {
            try {
                await UserModel.insertMany([{name,email,password:hash,role:"Admin"}]) 
                res.send("Admin Added Succesfully");
             } catch (error) {
                res.status(404).send(error);
             }
        }
    })
})


admin.put("/update",async(req,res)=>{
    let {email} = req.body;
    try {
        await UserModel.updateOne({email:email},{$set:{role:"Admin"}});
        res.send("User Updated To admin");

    } catch (error) {
        res.status(404).send(error);
    }
})


admin.delete("/delete",async(req,res)=>{
      try {
        await UserModel.deleteOne({email:email});
        res.send("User Removed from Data Base");
      } catch (error) {
        res.status(404).send("Error deleting user")
      }
})




module.exports={admin};
