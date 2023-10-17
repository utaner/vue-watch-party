<template>
  <div class="roomContainer">
    <div class="videoContainer" v-if="room.isReady">
      <div class="vmContainer">
        <div class="openButtons" v-if="!room.openYoutube && !room.startYoutube">
          <button class="btn btn-primary" @click="room.startYoutube = true">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50" style="fill: #ffffff">
                <path
                  d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"
                ></path>
              </svg>
              <h3>Youtube Başlat</h3>
            </span>
          </button>
        </div>
        <div class="youtubeStart" v-if="room.startYoutube">
          <div class="youtubeStart__input">
            <input type="text" placeholder="Youtube'da Ara..." @input="youtubeSearch($event.target.value)" />
            <div class="searchResult">
              <div class="result" v-for="result in youtubeSearchResults" :key="result.id" @click="openYoutube(result.id.videoId)">
                <div class="thumbnail">
                  <img :src="result.snippet.thumbnails.default.url" />
                </div>
                <div class="title">{{ result.snippet.title }}</div>
              </div>
            </div>
          </div>
          <div class="youtubeStart__buttons">
            <button class="btn btn-danger" @click="room.startYoutube = false">İptal</button>
          </div>
        </div>
        <YoutubePlayer v-if="room.openYoutube" :videoId="room.videoID" @onPlay="onPlay" @onPause="onPause" @onStop="onStop" @onEnd="onEnd" ref="player" />
      </div>
      <div class="hub">
        <div class="activeMembers">
          
        </div>
      </div>
    </div>
    <div class="chat">
      <ChatVue :messages="msgs" @onSendMessage="sendMessage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import YoutubePlayer from "@/components/youtube-player/YoutubePlayer.vue";
import ChatVue from "~/components/chat/Chat.vue";

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
  openYoutube: false,
  startYoutube: false,
  videoID: "",
});

const msgs = ref([
 
]);

const sendMessage = (message: string) => {
  $io.emit("message", { message: message });
};

const youtubeSearchTerm = ref("");

const youtubeSearchResults = ref([]);

const youtubeSearch = (term: string) => {
  $io.emit("youtubeSearch", { q: term });
};

$io.on("youtubeSearch", (data: any) => {
  youtubeSearchResults.value = data;
});

const openYoutube = (videoID: string) => {
  room.value.videoID = videoID;
  room.value.startYoutube = false;
  room.value.openYoutube = true;
  $io.emit("openYoutube", { videoID: videoID });
};

const joinRoom = () => {
  let token = useCookie("auth").value;
  let roomId = useRoute().params.id;
  $io.emit("joinRoom", { token: token, roomId: roomId });
};

$io.on("joinedRoom", (data: any) => {
  let users = data.users;
  let player = data.player;
  let chat = data.chat;
  room.value.users = users;
  room.value.isReady = true;
  room.value.videoTime = player.videoTime;
  room.value.videoID = player.videoID;
  msgs.value = chat;
  if (player.videoID != "") {
    room.value.openYoutube = true;
  }
});

$io.on("newMessage", (data: any) => {
  console.log(data);
  msgs.value.push(data);
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
