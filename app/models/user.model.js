const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    login:String,
    email: String,
    password: String,
    phone: String,
  })
);

module.exports = User;