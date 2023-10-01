<template>
  <div>Deneme</div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "login",
  middleware: ["unauth"],
});
</script>
