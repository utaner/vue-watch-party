<template>
  <main>
    <header>
      <Navbar />
    </header>
    <div>
      <slot />
    </div>
  </main>
</template>

<style scoped>
.router-link-exact-active {
  color: red;
}
</style>

<script setup>
import Navbar from "@/components/navbar/Navbar.vue";
import "@/layouts/Main.scss";


</script>
