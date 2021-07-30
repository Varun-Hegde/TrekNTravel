const mongoose = require("mongoose");
const schema = mongoose.Schema;

const socketModel = new schema({
  userId: {
    type: "String",
  },
  socketId: {
    type: "String",
  },
});
const sockets = mongoose.model("Socket", socketModel);

module.exports = sockets;
