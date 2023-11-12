<template>
  <div class="login">
    <nav>
      <a href="http://localhost:3000"> CINEPARTY </a>
    </nav>
    <div class="content">
      <div class="loginForm">
        <small class="error"></small>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import "@/layouts/Main.scss";
useHead({
  bodyAttrs: {
    'data-route': 'login',
  },
});


</script>

<style scoped lang="scss"></style>
