<template>
  <div class="videoContainer" v-if="room.isReady">
    <div class="vmContainer">
      <YoutubePlayer videoId="79XQBAouHjU" @onPlay="onPlay" @onPause="onPause" @onStop="onStop" @onEnd="onEnd" ref="player" />
      <button @click="testPlay">Play</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import YoutubePlayer from "@/components/youtube-player/YoutubePlayer.vue";
import { ref, getCurrentInstance } from "vue";

const instance = getCurrentInstance();
definePageMeta({
  layout: "dashboard",
  middleware: ["unauth"],
});

import { io } from "socket.io-client";

const $io = io("http://localhost:3001");

const room = ref({
  id: "",
  users: [],
  isReady: false,
  videoTime: 0,
});


const joinRoom = () => {
  let token = useCookie("auth").value;
  let roomId = useRoute().params.id;
  $io.emit("joinRoom", { token, roomId });
};

$io.on("joinedRoom", (users: any) => {
  console.log(users);
  room.value.users = users;
  room.value.isReady = true;
});

joinRoom();

const onPlay = (time: any) => {
  $io.emit("play", { time: time });
  room.value.videoTime = time;
};

const onPause = (time: any) => {
  $io.emit("pause", { time: time });
  room.value.videoTime = time;
};

const onStop = (time: any) => {
  $io.emit("stop", { time: time });
  room.value.videoTime = time;
};

const onEnd = (time: any) => {
  $io.emit("end", { time: time });
  room.value.videoTime = time;
};

$io.on("play", (time: any) => {
  instance.refs.player.YTPLayer.playVideo();
  room.value.videoTime = time;
});

$io.on("pause", (time: any) => {
  instance.refs.player.YTPLayer.seekTo(time);
  instance.refs.player.YTPLayer.pauseVideo();
  room.value.videoTime = time;

});
</script>
