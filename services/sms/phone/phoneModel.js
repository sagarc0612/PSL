const mongoose = require("mongoose");

const phoneSchema = mongoose.Schema({
  phoneNo: { type: String, validate: /^$|^\d{10}$/ },
  Otp: { type: Number }
});

const schema = mongoose.model("phone", phoneSchema);

module.exports = schema;