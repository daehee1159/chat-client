// import * as SockJS from 'sockjs-client';
// import {Stomp} from '@stomp/stompjs';
//
// let ws = null;
//
// export default ({ app }) => {
//   const sock = new SockJS(`http://localhost:8080/ws-stomp`);
//   const ws = Stomp.over(sock);
//
//   ws.connect({}, () => {
//     console.log('WebSocket connected');
//   }, (error) => {
//     console.error('WebSocket connection error:', error);
//   });
//
//   app.$ws = ws;
// };
