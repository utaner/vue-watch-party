<template>
  <div class="roomContainer">
    <div class="videoContainer" v-if="room.isReady">
      <div class="vmContainer">
        <div class="openButtons" v-if="!room.openYoutube && !room.startYoutube">
          <button class="btn btn-primary" @click="room.startYoutube = true">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50" style="fill: #ffffff">
                <path d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"></path>
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

          <ActiveMember v-for="user of room.users" :key="user" :room="room" :user="user" :getTimePlayer="getTimePlayer" />
        </div>
      </div>
    </div>
    <div class="chat">
      <ChatVue :messages="msgs"/>
    </div>
  </div>
</template>

<script lang="ts" >
import YoutubePlayer from "@/components/youtube-player/YoutubePlayer.vue";
import ChatVue from "~/components/chat/Chat.vue";
import { ref, getCurrentInstance } from "vue";




export default {
  name: "Room",
  components: {
    YoutubePlayer,
    ChatVue,
  },
  data() {
    return {
      room: {
        id: "",
        users: [],
        isReady: false,
        videoTime: 0,
        openYoutube: false,
        startYoutube: false,
        videoID: "",
      },
      msgs: [],
      user: {},
      youtubeSearchTerm: "",
      youtubeSearchResults: [],


    };
  },

  methods: {

    youtubeSearch(term: string) {
      this.$socket.emit("youtubeSearch", { q: term });
    },
    openYoutube(videoID: string) {
      this.room.videoID = videoID;
      this.room.startYoutube = false;
      this.room.openYoutube = true;
      this.$socket.emit("openYoutube", { videoID: videoID });
    },
    joinRoom() {
      let token = useCookie("auth").value;
      let roomId = useRoute().params.id;
      this.$socket.emit("joinRoom", { token: token, roomId: roomId });
    },
    onPlay(time: any) {
      this.$socket.emit("play", { time: time });
      this.room.videoTime = time;
    },
    onPause(time: any) {
      this.$socket.emit("pause", { time: time });
      this.room.videoTime = time;
    },
    onStop(time: any) {
      this.$socket.emit("stop", { time: time });
      this.room.videoTime = time;
    },
    onEnd(time: any) {
      this.$socket.emit("end", { time: time });
      this.room.videoTime = time;
      this.room.startYoutube = true;
      this.room.openYoutube = false;
    },
    getTimePlayer(time: any) {

    },
  },
  mounted() {
    const instance = getCurrentInstance();
    definePageMeta({
      layout: "dashboard",
      middleware: ["unauth"],
    });


    this.$socket.on("youtubeSearch", (data: any) => {
      this.youtubeSearchResults = data;
    });

    this.$socket.on("joinedRoom", (data: any) => {
      let users = data.users;
      let player = data.player;
      let chat = data.chat;
      this.room.users = users;
      this.room.isReady = true;
      this.room.videoTime = player.videoTime;
      this.room.videoID = player.videoID;
      this.msgs = chat;
      if (player.videoID != "") {
        this.room.openYoutube = true;
      }
    });

    this.$socket.on('userJoined', (data: any) => {
      let user = data.user;
      this.room.users[user._id] = user;
    });

    this.$socket.on('getTimeRequest', (data: any) => {
      if (instance.refs.player == undefined || instance.refs.player.YTPLayer == undefined) {
        return;
      }
      let getTime = instance.refs.player.YTPLayer.getCurrentTime();
      this.$socket.emit('sendTimeUser', { time: getTime, userID: data.userID });

    });


    this.$socket.on('userLeft', (data: any) => {
      let user = data;
      delete this.room.users[user._id];
    });

    this.$socket.on('notFoundRoom', (data: any) => {
      navigateTo("/app/room/notfound");
    });

    this.$socket.on("openYoutube", (data: any) => {
      console.log(data);
      this.room.videoID = data.videoID;
      this.room.openYoutube = true;
    });

    this.$socket.on("newMessage", (data: any) => {
      console.log(data);
      this.msgs.push(data);
    });

    this.joinRoom();

    this.$socket.on("play", (time: any) => {
      instance.refs.player.YTPLayer.playVideo();
      this.room.videoTime = time;
    });

    this.$socket.on("pause", (time: any) => {
      instance.refs.player.YTPLayer.seekTo(time);
      instance.refs.player.YTPLayer.pauseVideo();
      this.room.videoTime = time;
    });
  },



};





</script>
