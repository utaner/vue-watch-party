<template>
  <div class="flex">
    <section class="textChat">
      <div class="messageList">
        <div class="message">
          <div>
            <img
              alt="Taner"
              src="data:image/png;base64,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"
              crossorigin=""
              class="userPicture"
            />
            <div class="usernameContainer">
              <span class="time">17:00</span>
              <h3 class="username">Taner</h3>
            </div>
            <div class="messageContent">
              <div class="text">Deneme</div>
            </div>
          </div>
        </div>
        <div class="message">
          <div>
            <div class="messageContent">
              <div class="text">Selam naber iyi sen nasılsın ben de iyi asıl sen sen nasılsın</div>
            </div>
          </div>
        </div>
      </div>
      <div class="messageInput">
        <textarea placeholder="Mesajınızı yazın"></textarea>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: ["msg", "prev"],
  data() {
    return {
      isSame: false,
      avatar: "https://picsum.photos/200",
    };
  },
  methods: {
    isSamePerson(msg, prev) {
      if (prev === null) {
        return false;
      } else if (prev[0]?.from.name == msg?.from.name) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    this.isSame = this.isSamePerson(this.msg, this.prev);
    if (this.msg?.from.avatar) {
      this.avatar = this.msg?.from.avatar;
    }
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

.chat__first {
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
