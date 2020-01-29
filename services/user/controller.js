const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.authToken);

const userEntity = require("./repo");
const userModel = require("./model");

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

    const isexisting = await userEntity.findByEmail(req.body.email);
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
    const result = await userEntity.add(userData);

    return res.send(result).json({ message: "User Created" });
  }
  catch (err) {
    res.send(err);
  }
};


const userSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isexisting = await userEntity.findByEmail(email);
    if (!isexisting) {
      return res.send("user not exist");
    }

    const match = bcrypt.compareSync(password, isexisting.password);
    if (!match) {
      return res.send("Password not Valid");
    }

    isexisting.token = generateToken(isexisting._id);

    const result = await isexisting.save();

    return res.status(200).json({
      message: "login success",
      result: result
    });
  }

  catch (err) {
    res.send(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const _id = req.body.id;

    await userEntity.deleteUser(_id);

    return res.status(200).json({
      message: "user deleted"
    });
  }
  catch (err) {
    res.send(err);
  }
};

const updateUser = async (req, res) => {
  try {

    const { token } = req.headers;
    const { id } = req.body;
    const existUser = await userEntity.findUserById(id);

    if (!existUser) {
      return res.send("User Not exist");
    }

    if (token === existUser.token) {

      const data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
      }

      const result = await userEntity.updateUser(existUser, data);

      return res.send(result);
    }
  }
  catch (err) {
    res.send(err);
  }
};

const userSignOut = async (req, res) => {
  try {
    await userEntity.updateUser(req.body, {
      token: ''
    });
    return res.send(200);
  } catch (err) {
    res.send(err);
  }
};

const listUsers = async (req, res) => {
 
 
  const result = await userEntity.getUsersList();
     
  return res.send(200, {
    result
  });
};


module.exports = {
  createUser,
  userSignin,
  deleteUser,
  updateUser,
  userSignOut,
  listUsers,
 };
