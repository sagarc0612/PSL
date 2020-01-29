const mongoose = require("mongoose");

const smsEntity = require("./repo");
const phoneEntity = require("./phone/phoneRepo");

const sendOTP = async (req, res) => {
    try {
        const userdata = {
            id: mongoose.Types.ObjectId(),
            fullname: req.body.fullname,
            Mobile: req.body.Mobile
        };

        const phoneNo = "+91" + userdata.Mobile;

        const exist = await smsEntity.isexisting(phoneNo);

        if (exist.length > 0) {

            res.send({success: false , message: 'User Already Exists' });
        }

        else {

            const Otp = generateOTP();

            const dataObj = {
                phoneNo,
                Otp
            }

            const dataentry = await phoneEntity.addPhoneAndOTP(dataObj);
            userdata.otpId = dataentry.id;
            userdata.Mobile = phoneNo
            await smsEntity.addUserData(userdata);
            const id = dataentry.id
                res.send(200, {
                success: true,
                message: 'OTP Send Successfull',
                id,
                Otp
            });
        }
    }
    catch (err) {
        res.send({success: false , message : err.name});
    }

};

const generateOTP = () => {
    return Math.floor(Math.random() * 10000) + 9999;
}

const verifyOTP = async (req, res) => {
    try {
        const { id, Otp } = req.body;

        const getdata = await phoneEntity.getOTPData(id);

        if (getdata.Otp == Otp) {
            const filter = { otpId: id };
            const userDetail = await smsEntity.getUserByOtpId(filter);
            res.send(200, { userDetail, success: true, message: 'OTP Verification Successfull' });

        }
        else {
            res.send({success: false, message: "Invalid OTP" });
        }
    }
    catch (error) {
        res.send(error);
    }
};

module.exports = {
    sendOTP,
    generateOTP,
    verifyOTP
}