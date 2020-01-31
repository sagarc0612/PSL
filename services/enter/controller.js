const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserRepo = require("./repo");

const generateToken = userId => {
  const str = new Date().getTime().toString();
  return `${userId.toString()}#${str}`;
};

const createUser = async (req, res) => {
  try {
    const data = {
      _id: new mongoose.Types.ObjectId(),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    const isexisting = await UserRepo.findByEmail(req.body.email);
    if (isexisting) {
      return res.send("User already exist");
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    data.password = hashedPassword;
    const token = generateToken(data._id);
    const userData = {
      ...data,
      token
    };
    const result = await UserRepo.add(userData);

    res.send({ result, success: true, message: "User Created" });
  }
  catch (err) {
    res.send({ success: false, message: err.name });
  }
};


const userSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isexisting = await UserRepo.findByEmail(email);
    if (!isexisting) {
      res.send("user not exist");
    }

    const match = bcrypt.compareSync(password, isexisting.password);
    if (!match) {
      res.send("Password not Valid");
    }

    isexisting.token = generateToken(isexisting._id);

    const result = await isexisting.save();

    res.status(200).json({
      message: "login success",
      result: result
    });
  }

  catch (err) {
    res.send({ success: false, message: err.name });
  }
};

const deleteUser = async (req, res) => {
  try {
    const _id = req.body.id;

    await UserRepo.deleteUser(_id);

    res.status(200).json({
      message: "User Deleted"
    });
  }
  catch (err) {
    res.send({ success: false, message: err.name });
  }
};

const updateUser = async (req, res) => {
  try {

    const { token } = req.headers;
    const { id } = req.body;
    const existUser = await UserRepo.findUserById(id);

    if (!existUser) {
      res.send("User Not Exist");
    }

    if (token === existUser.token) {

      const data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
      }

      const result = await UserRepo.updateUser(existUser, data);

      res.send(result);
    }
  }
  catch (err) {
    res.send({ success: false, message: err.name });
  }
};

const userSignOut = async (req, res) => {
  try {
    await UserRepo.updateUser(req.body, {
      token: ''
    });
    res.send(200);
  } catch (err) {
    res.send({ success: false, message: err.name });
  }
};

const listUsers = async (req, res) => {
  try {
    const result = await UserRepo.getUsersList();

    res.send(200, { result });
  }
  catch (err) {
    res.send({ success: false, message: err.name });
  }
};


module.exports = {
  createUser,
  userSignin,
  deleteUser,
  updateUser,
  userSignOut,
  listUsers,
};
