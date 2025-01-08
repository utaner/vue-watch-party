<template>
  <Modal :visible="modalVisible" @close="modalVisible = false">
    <h4>Oda Oluştur</h4>
    <div class="inputContainer">
      <input type="text" placeholder="Oda Adı" autofocus v-model="newRoomName" />
      <button type="button" @click="createRoom">Oluştur</button>

    </div>
  </Modal>
  <div class="myRoomsPage">
    <div class="top-bar">
      <h2>Odalar</h2>
      <button @click="openModal">Oda Oluştur</button>
    </div>
    <div class="roomList">
      <div class="room" v-for="room in roomList" :key="room.roomId" @click="joinRoom(room.roomId)">
        <img src="../../public/assets/image/1.jpg" width="16" height="9" />
        <div class="bottomInfo">
          <div class="roomName">{{ room.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >





export default {
  name: "Index",
  components: {},
  data() {
    return { roomList: [], modalVisible: false, newRoomName: "" };
  },
  methods: {
    openModal() {
      this.modalVisible = true;
    },
    createRoom() {
      let token = useCookie("auth").value;
      console.log(this.newRoomName);
      this.$socket.emit("createRoom", { token: token, roomName: this.newRoomName });
    },
    getRoomList() {
      let token = useCookie("auth").value;
      this.$socket.emit("getRoomList", token);
    },
    joinRoom(roomId: string) {
      navigateTo(`/app/room/${roomId}`);
    },
  },
  mounted() {
    definePageMeta({
      layout: "dashboard",
      middleware: ["unauth"],
    });
    this.$socket.connect();
    console.log(this.$socket);
    this.getRoomList();

    this.$socket.on("roomCreated", (roomId: any) => {
      console.log("Room created: " + roomId);
      navigateTo(`/app/room/${roomId}`);
    });
    this.$socket.on("getRoomList", (rooms: any) => {
      console.log(rooms);
      this.roomList = rooms;

    });


  },
};




</script>
