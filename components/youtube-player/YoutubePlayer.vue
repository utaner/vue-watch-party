<template id="youtube-player">
  <div class="video-container">
    <div class="video-placeholder"></div>
    <span id="time"></span>
  </div>
</template>
<style lang="scss">
    #youtube-player {
        display: inline-block;
        position: relative;
    }
    #youtube-player.shown::after {
        content:"";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        cursor: pointer;
        background-color: black;
        background-repeat: no-repeat;
        background-position: center; 
        background-size: 64px 64px;
        background-image: url(data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgNTEwIDUxMCI+PHBhdGggZD0iTTI1NSAxMDJWMEwxMjcuNSAxMjcuNSAyNTUgMjU1VjE1M2M4NC4xNSAwIDE1MyA2OC44NSAxNTMgMTUzcy02OC44NSAxNTMtMTUzIDE1My0xNTMtNjguODUtMTUzLTE1M0g1MWMwIDExMi4yIDkxLjggMjA0IDIwNCAyMDRzMjA0LTkxLjggMjA0LTIwNC05MS44LTIwNC0yMDQtMjA0eiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg==);
    }
</style>
<script lang="ts">
import { defineProps } from "vue";

export default {
  props: { videoId: String },
  data() {
    return {
      videoId: this.videoId || null,
      youtubeCallbackName: "onYouTubeIframeAPIReady",
      youtubeExistsFlag: "$isYoutubeFrameAPIReady",
      time: 0,
      YTPLayer: null,
    };
  },
  computed: {
    youtubeVideoID() {
      if (this.videoId.indexOf(":/") !== -1) {
        const catcher = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
        const res = catcher.exec(this.videoId);
        if (res && res[1]) {
          return res[1];
        }
      }

      return this.videoId;
    },
  },
  watch: {
    time() {
      console.log(this.time);
    },
  },
  emits: ["onPlay", "onPause", "onStop", "onEnd"],
  mounted() {
    if (!this.hasYoutubeFrameAPI()) {
      this.injectYoutubeFrameAPI();
    }
    this.whenYoutubeAPIReady().then(
      () => {
        const player = this.$el.querySelector(".video-placeholder");
        player.id = "player-" + Math.floor(Math.random() * 1024) + Date.now() + Math.floor(Math.random() * 1024);

        this.YTPLayer = new YT.Player(player.id, {
          height: "360",
          width: "640",
          videoId: this.youtubeVideoID,
          events: {
            onStateChange: this.onPlayerStateChange,
          },
          playerVars: {
            enablejsapi: 1,
            modestbranding: 1,
            showinfo: 0,
            ecver: 2,
            disablekb: 1,
            cc_load_policy:1,
            iv_load_policy:1,
            playsinline: 1,
            enablecastapi:1,
            rel: 0,

          },
        });
      },
      (error) => console.error(error)
    );
  },
  methods: {
    onPlayerStateChange(evt) {
      if (evt.data === YT.PlayerState.PLAYING) {
        this.time = this.YTPLayer.getCurrentTime();
        this.$emit("onPlay", this.time);
      } else if (evt.data === YT.PlayerState.PAUSED) {
        this.time = this.YTPLayer.getCurrentTime();
        this.$emit("onPause", this.time);
      } else if (evt.data === YT.PlayerState.ENDED) {
        this.time = this.YTPLayer.getCurrentTime();
        this.$emit("onEnd", this.time);
      } else if (evt.data === YT.PlayerState.CUED) {
        this.time = this.YTPLayer.getCurrentTime();
        this.$emit("onStop", this.time);
      }
    },
    whenYoutubeAPIReady() {
      return new Promise((resolve, reject) => {
        if (this.$isYoutubeFrameAPIReady) {
          resolve();
        } else {
          window[this.youtubeCallbackName] = () => {
            this.$isYoutubeFrameAPIReady = true;
            resolve();
          };
        }
      });
    },
    hasYoutubeFrameAPI() {
      return window.YT && window.YT.Player;
    },
    injectYoutubeFrameAPI() {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },
  },
};
</script>
