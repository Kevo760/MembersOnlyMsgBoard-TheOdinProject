const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SecretSchema = new Schema({
    key: { type: String, required: true},
  });


// Export model
module.exports = mongoose.model("Upgrade", SecretSchema);