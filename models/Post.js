const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, minLength: 3, maxLength: 100 },
  }, { timestamps: true });


// Export model
module.exports = mongoose.model("Post", PostSchema);