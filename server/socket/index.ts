import { Server } from "socket.io";

//use mongoose to connect to mongodb
import userModel from "../models/user.model";

console.log("socket.io server started");

const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

const rooms: {
  [key: string]: {
    users: { [key: string]: { _id: string, username: string, avatar: string, socketID: string } };
    player: { videoID: string; time: number };
    owner: { _id: string },
    name: string,
    chat: {
      from: {
        name: string; avatar: string
      };
      message: string;
      type: string,
      date: Date,
    }[]
  };
} = {};

io.on("connection", (socket) => {
  let myRoomId: string;
  let myUserID: string;
  console.log("a user connected");
  socket.on("createRoom", async (data) => {
    console.log(data);
    const token = data.token;
    const name = data.roomName;
    console.log(name);
    const user: any = await userModel.findOne({ token: token });
    if (!user) {
      return;
    }
    const roomId = Math.random().toString(36).substr(2, 9);
    rooms[roomId] = { users: {}, player: { videoID: "", time: 0 }, chat: [], owner: { _id: user._id }, name: name };
    socket.emit("roomCreated", roomId);
  });

  socket.on("joinRoom", async (data) => {
    const roomId = data.roomId;
    const token = data.token;
    const user: any = await userModel.findOne({ token: token });
    if (!user) {
      return;
    }
    if (!roomId || !rooms[roomId]) {
      console.log("room not found");
      socket.emit("notFoundRoom");

    }

    socket.join(roomId);

    rooms[roomId].users[user._id] = {
      _id: user._id,
      username: user.username,
      avatar: user.profileIcon,
      socketID: socket.id,
    };

    socket.to(roomId).emit("userJoined", { user: rooms[roomId].users[user._id] });
    socket.emit("joinedRoom", { users: rooms[roomId].users, player: rooms[roomId].player, chat: rooms[roomId].chat });
    myRoomId = roomId;
    myUserID = user._id;
  });

  socket.on("play", (data) => {
    const time = data.time;
    const roomId = myRoomId;
    rooms[roomId].player.time = time;
    socket.to(roomId).emit("play", time);
  });

  socket.on("pause", (data) => {
    const time = data.time;
    const roomId = myRoomId;
    rooms[roomId].player.time = time;
    socket.to(roomId).emit("pause", time);
  });

  socket.on('getRoomList', () => {
    let myRoomList = [];
    for (let key in rooms) {
      myRoomList.push({ roomId: key, owner: rooms[key].owner , name: rooms[key].name});
    }
    socket.emit('getRoomList', myRoomList);
  });

  socket.on("youtubeSearch", (data) => {
    let term = data.q;

    //term is url check
    if (term.includes("https://www.youtube.com/watch?v=")) {
      term = term.split("https://www.youtube.com/watch?v=")[1];
    }

    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&type=video&q=${term}&key=AIzaSyCD32ExxtF5D59PTi3kTjkr6_een9lt328`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        socket.emit("youtubeSearch", res.items);
      });
  });

  socket.on("message", async (data) => {
    const message = data.message;
    const roomId = myRoomId;
    let getLastMessage = rooms[roomId].chat[rooms[roomId].chat.length - 1];

    let getType = getLastMessage && getLastMessage.from.name === rooms[roomId].users[myUserID].username ? "continue" : "start";
    const getUser = await userModel.findOne({ _id: rooms[roomId].users[myUserID]._id });
    let messageData = {
      from: {
        name: getUser.username,
        avatar: getUser.profileIcon,
      },
      message: message,
      type: getType == null ? "start" : getType,
      date: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    };
    rooms[roomId].chat.push(messageData);
    //socket emit newMessage
    socket.to(roomId).emit("newMessage", messageData);
    socket.emit("newMessage", messageData);
  });

  socket.on("openYoutube", (data) => {
    const videoID = data.videoID;
    const roomId = myRoomId;
    rooms[roomId].player.videoID = videoID;
    socket.to(roomId).emit("openYoutube", { videoID: videoID, time: 0 });


  });

  socket.on("getTimeUser", (data) => {

    const userID = data.userID;
    const roomId = myRoomId;
    const socketID = rooms[roomId].users[userID].socketID;
    console.log(rooms[roomId]);
    console.log(socketID);
    //oda içerisindeki socket id ye gönder
    //getTimeRequest
    io.to(socketID).emit("getTimeRequest", { userID: myUserID });
  });

  socket.on("sendTimeUser", (data) => {
    console.log(data);
    const userID = data.userID;
    const time = data.time;
    const roomId = myRoomId;
    const socketID = rooms[roomId].users[userID].socketID;
    //oda içerisindeki socket id ye gönder
    //getTimeResponse
    io.to(socketID).emit("getTimeResponse", { time: time });
  });

  socket.on("disconnect", () => {
    if (myRoomId) {
      socket.to(myRoomId).emit("userLeft", rooms[myRoomId].users[myUserID]);
      delete rooms[myRoomId].users[myUserID];
      console.log(rooms);
    }
  });
});

export default io;
