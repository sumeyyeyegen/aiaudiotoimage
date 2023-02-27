const express = require("express");
const userControllers = require("./../controllers/userControllers");
const authControllers = require("./../controllers/authController")

const router = express.Router();

router.post("/signup",authControllers.signup);
router.post("/login",authControllers.login);

router.post("/forgotPassword",authControllers.forgotPassword);
router.post("/resetPassword",authControllers.resetPassword);

//ROUTERS USERS
router
  .route("/")
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

router
  .route("/:id")
  .get(userControllers.getSingleUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
