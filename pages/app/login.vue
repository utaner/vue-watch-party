<template>
  <div>
    <input v-model="user.email" type="text" class="input" placeholder="Enter Email" name="email" required/>
    <input v-model="user.password" type="password" class="input" placeholder="Enter Password" name="password" required/>
    <button @click.prevent="login" class="button">Login</button>
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
        // await navigateTo("/app");
      })
      .catch((err: { data: NuxtError }) => {
        console.log(err);
      })
      .finally(() => {});
  };
</script>
