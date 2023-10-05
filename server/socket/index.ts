import { Server } from "socket.io";

//use mongoose to connect to mongodb
import userModel from "../models/user.model";

const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

const rooms: { [key: string]: { users: { [key: string]: { username: string } }; player: { videoID: string; time: number } } } = {};

io.on("connection", (socket) => {
  let myRoomId: string;

  socket.on("createRoom", (token) => {
    const user: any = userModel.findOne({ token: token });
    if (!user) {
      return;
    }
    const roomId = Math.random().toString(36).substr(2, 9);
    rooms[roomId] = { users: {}, player: { videoID: "", time: 0 } };
    socket.emit("roomCreated", roomId);
  });

  socket.on("joinRoom", (data) => {
    const { roomId, token } = data;
    const user: any = userModel.findOne({ token: token });
    if (!user) {
      return;
    }

    if (!rooms[roomId]) {
      return;
    }

    socket.join(roomId);
    rooms[roomId].users[socket.id] = { username: user.username };
    socket.to(roomId).emit("userJoined", user.username);
    socket.emit("joinedRoom", {users: rooms[roomId].users, player: rooms[roomId].player});
    console.log(rooms);
    myRoomId = roomId;
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

  socket.on("youtubeSearch", (data) => {
    let term = data.q;

    //term is url check
    if(term.includes("https://www.youtube.com/watch?v=")){
      term = term.split("https://www.youtube.com/watch?v=")[1];
    }

    

    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&type=video&q=${term}&key=AIzaSyCD32ExxtF5D59PTi3kTjkr6_een9lt328`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        socket.emit("youtubeSearch", res.items);
      });
  });

  socket.on("message", (data) => {
    const message = data.message;
    const roomId = myRoomId;
    //all user send newMessage
    socket.to(roomId).emit("newMessage", { message: message, username: rooms[roomId].users[socket.id].username });
    socket.emit("newMessage", { message: message, username: rooms[roomId].users[socket.id].username });

  });

  socket.on("openYoutube", (data) => {
    const videoID = data.videoID;
    const roomId = myRoomId;
    rooms[roomId].player.videoID = videoID;
    socket.to(roomId).emit("openYoutube", videoID);
  });

  socket.on("disconnect", () => {
    if (myRoomId) {
      socket.to(myRoomId).emit("userLeft", rooms[myRoomId].users[socket.id]);
      delete rooms[myRoomId].users[socket.id];
      console.log(rooms);
    }
  });
});

export default io;
