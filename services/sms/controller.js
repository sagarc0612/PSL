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
            res.send(
                {
                    success: false,
                    message: 'User Already Exists'
                });
        } else {

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
            res.send(200,
                {
                    success: true,
                    message: 'OTP Send Successfull',
                    id,
                    Otp
                });
        }
    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }

};

const generateOTP = () => {
    return Math.floor(Math.random() * 10000) + 9999;
}

const verifyOTP = async (req, res) => {
    try {
        const { id, Otp } = req.body;

        const getdata = await phoneEntity.getOTPData(id);
        const filter = { otpId: id };

        if (getdata.Otp == Otp) {
            const userDetail = await smsEntity.getUserByOtpId(filter);
            res.send(200,
                {
                    userDetail,
                    success: true,
                    message: 'OTP Verification Successfull'
                });
        } else {
            const deleteUserData = await smsEntity.deleteUser(filter);
            res.send({ success: false, message: "Invalid OTP" });
        }
    }
    catch (error) {
        res.send(error);
    }
};

const listUsers = async (req, res) => {
    try {
        const listOfUser = await smsEntity.getUsersList();

        return res.send(200, {
            success: true,
            listOfUser
        });
    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }
};

const deleteById = async (req, res) => {
    try {
        const { id } = req.body;
        const deleteUser = await smsEntity.deleteUserById(id);

        return res.send(200, {
            success: true,
            message: "Delete User Successfull"
        });
    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }
}

module.exports = {
    sendOTP,
    generateOTP,
    verifyOTP,
    listUsers,
    deleteById
}