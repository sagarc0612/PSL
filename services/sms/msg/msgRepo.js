const mongoose = require('mongoose');

const msgEntity = require("./msgModel");

const addMessage = async (userId) => {
    const newMessage = new msgEntity(userId);
    return newMessage.save();
}

const getLastId = async (id) => {
    return msgEntity.findOne({}).sort({ _id: -1 }).limit(1);
}

const getByReceiverAndSenderIds = async (data) => {
    return msgEntity.aggregate([{
        $match: {
            "$or": [{
                "$and": [
                    {
                        "receiverId": mongoose.Types.ObjectId(data.userId)
                    },
                    {
                        "senderId": mongoose.Types.ObjectId(data.senderId)
                    }
                ]
            },
            {
                "$and": [
                    {
                        "senderId": mongoose.Types.ObjectId(data.userId)
                    },
                    {
                        "receiverId": mongoose.Types.ObjectId(data.senderId)
                    }
                ]
            }]

        }
    }]);
}

const updateStatusByMsgId = async (_id, status) => {
    return await msgEntity.findOneAndUpdate({ _id }, { $set: status }, { new: true });
}

const deleteableMessages = async () => {
    return msgEntity.aggregate([{
        $match: {
            "$and": [
                {
                    "receiverStatus": true
                },
                {
                    "senderStatus": true
                }
            ]
        }
    }]);
}

const deleteById = async (id) => {
    return await msgEntity.findByIdAndRemove(id).exec();
}

const getuserByNumber = async(phone) => {
    return await msgEntity.find({"moblie":phone})
}

const getUserById = async (id) => {
    return msgEntity.find({$or:[ {"senderId":id}, {'receiverId':id}]});
}
const deleteableMessages = async () => {
    return msgEntity.aggregate([{
{
    $lookup: {
      from: "allocation",
      localField: "allocation",
      foreignField: "_id",
      as: "allocation"
    }
  },
  {
    $project: {
      to: 1,
      from: 1,
      allocation: {
        $arrayElemAt: ["$allocation", 0]
      }
    }
  },
  {
    $match: {
      from: hp,
      "allocation.product_allocation.municipality_id": mp
    }
  },
  {
    $count: "size"
  }
]);
    }


module.exports = {
    addMessage,
    getLastId,
    getByReceiverAndSenderIds,
    updateStatusByMsgId,
    deleteableMessages,
    deleteById,
    getuserByNumber,
    getUserById
}