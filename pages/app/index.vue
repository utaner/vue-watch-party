<template>
  <div class="roomList">
    <div class="room" @click="createRoom">
      <img src="https://hyperbeam.com/app/img/banner_2.8bc3033b.png" width="16" height="9" />
      <div class="bottomInfo">
        <div class="roomName">Yeni Oda</div>
      </div>
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
