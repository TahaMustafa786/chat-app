const express = require("express");
const router = express.Router();

const {
  register,
  login,
  findUser,
  getUsers,
} = require("../../Controllers/UserControllers/UserController");

router.post("/register", register);
router.post("/login", login);
router.get("/get-user/:id", findUser);
router.get("/get-users/", getUsers);

module.exports = router;
