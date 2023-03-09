const express = require("express");
const blogController = require("../controllers/blogController");
const authController = require("../controllers/authController");
const multer = require('multer');
const router = express.Router();

//ROUTER Blogs
router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(blogController.uploadImg ,blogController.createBlog);

router
  .route("/:id")
  .get(blogController.getSingleBlog)
  .delete(authController.protect ,authController.restrictTo("admin","guide","user") , blogController.deleteBlog);

module.exports = router;
 