const msgEntity = require("./services/sms/msg/msgModel.js");
const msgRepo = require("./services/sms/msg/msgRepo");
const repo = require("./services/sms/repo");

exports = module.exports = function (io) {
const conversation = [];
io.on('connection', socket => {
  socket.on('send-msg', async (userId) => {

    let messagesOfBothUsers;
    if (userId.phoneNumber !== undefined) {
      messagesOfBothUsers = await msgRepo.getByReceiverAndSenderIds(userId);
      conversation.push(messagesOfBothUsers);
      io.emit('get-msg', messagesOfBothUsers)
    }
    else {
      socket.users = { userId };
      const date = new Date(userId.createdAt);
      const milliseconds = date.getTime();
      userId.createdAt = milliseconds;
      const newUser = new msgEntity(userId);
      newUser.save();
      let lastMessage = await msgRepo.getLastId(userId.senderId)
      conversation;
      conversation.push(lastMessage);
      conversation.push(userId);
      io.emit('chatt-msg', lastMessage);
    }
  }),
    socket.on('disable-msg', async (userId) => {
      const changeMultiple = await Promise.all(
        userId.map(async msg => {
          let status;
          if (msg.isEveryOne) {
            status = {
              receiverStatus: true,
              senderStatus: true
            }
          } else {
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
          }
          return await msgRepo.updateStatusByMsgId(msg.messageId, status);
        })
      );
      io.emit('delete-msg', changeMultiple);
    })
})
};