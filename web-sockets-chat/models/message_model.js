const mongoose  = require("mongoose");

const sch = mongoose.Schema({
    username:{type:String},
    text:{type:String},
    time:{type:String},
    rooms:{type:String}
})


const msg_model = mongoose.model("message",sch);

module.exports={msg_model};