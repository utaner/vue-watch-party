<template>
  <div class="flex">
    <section class="textChat">
      <div class="messageList">
        <div class="message" v-for="msg in messages" :key="msg.id">
          <div>

            <img alt="{{msg.from.name}}" :src="'/_nuxt/public/assets/image/profile/' + msg.from.avatar + '.jpg'" class="userPicture" v-if="msg.type === 'start'" />
            <div class="usernameContainer" v-if="msg.type === 'start'">
              <span class="time">{{ msg.date }}</span>
              <h3 class="username">{{ msg.from.name }}</h3>
            </div>

            <div class="messageContent">
              <div class="text">{{ msg.message }}</div>
            </div>
          </div>
        </div>

      </div>
      <div class="messageInput">
        <textarea placeholder="Mesajınızı yazın" v-model="message" @keydown.enter.prevent="sendMessage"></textarea>
      </div>
    </section>
  </div>
</template>

<script>
import "@/components/chat/Chat.scss";

export default {
  name: "chat",
  props: {
    messages: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      message: "",


    };
  },
  updated() {
    const messageList = document.querySelector(".messageList");
    messageList.scrollTop = messageList.scrollHeight;
  },
  methods: {
    sendMessage(e) {
      e.preventDefault();
      //shift + enter
      if (e.shiftKey && e.keyCode === 13) {
        this.message += "\n";
        return false;
      }
      if (e.keyCode === 13) {

        this.$socket.emit("message", { message: this.message });
        this.message = "";


      }
    },
  },
};
</script>

<style>
.chat__mymessage {
  display: flex;
  justify-content: right;
  align-items: flex-end;
  margin: 0;
  min-height: 40px;
  line-break: anywhere;
}

.chat__mymessage__paragraph {
  margin: 0.4rem 0 0 1rem;
  border-radius: 20px 20px 0px 20px;
  max-width: 180px;
  background-color: #bbc4ef;
  color: #ffffff;
  padding: 0.8rem;
  font-size: 14px;
}

.chat__start {
  margin-top: 2rem;
}

.chat__yourmessage {
  display: flex;
}

.chat__yourmessage__avartar {
  width: 40px;
  margin-right: 1rem;
}

.chat__yourmessage__img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.chat__yourmessage__user {
  font-size: 14px;
  font-weight: 700;
  color: #292929;
  margin-top: 0;
  margin-block-end: 0rem;
}

.chat__yourmessage__p {
  display: flex;
  align-items: flex-end;
  line-break: anywhere;
}

.chat__yourmessage__paragraph {
  margin: 0.4rem 1rem 0 0;
  border-radius: 0px 20px 20px 20px;
  background-color: #f3f3f3;
  max-width: 180px;
  color: #414141;
  padding: 0.8rem;
  font-size: 14px;
}

.chat__yourmessage__time {
  margin: 0;
  font-size: 12px;
  color: #9c9c9c;
}
</style>
