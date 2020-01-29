const mongoose = require("mongoose");

const smsSchema = mongoose.Schema({
  fullname:{type: String},
  otpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "phones"
  },
  Mobile: { required: true , type: String }
});



const schema = mongoose.model("userData", smsSchema);

module.exports = schema;