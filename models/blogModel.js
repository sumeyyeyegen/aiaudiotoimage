const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A Blog must have a title"],
      // unique: true,
      trim: true,
      minlength: [10, "blog title must have 10 character"],
      // validate: [validator.isAlpha, "NFT name must only contain Characters"],
    },
    content:{
      type: String,
      required: [true, "A Blog must have a title"],
      minlength: [10, "blog content have 10 character"],
    },
    categories:{
      type: String,
      required: [true, "A Blog must have one or more category"]
    },
    filename:{
      type:String,
      required:[true,"Blog must have a image"]
    },
    time:{
      type:String
    }
  }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;