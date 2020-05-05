const mongoose = require("mongoose");

const userRepo = require("./repo");
const phoneRepo = require("./phone/phoneRepo");
const msgRepo = require("./msg/msgRepo");

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
            Mobile: req.body.Mobile,
            token: req.body.token,
            platform: req.body.platform
        };
        const phoneNo = "+91" + data.Mobile;
        const getdata = await getDataOfOTP(data.id);

        data.Mobile = phoneNo
        const exist = await userRepo.isexisting(data.Mobile);
        if (exist.length > 0) {
<<<<<<< Updated upstream
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
                data.otpId = data.id;
                const userDetail = await userRepo.addUserData(data);
                res.send(200,
                    {
                        userDetail,
                        success: true,
                        message: 'OTP Verification Successfull'
                    });
            } else {
                res.send({ success: false, message: "Invalid OTP" });
=======
            exist[0].token = data.token
            res.send(200, {
                success: true,
                userDetail: {
                    Mobile: exist[0].Mobile,
                    _id: exist[0]._id,
                    fullname: exist[0].fullname,
                    dateOfBirth: exist[0].dateOfBirth,
                    profileImage: exist[0].profileImage,
                    token: exist[0].token,
                    platform: exist[0].platform
                },
                message: 'OTP Verification Successfull'
            });
        } else {
            const timeOfGenetedOtp = getdata.createdAt
            const currentTime = new Date();
            const diffMins = Math.round((((currentTime - timeOfGenetedOtp) % 86400000) % 3600000) / 60000);

            if (diffMins > 2) {
                await phoneRepo.deleteOTP(data.id);
                res.send({ success: false, message: "OTP Expired" });
            }
            else {
                if (getdata.Otp == data.Otp) {
                    data.otpId = data.id;
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
>>>>>>> Stashed changes
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
};

const getDataOfOTP = async (id) => {
    try {
        return phoneRepo.getOTPData(id);
    }
    catch (err) {
        res.send({ success: false, message: "Send OTP Again" });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const User = await userRepo.getUserById(id);

        res.send(200, {
            success: true,
            User,
            message: "Profile Update Successfull"
        });
    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }
};

const uploadPic = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            profileImage: req.file.path
        };

<<<<<<< Updated upstream
        data.profileImage = "file:" + data.profileImage;

        const updateUser = await userRepo.updateUser(data.id, data.profileImage);

        res.send(200, {
            success: true,
            updateUser,
            message: "Profile Update Successfull"
=======
            res.send(200, {
                success: true,
                updateUser,
                message: "Profile Update Successfull"
            });
        } else {
            res.send({ success: false, message: "User Not Exist" });
        }
    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }
};

const updateStatusByMsgId = async (req, res) => {
    try {
        const { id, userId } = req.body;
        let status;
        if (userId.receiverId) {
            status = {
                receiverStatus: true
            }
        }
        else if (userId.senderId) {
            status = {
                senderStatus: true
            }
        }
        const changeStatus = await msgRepo.updateStatusByMsgId(id, status);

        res.send(200, {
            success: true,
            message: "Selected Message Successfully Deleted"
        });
    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }
}

const multipleUpdateMessages = async (req, res) => {
    try {
        const msgIds = req.body;
        const changeMultiple = await Promise.all(
            msgIds.map(async msg => {
                let status;
                if (msg.receiverId !== "") {
                    status = {
                        receiverStatus: true
                    }
                }
                if (msg.senderId !== "") {
                    status = {
                        senderStatus: true
                    }
                }
                const changeStatus = await msgRepo.updateStatusByMsgId(msg.messageId, status);
                return {
                    ...msg,
                    msgId: msg.messageId,
                    changeStatus
                };
            })
        );
        res.send(200, {
            success: true,
            message: "Selected Messages Successfully Deleted",
            changeMultiple
>>>>>>> Stashed changes
        });
    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }
}

<<<<<<< Updated upstream
=======
const deleteMessage = async (req, res) => {
    try {
        const deleteableMessages = await msgRepo.deleteableMessages();
        const changeMultiple = await Promise.all(
            deleteableMessages.map(async msg => {
                const changeStatus = await msgRepo.deleteById(msg);
                return {
                    ...msg,
                };
            })
        );
        res.send(200, {
            success: true,
            message: "Messages Permenent Deleted",
        });
    }
    catch (err) {
        res.send({ success: false, message: err.name });
    }
}

const getConnectedUser = async (req, res) => {
    try {
        const { userId } = req.body
        let connectedArray = [];
        let connectedPhoneNo = [];
        let receiver = await msgRepo.getUserById(userId);
        for (i = 0; i < receiver.length; i++) {
            let senderId = receiver[i].senderId;
            let receiverId = receiver[i].receiverId;
            connectedArray.push(senderId.toString(), receiverId.toString());
        }
        let connectedIds = connectedArray.filter((item, i, ar) => ar.indexOf(item) === i);

        for (j = 0; j < connectedIds.length; j++) {
            let getUserPhoneNo = await userRepo.getUserById(connectedIds[j]);
            let data = {
                Mobile: getUserPhoneNo.Mobile, profileImage: getUserPhoneNo.profileImage, id: getUserPhoneNo.id
            }

            connectedPhoneNo.push(data);
        }
        res.send(200, {
            success: true,
            connectedPhoneNo
        });

    } catch (err) {
        res.send({ success: false, message: err.name });
    }
}

const receiverAndSenderIds = async (req, res) => {
    try {

        const  userId  = req.body

        const receiverAndSenderIds = await msgRepo.getByReceiverAndSenderIds(userId);

        res.send(200, {
            success: true,
            receiverAndSenderIds
        });
    }

    catch (err) {
        res.send({ success: false, message: err.name });
    }

}

>>>>>>> Stashed changes
module.exports = {
    sendOTP,
    generateOTP,
    verifyOTP,
    getById,
    getUserslist,
    deleteById,
<<<<<<< Updated upstream
    uploadPic
=======
    updatePicAndUser,
    updateStatusByMsgId,
    multipleUpdateMessages,
    deleteMessage,
    getConnectedUser,
    receiverAndSenderIds
>>>>>>> Stashed changes
}