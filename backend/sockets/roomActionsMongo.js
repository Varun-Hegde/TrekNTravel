const Socket = require("../models/socketModel");
const asyncHandler = require("express-async-handler");

const getUsers = asyncHandler(async () => {
  const users = await Socket.find({});
  return users;
});

const addUser = asyncHandler(async (userId, socketId) => {
  let user = await Socket.findOne({ userId });

  if (!user) {
    console.log("Creating new ser\n");
    const newUser = new Socket({ userId, socketId });
    await newUser.save();
    return getUsers();
  }

  if (user && user.socketId == socketId) return getUsers();
  else {
    if (user && user.socketId !== socketId) {
      await removeUser(user.socketId);
    }
    const newUser = new Socket({ userId, socketId });
    await newUser.save();
    return getUsers();
  }
});

const findConnectedUser = asyncHandler(async (userId) => {
  const user = await Socket.findOne({ userId });
  return user;
});

const removeUser = asyncHandler(async (socketId) => {
  const deletedUser = await Socket.deleteOne({ socketId });
  console.log("====================================");
  console.log("Iam here");
  console.log("Given socket id", socketId);

  console.log("====================================");
  console.log(deletedUser);
  return getUsers();
});

module.exports = { addUser, findConnectedUser, removeUser };
