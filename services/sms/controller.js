const mongoose = require("mongoose");

const userRepo = require("./repo");
const phoneRepo = require("./phone/phoneRepo");

const sendOTP = async (req, res) => {
    try {
        const data = {
            id: mongoose.Types.ObjectId(),
            Mobile: req.body.Mobile
        };

        const phoneNo = "+91" + data.Mobile;

        const exist = await userRepo.isexisting(phoneNo);
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

            const dataentry = await phoneRepo.addPhoneAndOTP(dataObj);

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
        res.send({ success: false, message: err.name });
    }

};

const generateOTP = () => {
    return Math.floor(Math.random() * 10000) + 9999;
}

const verifyOTP = async (req, res) => {
    try {

        const data = {

            id: req.body.id,
            Otp: req.body.Otp,
            Mobile: req.body.Mobile
        };
        const phoneNo = "+91" + data.Mobile;

        const getdata = await getDataOfOTP(data.id);

        data.Mobile = phoneNo
        const exist = await userRepo.isexisting(data.Mobile);
        if (exist.length > 0) {
            res.send(
                {
                    success: false,
                    message: 'User Already Exists'
                });
        }

        const timeOfGenetedOtp = getdata.createdAt
        const currentTime = new Date();
        const diffMins = Math.round((((currentTime - timeOfGenetedOtp) % 86400000) % 3600000) / 60000);

        if (diffMins > 2) {

            await phoneRepo.deleteOTP(data.id);
            res.send({ success: false, message: "OTP Expired" });

        } else {

            if (getdata.Otp == data.Otp) {
                data.id = { otpId: data.id };
                const userDetail = await userRepo.addUserData(data);
                res.send(200,
                    {
                        userDetail,
                        success: true,
                        message: 'OTP Verification Successfull'
                    });
            } else {
                res.send({ success: false, message: "Invalid OTP" });
            }
        }
    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }
};

const getUserslist = async (req, res) => {
    try {
        const listOfUsers = await userRepo.getUsersList();

        res.send(200, {
            success: true,
            listOfUsers
        });
    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }
};

const deleteById = async (req, res) => {
    try {
        const { id } = req.body;
        const deleteUser = await userRepo.deleteUserById(id);

        res.send(200, {
            success: true,
            message: "Delete User Successfull"
        });
    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }
}

const getDataOfOTP = async (id) => {
    try {
        return phoneRepo.getOTPData(id);
    }
    catch (err) {
        res.send({ success: false, message: "Send OTP Again" });
    }
}

const getById = async (req, res) => {
    try {
        const { id } = req.body;
        const User = await userRepo.getUserById(id);

        res.send(200, {
            success: true,
            User,
            message: "Get User Successfull"
        });
    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }
}

const uploadPic = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            profileImage: req.file.path
        };

        data.profileImage = "file:" + data.profileImage;

        const updateUser = await userRepo.updateUser(data.id, data.profileImage);

        res.send(200, {
            success: true,
            updateUser,
            message: "Profile Update Successfull"
        });


    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }
}

// const getMessage = (req, res) => {
//     try{
//         const { id } = req.body;
//         const userMessages = await userRepo.getMessage(id);
//     }
//     catch(err){
//         res.send({ success: false, message: err.name });

//     }
// }


module.exports = {
    sendOTP,
    generateOTP,
    verifyOTP,
    getById,
    getUserslist,
    deleteById,
    uploadPic
}