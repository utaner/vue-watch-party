<template>
  <nav>
    <a href="http://localhost:3000"> CINEPARTY </a>
  </nav>
  <div class="content">
    <div class="loginForm">
        <small class="error"></small>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@/layouts/Login.scss";
</script>

<style scoped lang="scss"></style>
