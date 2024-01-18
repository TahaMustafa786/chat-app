const userModel = require("../../Models/UserModel");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const validator = require("validator");
const {
  encryptPass,
  createJWTtoken,
  Return500,
  Return200,
  Return400,
  Return404,
  decryptPass,
} = require("../../functions/functions");
const mongoose = require("mongoose");

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return Return400(res, error.message);
    }
    let isUserExists = await userModel.findOne({ email: value.email });
    if (isUserExists) {
      return Return400(res, "User Exists");
    }

    if (!validator.isStrongPassword(value.password)) {
      return Return400(res, "Password Must be a strong Password");
    }
    const user = new userModel(value);
    await encryptPass(user);
    const token = createJWTtoken(user._id);
    return Return200(res, "User Created", {
      user: { _id: user._id, name: value.name, email: value.email, token },
    });
  } catch (error) {
    return Return500(res, error);
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return Return400(res, error.message);
    }

    const user = await userModel.findOne({ email: value.email });
    if (!user) {
      return Return404(res, "User Does Not Exists");
    }
    const isPassValid = await decryptPass(value.password, user.password);
    if (!isPassValid) {
      return Return400(res, "Invalid Credentials");
    }

    const token = createJWTtoken(user._id);
    return Return200(res, "User Loggedin", {
      user: { _id: user._id, name: user.name, email: user.email, token },
    });
  } catch (error) {
    return Return500(res, error.message);
  }
};

const findUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Return400(res, "Not a valid mongo object id");
    }
    const user = await userModel.findById(id);
    if (!user) {
      return Return404(req, "User not found");
    }
    return Return200(res, "User Found", {
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return Return500(res, error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    if (users.length == 0) {
      return Return404(res, "No Users found");
    }
    return Return200(res, "Users", { users });
  } catch (error) {
    return Return500(res, error);
  }
};

module.exports = { register, login, findUser, getUsers };
