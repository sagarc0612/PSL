const phoneEntity = require("./phoneModel");

const addPhoneAndOTP = async (data) => {
    const PhoneAndOTP = new phoneEntity(data);
    return await PhoneAndOTP.save();
}

const getOTPData =async (_id) => {
//   const ff = await phoneEntity.findById({_id});
//   return ff
  return phoneEntity.findById(_id).exec();
}

const deleteOTP = async (id) => {
    return phoneEntity.findByIdAndDelete(id).lean().exec();
}

module.exports = {
    addPhoneAndOTP,
    getOTPData,
    deleteOTP
} 