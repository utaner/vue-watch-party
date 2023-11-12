<template class="asd">
  <div class="loginHeader">
    <h3>Giriş Yap</h3>
    <h4>Sanal sinemaya hoş geldin!</h4>
    <p id="errorText" class="error"></p>
  </div>
  <form @submit.prevent="login">
    <div class="input-grp">
      <input v-model="user.email" type="text" class="input" placeholder="E-posta giriniz." name="email" required />
    </div>
    <div class="input-grp">
      <input v-model="user.password" type="password" class="input" placeholder="Şifre giriniz." name="password"
        required />
    </div>
    <div class="bottom-btns">
      <a href="/app/password-recovery" class="forgotPasswordLink">Şifreni mi unuttun? </a>
      <button @click.prevent="login" type="submit">
        <span tabindex="-1">Giriş Yap</span>
      </button>
    </div>
    <div>
      <p class="loginFooter">
        Hesabın yok mu? <a href="/app/sign-up">Kayıt Ol</a>
      </p>
    </div>
  </form>
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
      const errorText = document.getElementById("errorText");
      errorText!.innerHTML = err.data.message;
    })
    .finally(() => { });
};



//loginFormSubmit




</script>
