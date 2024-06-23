<template>
  <div class="container" v-cloak>
    <div class="row">
      <div class="col-md-6">
        <h4>{{ roomName }} <span class="badge badge-info badge-pill">{{ userCount }}</span></h4>
      </div>
      <div class="col-md-6 text-right">
        <nuxt-link class="btn btn-primary btn-sm" to="/logout">로그아웃</nuxt-link>
        <nuxt-link class="btn btn-info btn-sm" to="/chat">뒤로가기</nuxt-link>
        <button class="btn btn-info btn-sm" @click.prevent="exitRoom">채팅방 나가기</button>
      </div>
    </div>
    <div class="input-group">
      <div class="input-group-prepend">
        <label class="input-group-text">내용</label>
      </div>
      <input type="text" class="form-control" v-model="message" @keypress.enter="sendMessage('TALK')">
      <div class="input-group-append">
        <button class="btn btn-primary" type="button" @click="sendMessage('TALK')">보내기</button>
      </div>
    </div>
    <ul class="list-group">
      <li class="list-group-item" v-for="message in messages" :key="message.regDt">
        {{ message.sender }} - {{ message.message }}
      </li>
    </ul>
  </div>
</template>

<script>
import * as SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";

const sock = new SockJS(`http://localhost:8080/ws-stomp`);
const ws = Stomp.over(sock);

export default {
  data() {
    return {
      roomId: '',
      roomName: '',
      sender: '',
      message: '',
      messages: [],
      userCount: 0,
      token: ''
    };
  },
  created() {
    this.roomId = localStorage.getItem('wschat.roomId');
    this.roomName = localStorage.getItem('wschat.roomName');
    this.sender = localStorage.getItem('wschat.sender');
    this.connectWebSocket();
    // $ws가 정의된 후에 연결 시도
    // this.$nextTick(() => {
    //   this.connectWebSocket();
    // });
  },
  methods: {
    connectWebSocket() {
      ws.connect({"username":localStorage.getItem('wschat.sender')}, (frame) => {
        console.log("연결 성공");
        console.log(sock);
        ws.subscribe("/sub/chat/room/"+localStorage.getItem('wschat.roomId'), (message) => {
          console.log("여긴됨?");
          var recv = JSON.parse(message.body);
          console.log("recv 테스트 : " + recv);
          this.testMethod();
          this.recvMessage(recv);
          console.log("테스트");
          console.log(recv);
        }, {"username" : localStorage.getItem('wschat.sender')});
        console.log("여기는 구독정보");
        console.log(this.sender);
        // console.log(ws.subscriptions);
        console.log(this.messages);
      }, function(error) {
        alert("서버 연결에 실패 하였습니다. 다시 접속해 주십시요.");
        location.href="/chat/room";
      })

      // if (!this.$ws) {
      //   console.error('WebSocket instance not available');
      //   return;
      // }
      //
      // this.$ws.connect({ username: this.sender }, (frame) => {
      //   console.log('Connected: ' + frame);
      //   this.$ws.subscribe(`/sub/chat/room/${this.roomId}`, (message) => {
      //     console.log('Received message:', message);
      //     const recv = JSON.parse(message.body);
      //     this.recvMessage(recv);
      //   }, { username: this.sender });
      // }, (error) => {
      //   console.error('Connection error:', error);
      //   alert('서버 연결에 실패하였습니다. 다시 접속해 주십시요.');
      //   this.$router.push('/chat/room');
      // });
    },
    sendMessage(type) {
      const currentDateTime = new Date().toISOString().toString();
      console.log("보낸 메시지 데이터");
      console.log(this.roomId);
      console.log(this.message);
      console.log(this.sender);
      ws.send('/pub/chat/message', { token: this.token }, JSON.stringify({
        type: type,
        roomId: this.roomId,
        message: this.message,
        sender: this.sender,
        regDt: currentDateTime
      }));
      this.message = '';
    },
    recvMessage(recv) {
      console.log("왜 받질 못하니");
      console.log('Received:', recv);
      this.userCount = recv.userCount;
      this.messages.unshift({
        id: recv.id,
        type: recv.type,
        sender: recv.sender,
        message: recv.message,
        regDt: recv.regDt
      });
    },
    exitRoom() {
      console.log('채팅방 나가기');
      console.log(this.roomId);
      console.log(localStorage.getItem('wschat.sender'));
      this.$axios.post('/chat/room/exit', {
        roomId: this.roomId,
        name: localStorage.getItem('wschat.sender')
      }).then(response => {
        console.log('서버 응답:', response.data);
      }).catch(error => {
        console.error('에러 발생:', error);
      });
    },
    testMethod() {
      console.log("이건 테스트 메서드 호출");
    }
  }
};
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
