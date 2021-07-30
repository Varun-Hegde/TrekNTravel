const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const socketIo = require("socket.io");
const SocketsDB = require("./models/socketModel");
const connectDb = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const {
  addUser,
  removeUser,
  findConnectedUser,
} = require("./sockets/roomActionsMongo");
const {
  loadMessages,
  sendMsg,
  setMsgToUnread,
} = require("./sockets/messageActions");
const { likeOrUnlikePost } = require("./sockets/likeOrUnlikePost");

dotenv.config();
connectDb();
const app = express();

//IMPORT ROUTES
const campgroundRoutes = require("./routes/campgroundRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const followRoutes = require("./routes/followRoutes");
const tagRoutes = require("./routes/tagRoutes");
const searchRoutes = require("./routes/searchRoute");
const notificationRoute = require("./routes/notificationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const resetPassword = require("./routes/resetPassword");

//MIDDLEWARE
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cookieParser());

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

/* app.use(passport.initialize()) */
//FOR storing uploaded files locally:
//app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

//Prevent Mongo Injections
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

//ROUTES
app.get("/", (req, res) => {
  res.send("API is running");
});

//CAMPGROUND ROUTES
app.use("/api/campgrounds", campgroundRoutes);

//CAMPGROUND ROUTES
app.use("/api/users", userRoutes);

//UPLOAD ROUTES
app.use("/api/upload", uploadRoutes);

//FOLLOW ROUTES
app.use("/api", followRoutes);

//TAG ROUTES
app.use("/api/tags/", tagRoutes);

//SEARCH ROUTE
app.use("/api", searchRoutes);

//NOTIFICATION ROUTE
app.use("/api/notifications", notificationRoute);

//CHAT ROUTES
app.use("/api/chats", chatRoutes);

//RESET PASSWORD
app.use("/api/reset-password", resetPassword);

//PAGE NOT FOUND
app.use(notFound);

//ERROR HANDLER
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const expressServer = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);

//SOCKET STUFF
const io = socketIo(expressServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log(socket.id, "Connected");

  //add user to list and update all users with the user list every 10 sec
  socket.on("join", async ({ userId }) => {
    const users = await addUser(userId, socket.id);
    console.log("USers:\n", users);

    setInterval(() => {
      socket.emit("connectedUsers", {
        users: users.filter((user) => user.userId !== userId),
      });
    }, 10000);
  });

  //Like posts
  socket.on("likePost", async ({ postId, userId, like }) => {
    const { success, error, username, profilePic, postByUserId } =
      await likeOrUnlikePost(postId, userId, like);

    if (success) {
      socket.emit("postLiked");
      if (postByUserId != userId) {
        const receiverSocket = await findConnectedUser(postByUserId);

        if (receiverSocket && like) {
          console.log("Emitting now");
          io.to(receiverSocket.socketId).emit("newNotificationReceived", {
            username,
            profilePic,
            postId,
          });
        }
      }
    }
  });

  //Comment Notifications
  socket.on("newComment", async ({ postId, userId, postAuthor, username }) => {
    if (postAuthor.toString() != userId.toString()) {
      const receiverSocket = await findConnectedUser(postAuthor);

      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit("newCommentNotificationReceived", {
          username,
          postId,
        });
      }
    }
  });

  //Follower Notification
  socket.on("newFollower", async ({ userId, userToFollow, username }) => {
    if (userId.toString() != userToFollow.toString()) {
      const receiverSocket = await findConnectedUser(userToFollow);

      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit("newFollowerNotificationReceived", {
          username,
        });
      }
    }
  });

  //Send previous chat history with a particular user
  socket.on("loadMessages", async ({ userId, messagesWith }) => {
    const { chat, error } = await loadMessages(userId, messagesWith);

    if (!error) {
      socket.emit("messagesLoaded", { chat });
    } else {
      socket.emit("noChatFound");
      console.log("Emitting no chat found");
    }
  });

  //Event for new msg
  socket.on("sendNewMsg", async ({ userId, msgSendToUserId, msg }) => {
    const { newMsg } = await sendMsg(userId, msgSendToUserId, msg);

    //Check if receiver is online
    const receiverSocket = await findConnectedUser(msgSendToUserId);
    console.log("====================================");
    console.log("Sending new message", receiverSocket.socketId);
    console.log("====================================");
    //If online send msg else make his unreadMsg in his user model to true
    if (receiverSocket) {
      io.to(receiverSocket.socketId).emit("newMsgReceived", { newMsg });
    } else {
      setMsgToUnread(msgSendToUserId);
    }
    socket.emit("msgSent", { newMsg });
  });

  socket.on(
    "sendMsgFromNotification",
    async ({ userId, msgSendToUserId, msg }) => {
      const { newMsg } = await sendMsg(userId, msgSendToUserId, msg);

      //Check if receiver is online
      const receiverSocket = await findConnectedUser(msgSendToUserId);

      //If online send msg else make his unreadMsg in his user model to true
      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit("newMsgReceived", { newMsg });
      } else {
        setMsgToUnread(msgSendToUserId);
      }
      socket.emit("msgSentFromNotification", { newMsg });
    }
  );

  //On disconnect
  socket.on("disconnect", async () => {
    console.log(socket.id, "-******User disconnected initiated******");
    await removeUser(socket.id);
    console.log(socket.id, "-******User disconnected******");
  });
});
