const smsEntity = require("./model");

const isexisting = async (MobileNo) => {
    return await smsEntity.find({ "Mobile": MobileNo});
}

const addUserData = async(data) =>{
    const newUser = new smsEntity(data);
    return await newUser.save();
}

const getUserByOtpId = async (filter) =>{
    return smsEntity.find(filter).lean().exec();
}

module.exports = {
    isexisting,
    addUserData,
    getUserByOtpId,
}