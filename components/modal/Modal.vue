<template>
  <div v-if="visible" class="modal" @click.self="close">
    <div class="modalContainer">

      <button class="closeButton" type="button" @click="close">
        <svg viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
        </svg>
      </button>
      <div class="modalContent">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref } from "vue";
//import Modal.scss
import "@/components/modal/Modal.scss";

const open = ref(false);

export default {
  name: "Modal",
  props: { visible: Boolean, close: Function },
  setup() {
    return { open };
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },




};


</script>
