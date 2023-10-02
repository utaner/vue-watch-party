<template>
  <div class="loginHeader">
    <h3>Log in</h3>
    <h4>Welcome back!</h4>
  </div>
  <div>
    <div class="input-grp">
      <input v-model="user.email" type="text" class="input" placeholder="Enter Email" name="email" required />
    </div>
    <div class="input-grp">
      <input v-model="user.password" type="password" class="input" placeholder="Enter Password" name="password" required />
    </div>
    <div class="bottom-btns">
      <a href="/app/password-recovery" class="forgotPasswordLink">Forgot password? </a>
      <button @click.prevent="login" type="button">
        <span tabindex="-1">Log in</span>
      </button>
    </div>
  </div>
</template>
<style scoped lang="css"></style>
<script lang="ts" setup>
import { NuxtError } from "nuxt/app";
definePageMeta({
  middleware: "auth",
  layout: "login",
});
const user = ref({
  email: "",
  password: "",
});

const login = async () => {
  await $fetch("/api/user/sign-in", {
    method: "POST",
    body: user.value,
  })
    .then(async () => {
      await navigateTo("/app");
    })
    .catch((err: { data: NuxtError }) => {
      console.log(err);
    })
    .finally(() => {});
};
</script>
