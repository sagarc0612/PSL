const smsEntity = require("./model");
<<<<<<< Updated upstream
=======
const mongoose = require("mongoose");
>>>>>>> Stashed changes

const isexisting = async (MobileNo) => {
    return smsEntity.find({ "Mobile": MobileNo });
}

const addUserData = async (data) => {
    const newUser = new smsEntity(data);
    return await newUser.save();
}

const getUserByOtpId = async (filter) => {
    return smsEntity.find(filter).lean().exec();
}

const getUsersList = async () => {
    return await smsEntity.find({}).lean().exec();
}

const deleteUser = async (filter) => {
    return smsEntity.findOneAndRemove(filter);
}

const deleteUserById = async (id) => {
    return smsEntity.findByIdAndDelete(id);
}

const updateUser = async (_id, data) => {
<<<<<<< Updated upstream
    return smsEntity.findOneAndUpdate({ _id }, { $set: {"profileImage" : data} }, { new: true });
}

const getUserById = async(id) => {
    return smsEntity.findById(id);
=======
    return smsEntity.findOneAndUpdate({ _id }, { $set: data }, { new: true });
}

const getUserById = async (id) => {
    return  smsEntity.findById(id); 
>>>>>>> Stashed changes
}

module.exports = {
    isexisting,
    addUserData,
    getUserByOtpId,
    getUsersList,
    deleteUser,
    deleteUserById,
    updateUser,
    getUserById
}