const mongoose = require("mongoose");

const msgSchema = mongoose.Schema({

  senderId: { type: mongoose.Schema.Types.ObjectId },
  message: { type: String, default: null },
  receiverId: { type: mongoose.Schema.Types.ObjectId },
  createdAt: { type: Date }
},
  { versionKey: false },
  { collection: "message" }
);

const schema = mongoose.model("msg", msgSchema);

module.exports = schema;