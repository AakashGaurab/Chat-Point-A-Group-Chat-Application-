const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "User",
    enum: ["Admin", "User"],
  },
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
