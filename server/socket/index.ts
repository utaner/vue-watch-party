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
    socket.emit("joinedRoom", rooms[roomId].users);
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
  socket.on("disconnect", () => {
    if (myRoomId) {
      socket.to(myRoomId).emit("userLeft", rooms[myRoomId].users[socket.id]);
      delete rooms[myRoomId].users[socket.id];
      console.log(rooms);
    }
  });
});

export default io;
