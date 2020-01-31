const connectionEntity = require("./model");

const addConnections = async data => {
    const newConnections = new connectionEntity(data);
    return newConnections.save();
  };

const findConnectionCountByUsers = async (who, to) =>
connectionEntity.find({
    $or: [
      {
        who,
        to
      },
      {
        who: to,
        to: who
      }
    ]
  }).count();

module.exports = {
    addConnections,
    findConnectionCountByUsers
}