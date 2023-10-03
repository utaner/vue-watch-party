<template id="youtube-player">
  <div class="video-container">
    <div class="video-placeholder"></div>
    <span id="time"></span>
  </div>
</template>

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
    }
  },
  watch: {
    time() {
      console.log(this.time);
    },
  },
  emits:['onPlay', 'onPause', 'onStop', 'onEnd'],
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
        });
      },
      (error) => console.error(error)
    );
  },
  methods: {
    onPlayerStateChange(evt) {
      if (evt.data === YT.PlayerState.PLAYING) {
        this.time = this.YTPLayer.getCurrentTime();
        this.$emit('onPlay', this.time);
        
      }else if (evt.data === YT.PlayerState.PAUSED) {
        this.time = this.YTPLayer.getCurrentTime();
        this.$emit('onPause', this.time);
      }else if (evt.data === YT.PlayerState.ENDED) {
        this.time = this.YTPLayer.getCurrentTime();
        this.$emit('onEnd', this.time);
      }else if (evt.data === YT.PlayerState.CUED) {
        this.time = this.YTPLayer.getCurrentTime();
        this.$emit('onStop', this.time);
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
