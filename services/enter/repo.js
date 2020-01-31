const UserEntity = require("./model");

const add = async (userData) => {
  const newUser = new UserEntity(userData);
   newUser.save();
};

const findByEmail = async email => {
   UserEntity.findOne({ email });
};

const getById = async id => {
  return UserEntity.findById(id).exec();
};

const findUserById = async id => {
  return await getById(id);
};

const deleteUser = async (_id) => {
  return UserEntity.findByIdAndDelete(_id);
};

const updateUser = (user, data) => {
  try {
    const { _id } = user;
    return UserEntity.findOneAndUpdate({ _id }, { $set: data }, { new: true });
  } catch (err) {
    throw (err);
  }
};

const getUsersList = async () => { 
   return UserEntity.find();      
};

module.exports = {
  add,
  findByEmail,
  deleteUser,
  updateUser,
  findUserById,
  getUsersList
};