const mongoose = require("mongoose");
const validator = require("validator");

const PostSchema = mongoose.Schema({
  url: {
    type: String,
    required: [true, "require image"]
  },
  title: {
    type: String,
    required: [true, "require title"]
  },
  description: {
    type: String,
    required: [true, "require description"]
  },
  price: {
    type: Number,
    required: [true, "require description"]
  }
});

var Post = mongoose.model("posts", PostSchema);

module.exports = Post;
