const smsEntity = require("./model");

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
    return await smsEntity.find().lean().exec();
};

const deleteUser = async (filter) => {
    return smsEntity.findOneAndRemove(filter);
};

const deleteUserById = async (id) => {
    return smsEntity.findByIdAndDelete(id);
}

const updateUser = async (_id, data) => {
    return smsEntity.findOneAndUpdate({ _id }, { $set: {"profileImage" : data} }, { new: true });
  };

const getUserById = async(id) => {
    return smsEntity.findById(id);
}

const getMessage = async(id) => {
    return await smsEntity.find().lean().exec();
};

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