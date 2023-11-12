<template>
  <Modal ref="modal">
    <div id="contentModal-1" v-if="isShowContentModal1">
      <h3>HESABIM</h3>
      <div class="profileContainer">
        <img alt="{{username}}" :src="'/_nuxt/public/assets/image/profile/' + profileIcon + '.jpg'" crossorigin="" style="border-radius: 50%; width: 64px; height: 64px" />
        <span>{{ username }}</span>
        <div>
          <button class="otherButton" type="button" @click="showContextMenu">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 16a2 2 0 110 4 2 2 0 010-4zm0-6a2 2 0 110 4 2 2 0 010-4zm0-6a2 2 0 110 4 2 2 0 010-4z" fill="#000"></path>
            </svg>
          </button>

          <ContextMenu :active="false" ref="contextMenu">
            <div>
              <button @click="changeModalContent(2)">
                <span>Profil Resmi Değiştir</span>
              </button>
            </div>
            <div>
              <button class="danger">
                <span>Profil Resmi Kaldır</span>
              </button>
            </div>
          </ContextMenu>
        </div>
      </div>

      <button class="logoutButton" type="button" @click="logOutHandler()">
        <span>Çıkış Yap</span>
      </button>
    </div>
    <div id="contentModal-2" v-if="isShowContentModal2">
      <button class="backButton" type="button" @click="changeModalContent(1)">

        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
      </button>
      <h3 style="margin-left:30px">PROFİL RESMİ</h3>
      <div>
        <span>İkon Seç</span>
        <div class="iconList">
          <button class="selectIcon" @click="selectIcon(1)"><img src="/_nuxt/public/assets/image/profile/1.jpg"></button>
          <button class="selectIcon" @click="selectIcon(2)"><img src="/_nuxt/public/assets/image/profile/2.jpg"></button>
          <button class="selectIcon" @click="selectIcon(3)"><img src="/_nuxt/public/assets/image/profile/3.jpg"></button>

        </div>
      </div>


    </div>
  </Modal>
  <div class="sidebar">
    <div class="buttons">
      <div>
        <button type="button" @click="navigateTo('/app')">
          <div class="logo">CP</div>
        </button>
      </div>
      <div class="bottomNavContainer">
        <button type="button" @click="showModal">
          <img :alt="username" :src="'/_nuxt/public/assets/image/profile/' + profileIcon + '.jpg'" crossorigin="" style="border-radius: 50%; width: 44px; height: 44px" />
        </button>
      </div>
    </div>
  </div>
  <div class="content">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import "@/layouts/Main.scss";
import { ref, getCurrentInstance } from "vue";
import { NuxtError } from "nuxt/app";

const instance = getCurrentInstance();

const username = ref("test#1111");
const profileIcon = ref(1);
const isShowContentModal1 = ref(true);
const isShowContentModal2 = ref(false);



const showModal = () => {
  const modal = instance.refs.modal;
  modal.open = true;
};


const showContextMenu = () => {
  const contextMenu = instance.refs.contextMenu;
  contextMenu.open = true;
};

useHead({
  bodyAttrs: {
    'data-route': 'dashboard',
  },
});




const logOutHandler = async () => {
  //remove cookie

  await $fetch("/api/user/logout", {
    method: "POST",

  })
    .then(async () => {
      navigateTo("/app/login");

    })
    .catch((err: { data: NuxtError }) => {
      console.log(err);
    })
    .finally(() => { });

};

const getUser = async () => {
  await $fetch("/api/user/get-user", {
    method: "POST",
  })
    .then(async (res: any) => {

      username.value = res.username;
      profileIcon.value = res.profileIcon;



    })
    .catch((err: { data: NuxtError }) => {
      console.log(err);
    })
    .finally(() => { });
};


const changeModalContent = (value) => {
  if (value === 1) {
    isShowContentModal1.value = true;
    isShowContentModal2.value = false;
  } else if (value === 2) {
    isShowContentModal1.value = false;
    isShowContentModal2.value = true;
  }

};

getUser();


const selectIcon = async (value: any) => {
  await $fetch("/api/user/change-user", {
    method: "POST",
    body: JSON.stringify({
      profileIcon: value,
    }),
  })
    .then(async (res: any) => {
      getUser();



    })
    .catch((err: { data: NuxtError }) => {
      console.log(err);
    })
    .finally(() => { });
  profileIcon.value = value;
  changeModalContent(1);


};


</script>
