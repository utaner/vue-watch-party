<template>
  <div class="videoContainer">
    <div class="vmContainer">
        <YoutubePlayer videoId="79XQBAouHjU" :onPlay="onPlay" />

    </div>
  </div>
</template>

<script lang="ts" setup>

import YoutubePlayer from "@/components/youtube-player/YoutubePlayer.vue";

definePageMeta({
  layout: "dashboard",
  middleware: ["unauth"],
});

//on play callback

const onPlay = () => {
  console.log("on play");
};





</script>
