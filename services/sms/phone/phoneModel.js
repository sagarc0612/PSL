const mongoose = require("mongoose");

const phoneSchema = mongoose.Schema({
  phoneNo: {
    type: String,
    validate: /^((\+){1}91){1}[1-9]{1}[0-9]{9}$/
  },
  Otp: { type: Number }
});

const schema = mongoose.model("phone", phoneSchema);

module.exports = schema;