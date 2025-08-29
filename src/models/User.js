const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  token: { type: String },
  tokenExpiry: { type: Date }
});

module.exports = mongoose.model("User", userSchema);
