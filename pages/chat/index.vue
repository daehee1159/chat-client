<template>
  <div class="container" v-cloak>
    <div class="row">
      <div class="col-md-12">
        <h3>채팅방 리스트</h3>
      </div>
      <div class="col-md-6 text-right">
        <nuxt-link class="btn btn-primary btn-sm" to="/logout">로그아웃</nuxt-link>
      </div>
    </div>
    <div class="input-group">
      <div class="input-group-prepend">
        <label class="input-group-text">방제목</label>
      </div>
      <input type="text" class="form-control" v-model="room_name" @keyup.enter="createRoom">
      <div class="input-group-append">
        <button class="btn btn-primary" type="button" @click="createRoom">채팅방 개설</button>
      </div>
    </div>
    <ul class="list-group">
      <li class="list-group-item list-group-item-action" v-for="item in chatrooms" :key="item.roomId" @click="enterRoom(item.roomId, item.name)">
        <h6>{{item.name}} <span class="badge badge-info badge-pill">{{item.userCount}}</span></h6>
      </li>
    </ul>
  </div>
</template>
<script>
import WebSocketService from '~/plugins/websocket';

export default {
  data() {
    return {
      room_name: '',
      chatrooms: [],
      ws: null
    };
  },
  created() {
    this.findAllRoom();
    // this.initWebSocket();
  },
  methods: {
    findAllRoom() {
      this.$axios.get('/chat/rooms').then(response => {
        if (Array.isArray(response.data)) {
          this.chatrooms = response.data;
        }
      });
    },
    createRoom() {
      if (this.room_name === "") {
        alert("방 제목을 입력해 주십시요.");
        return;
      } else {
        const params = new URLSearchParams();
        params.append("name", this.room_name);
        this.$axios.post('/chat/room', params)
          .then(response => {
            alert(response.data.name + "방 개설에 성공하였습니다.");
            this.room_name = '';
            this.findAllRoom();
          })
          .catch(() => {
            alert("채팅방 개설에 실패하였습니다.");
          });
      }
    },
    enterRoom(roomId, roomName) {
      const sender = prompt('대화명을 입력해 주세요.');
      if (sender !== "") {
        localStorage.setItem('wschat.roomId', roomId);
        localStorage.setItem('wschat.roomName', roomName);
        localStorage.setItem('wschat.sender', sender);
        this.$router.push(`/chat/room/${roomId}`);
      }
    },
    initWebSocket() {
      WebSocketService.connect().then(ws => {
        this.ws = ws;
        // WebSocket 연결 후 추가적인 설정을 여기서 할 수 있습니다.
      }).catch(error => {
        console.error("WebSocket 연결 실패:", error);
      });
    }
  }
};
</script>
