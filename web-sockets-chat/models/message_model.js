const mongoose  = require("mongoose");

const sch = mongoose.Schema({
    username:{type:String},
    text:{type:String},
    time:{type:String}
})


const msg_model = mongoose.model("msg",sch);

module.exports={msg_model};