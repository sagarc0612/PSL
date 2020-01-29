const mongoose = require("mongoose");

const connectionSchema = mongoose.Schema(
  {
    who: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
  }
);

const schema = mongoose.model("connections", connectionSchema);

module.exports = schema;
