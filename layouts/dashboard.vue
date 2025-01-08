<template>
  <Modal :visible="modalVisible" @close="modalVisible = false">
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

          <ContextMenu :active="menuActive" :extraStyle="{ top: '-9px', width: '200px', right: '-50px' }">
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

<script lang="ts">
import "@/layouts/Main.scss";



export default {
  name: "Dashboard",
  components: {},
  props: {},
  data() {
    return {
      modalVisible: false,
      isShowContentModal1: true,
      isShowContentModal2: false,
      username: "test#1111",
      profileIcon: 1,
      menuActive: false,
    };
  },
  methods: {
    //page click
    showModal() {
      this.modalVisible = true;
    },
    showContextMenu() {
      this.menuActive = !this.menuActive;
    },
    logOutHandler() {
      //remove cookie
      $fetch("/api/user/logout", {
        method: "POST",
      })
        .then(async () => {
          navigateTo("/app/login");
        })
        .catch((err: { data: NuxtError }) => {
          console.log(err);
        })
        .finally(() => { });
    },
    changeModalContent(value: any) {
      if (value === 1) {
        this.isShowContentModal1 = true;
        this.isShowContentModal2 = false;
      } else if (value === 2) {
        this.isShowContentModal1 = false;
        this.isShowContentModal2 = true;
      }
    },
    selectIcon(value: any) {
      $fetch("http://localhost:3002/api/user/changeProfileIcon", {
        method: "POST",
        body: JSON.stringify({
          profileIcon: value,
          token: useCookie("auth").value,
        }),
      })
        .then(async (res: any) => {
          this.getUser();
        })
        .catch((err: { data: NuxtError }) => {
          console.log(err);
        })
        .finally(() => { });
      this.profileIcon = value;
      this.changeModalContent(1);
    },
    getUser() {
      $fetch("/api/user/get-user", {
        method: "POST",

      })
        .then(async (res: any) => {
          this.username = res.username;
          this.profileIcon = res.profileIcon;
        })
        .catch((err: { data: NuxtError }) => {
          console.log(err);
        })
        .finally(() => { });
    },
  },
  mounted() {
    useHead({
      bodyAttrs: {
        'data-route': 'dashboard',
      },
    });
    this.getUser();
    //is page click
    document.addEventListener("click", (e) => {
      //eğer tıklanan element context menu ise
      if (e.target.closest(".otherButton")) {
        return;
      }
      //eğer tıklanan element context menu değilse
      this.menuActive = false;
    });
  },
};




</script>
