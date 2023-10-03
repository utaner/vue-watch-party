<template>
  <div class="roomList">
    <div class="room" @click="createRoom">
      <div class="roomName">Room 1</div>
      <div class="roomUsers">Users: 1</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: ["unauth"],
});

import { io } from "socket.io-client";

const $io = io("http://localhost:3001");

const createRoom = () => {
  let token = useCookie("auth").value;
  $io.emit("createRoom", token);
};

$io.on("roomCreated", (roomId: any) => {
  console.log("Room created: " + roomId);
  navigateTo(`/app/room/${roomId}`);
});
</script>
