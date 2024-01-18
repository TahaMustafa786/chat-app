const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const encryptPass = async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
};

const createJWTtoken = (_id) => {
  const jwt_key = process.env.JWT_SECRET;

  return jwt.sign({ _id }, jwt_key, { expiresIn: "1h" });
};

const Return500 = (res, error) => {
  return res.status(500).json({
    status: 500,
    message: "Internal Server Error",
    error: error.message,
  });
};

const Return200 = (res, message, payload) => {
  return res.status(200).json({ status: 200, message, ...payload });
};

const Return400 = (res, message, payload = null) => {
  if (payload == null) {
    return res.status(400).json({ status: 400, message });
  } else {
    return res.status(400).json({ status: 400, message, ...payload });
  }
};

const Return404 = (res, message, payload = null) => {
  if (payload == null) {
    return res.status(404).json({ status: 404, message });
  } else {
    return res.status(404).json({ status: 404, message, ...payload });
  }
};

const decryptPass = async (password, hashPass) => {
  const isPasswordValid = await bcrypt.compare(password, hashPass);
  return isPasswordValid;
};

module.exports = {
  encryptPass,
  createJWTtoken,
  Return500,
  Return200,
  Return400,
  Return404,
  decryptPass,
};
