  const mongoose = require("mongoose");

const smsSchema = mongoose.Schema({
  fullname: { type: String },
  otpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "phones"
  },
  Mobile: {
    required: true, type: String,
    validate: /^((\+){1}91){1}[1-9]{1}[0-9]{9}$/
  },
<<<<<<< Updated upstream
  profileImage: { type: String }
=======
  token: {
    type: String
  },
  profileImage: { type: String, default: null },
  platform: {
    type: String
  }
>>>>>>> Stashed changes
},
  { timestamps: true },
  { collection: "users" }
);

const schema = mongoose.model("users", smsSchema);

module.exports = schema;