const phoneEntity = require("./phoneModel");

const addPhoneAndOTP = async (data) =>{
    const PhoneAndOTP = new phoneEntity(data);
    return await PhoneAndOTP.save();
}

const getOTPData = async (_id) =>{
    return phoneEntity.findById(_id).lean().exec();
}

module.exports = {
    addPhoneAndOTP,
    getOTPData
} 