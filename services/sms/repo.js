const smsEntity = require("./model");

const isexisting = async (MobileNo) => {
    return await smsEntity.find({ "Mobile": MobileNo });
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

module.exports = {
    isexisting,
    addUserData,
    getUserByOtpId,
    getUsersList,
    deleteUser,
    deleteUserById
}