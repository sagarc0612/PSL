const mongoose = require("mongoose");



const userSchema = mongoose.Schema({
  id:mongoose.Schema.Types.ObjectId,
  firstname: {type: String},
  lastname: {type: String},
  username: {type: String},
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    },
  password: {
    type: String,
    minlength: 3,
    maxlength: 255
  },
  token:{type: String}
});


const schema = mongoose.model("user", userSchema);

module.exports = schema;