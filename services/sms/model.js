const mongoose = require("mongoose");

const smsSchema = mongoose.Schema({
  fullname: { type: String, default: null },
  otpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "phones"
  },
  dateOfBirth: { type: String, default: null },
  Mobile: {
    required: true, type: String,
    validate: /^((\+){1}91){1}[1-9]{1}[0-9]{9}$/
  },
  message: { type: String, default: null },
  profileImage: { type: String, default: null }
},
  { timestamps: true },
  { versionKey: false },
  { collection: "users" }
);

const schema = mongoose.model("users", smsSchema);

module.exports = schema;