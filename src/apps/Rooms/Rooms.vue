<style lang="stylus">
@import '../../styles/constants.styl'

max-width = 640px
padding = 20px

.bold
  font-weight bold

.rooms
  height 100vh
  background-color #0c2129
  overflow-y auto
  overflow-x hidden
  color textColor1
  width 100%

  > *
    padding padding

  .room-join-or-create
    display flex
    flex-direction column
    max-width max-width
    height 100%
    .title
      margin-top 0
      margin-bottom 20px

    .rooms-list
      flex 1
      display flex
      flex-direction column
      align-items center
      .create-room
        margin-bottom 10px
        width 100%
        input
          width 100%
      .room
        width 100%
        display flex
        cursor pointer
        margin-bottom 10px
        transition 0.2s ease background-color
        .name
          flex-grow 1
        .has-password
          margin-right 10px
      .room:hover
        background-color clHighlight

      .no-rooms-info
        flex 1
        display flex
        align-items center
        width 50%
        min-width 200px
        text-align center
        color textColor3

  .room-users
    max-width width
    .user
      margin-bottom 10px
      video
        margin-top 10px
        max-width 100%
        max-height 256px

  .chat-component
    padding-bottom 30px
</style>

<template>
  <div class="rooms scrollable">
    <div v-if="!this.$store.state.user.isLogined">
      <h1 class="title">Комнаты</h1>
      <h2><router-link to="/signin">Авторизируйтесь</router-link>, чтобы создать или присоединиться к комнате</h2>
    </div>
    <div v-else-if="!connected">
      <h1>Комнаты</h1>
      <div v-if="wasConnected">
        <h2>Соединение с сервером разорвано.</h2>
        <h2>Пробуем подключиться{{ dots }}</h2>
      </div>
      <div v-else>
        <h2>Не удалось подключиться к серверу.</h2>
        <h2>Пробуем еще{{ dots }}</h2>
      </div>
    </div>
    <div v-else-if="!joinedRoom" class="room-join-or-create">
      <h1 class="title">Комнаты</h1>
      <h2>Создать</h2>
      <form>
        <div class="form-group">
          <input v-model="createName" type="text" class="form-control" placeholder="Название комнаты..." maxlength="48" autocomplete="room-name">
          <div class="muted"><a href="" @click.prevent="showSettings = !showSettings">Настройки</a></div>
        </div>

        <div v-show="showSettings">
          <div class="form-group">
            <input v-model="createPassword" type="password" class="form-control" placeholder="Пароль (оставьте пустым для открытой комнаты)" maxlength="32" autocomplete="room-password">
          </div>

          <div class="form-group">
            <label>МАКСИМАЛЬНОЕ КОЛ-ВО СЛУШАТЕЛЕЙ - {{ createMaxUsers }}</label>
            <input v-model="createMaxUsers" type="range" min="2" max="20"
                   class="form-control" placeholder="Пароль" maxlength="32">
            <div class="muted">
              <i>Внимание! Ваш компьютер будет передавать видео-аудио поток каждому пользователю отдельно (P2P).
                Т. е. чем больше пользователей, тем выше нагрузка на ваш процессор и интернет-канал.</i>
            </div>
          </div>
        </div>

        <div class="form-group">
          <button class="btn" @click.prevent="roomCreate">Создать</button>
        </div>
      </form>

      <h2>Список комнат</h2>
      <div class="rooms-list">
        <form class="create-room">
          <input type="text" class="form-control" placeholder="Поиск по названию..." v-model="roomSearch">
        </form>
        <div v-if="this.filteredRooms.length > 0" v-for="room in this.rooms" class="room form-control" @click="roomJoin(room.id)">
          <div class="name">
            {{ room.name }} ({{ room.owner.username }}<span v-show="room.owner.fullname"> - {{ room.owner.fullname }}</span>)
          </div>
          <div v-show="room.hasPassword" class="has-password">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock" viewBox="0 0 16 16">
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
            </svg>
          </div>
          <div class="users">{{ room.users.length }} / {{ room.usersMax }}</div>
        </div>
        <div v-else class="no-rooms-info">
          <div class="name">Доступных комнат нет, но вы можете создать свою.</div>
        </div>
      </div>
    </div>
    <div v-else class="room-users">
      <h1>{{ joinedRoom.name }}</h1>
      <button class="btn btn-danger" @click="roomLeave">
        <span v-if="joinedRoom.host">Завершить конференцию</span>
        <span v-else>Покинуть</span>
      </button>
      <h2>Участники {{ joinedRoom.users.length }} / {{ joinedRoom.maxUsers }}</h2>
      <div class="users">
        <div v-for="(user, index) in joinedRoom.users" class="user form-control">
          <div class="username" :class="{ bold: this.uid === user.id }">{{ user.username }}<span v-show="user.fullname"> ({{ user.fullname }})</span><span v-show="index === 0"> 👑</span></div>
          <div v-if="user.stream && index === 0">
            <video :srcObject.prop="user.stream" autoplay controls :muted="this.uid === user.id"></video>
          </div>
        </div>
      </div>

      <h2>Chat</h2>
      <Chat ref="chat" class="chat-component" @sendMessage="sendMessage" />
    </div>
  </div>
</template>

<script>

import Chat from './Chat.vue'
import ReconnectingWebSocket from "../../utils/ReconnectingWebSocket";

import pickdilkSoundSrc from '/src/sounds/pickdilk.mp3'
import awuSoundSrc from '/src/sounds/awu.mp3'
import wufSoundSrc from '/src/sounds/wuf.mp3'

import { Room, User, Message } from './models'

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const WS_ADDR = (isLocal)? 'localhost:9090': `${window.location.hostname}/ws`
let WS_ROOMS_URL = `${(window.location.protocol === 'http:')? 'ws': 'wss'}://${WS_ADDR}`
if (isLocal) {
  WS_ROOMS_URL = 'wss://code.liokor.com/ws';
}

let ws = null

export default {
  components: { Chat },

  data() {
    return {
      sounds: {
        newMessage: new Audio(pickdilkSoundSrc),
        userJoined: new Audio(awuSoundSrc),
        userLeft: new Audio(wufSoundSrc)
      },

      showSettings: false,

      uid: null,

      dots: '...',

      connected: false,
      wasConnected: false,

      joinedRoom: null,

      createName: '',
      createPassword: '',
      createMaxUsers: 20,

      roomSearch: '',

      rooms: [],

      iceServers: null,

      devices: null,
      stream: null
    }
  },

  computed: {
    filteredRooms: function() {
      const rooms = [];
      for (const room of this.rooms) {
        if (room.name.search(this.roomSearch) !== -1) {
          rooms.push(room);
        }
      }
      return rooms;
    }
  },

  methods: {
    send(data) {
      ws.sendJSON(data);
    },

    __getUser(id) {
      if (!id) {
        return null;
      }
      if (!this.joinedRoom) {
        return null;
      }

      for (const user of this.joinedRoom.users) {
        if (user.id === id) {
          return user;
        }
      }
      return null;
    },

    __getRoom(id) {
      if (!id) {
        return null;
      }

      for (const room of this.rooms) {
        if (room.id === id) {
          return room;
        }
      }
      return null;
    },

    async __getDevices() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });

        const devices = await navigator.mediaDevices.enumerateDevices();

        for (const track of stream.getTracks()) {
          track.stop();
        }

        return devices;
      } catch (e) {
        throw (e);
      }
    },

    __createPeerConnection(user, stream = null) {
      const pc = new RTCPeerConnection({
        iceServers: this.iceServers
      });

      if (stream) {
        for (const track of stream.getTracks()) {
          pc.addTrack(track, stream);
        }
      }

      pc.addEventListener('icecandidate', (ev) => {
        if (!ev.candidate) {
          return;
        }

        this.send({
          to: user.id,
          command: 'candidate',
          candidate: ev.candidate
        });
      });

      pc.addEventListener('iceconnectionstatechange', () => {
        console.log(`RTC status changed for ${user.username}: ${pc.iceConnectionState}`);
      });

      pc.addEventListener('track', async (ev) => {
        user.stream = ev.streams[0];
      });

      pc.addEventListener('datachannel', (ev) => {
        console.log('Data channel created!')
        ev.channel.addEventListener('message', (ev) => {
          this.addMessage(user, ev.data);
          this.sounds.newMessage.play();
        })
      })

      return pc;
    },

    async __offerReceived(offer, from) {
      const user = this.__getUser(from);
      if (!user) {
        console.log(`ERROR: offer, unable to find user with id = ${from}`);
        return;
      }
      console.log(`RTC offer received from ${user.username}`);

      user.pc = await this.__createPeerConnection(user);
      user.dc = user.pc.createDataChannel('chat');

      await user.pc.setRemoteDescription(offer);
      const answer = await user.pc.createAnswer();
      await user.pc.setLocalDescription(answer);

      this.send({
        to: user.id,
        command: 'answer',
        answer: answer
      });
    },

    async __answerReceived(answer, from) {
      const user = this.__getUser(from);

      if (!user) {
        console.log(`ERROR: answer, unable to find user with id = ${from}`);
        return;
      }

      console.log(`RTC answer received from ${user.username}`);

      if (!user.pc) {
        console.log(`ERROR: ${user.username} does not have peer connection!`);
        return;
      }

      await user.pc.setRemoteDescription(answer);
    },

    __candidateReceived(candidate, from) {
      const user = this.__getUser(from);
      if (!user) {
        console.log(`ERROR: candidate, unable to find user with id = ${from}`);
        return;
      }
      console.log(`RTC candidate received from ${user.username}: ${candidate.candidate}`);

      try {
        user.pc.addIceCandidate(candidate);
      } catch (e) {
        console.log(`Unable to add candidate from ${user.username}`);
      }
    },

    addMessage(user, content) {
      if (!this.joinedRoom) {
        return;
      }
      const message = new Message(user.username, content, user.avatarUrl);
      this.$refs.chat.addMessage(message);
    },

    sendMessage(message) {
      const currentUser = this.__getUser(this.uid);

      if (!this.joinedRoom) {
        return;
      }

      let targetUsername = '';
      if (message.startsWith('@')) {
        targetUsername = message.split(/[',. !?;:]/)[0];
      }
      console.log(targetUsername);

      let messageSent = false;
      for (const user of this.joinedRoom.users) {
        if (user.id !== this.uid && (targetUsername.toLowerCase() === user.username.toLowerCase() || !targetUsername)) {
          user.dc.send(message)
          messageSent = true;
        }
      }

      if (messageSent || this.joinedRoom.users.length === 1) {
        this.addMessage(currentUser, message);
      } else {
        this.$refs.chat.setMessage(message);
        this.$store.state.popups.alert('Пользователь не найден!', 'Не удалось отправить сообщение!');
      }
    },

    updateDots() {
      if (this.dots.length === 3) {
        this.dots = '.';
      } else {
        this.dots += '.';
      }
    },

    async roomJoin(id) {
      const room = this.__getRoom(id);
      let password = '';
      if (room.hasPassword) {
        password = await this.$store.state.modal.prompt('Введите пароль', undefined, undefined, true);
      }

      this.send({
        command: 'joinRoom',
        id, password
      });
    },

    async roomCreate() {
      if (this.createName.length === 0) {
        this.$store.state.modal.alert('Название не может быть пустым');
        return;
      }

      this.devices = await this.__getDevices();

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        },
        video: {
          width: 1280,
          height: 720,
          frameRate: 30
        }
      });

      const data = {
        command: 'createRoom',
        name: this.createName,
        password: this.createPassword,
        maxUsers: this.createMaxUsers
      }
      this.send(data);
    },

    roomLeave() {
      if (this.stream) {
        for (const track of this.stream.getTracks()) {
          track.stop();
        }
      }

      this.send({
        command: 'leaveRoom',
      });
    },

    async waitForLogin() {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.$store.state.user.isLogined) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    },

    setRoom(data) {
      data = data.room;

      if (this.joinedRoom) {
        return;
      }
      const users = [];
      for (const user in data.users) {
        users.push(new User(user.id, user.username, user.fullname, user.avatarUrl));
      }

      let host = false;
      if (data.users.length > 0) {
        host = this.uid === data.users[0].id;
      }

      const owner = new User(data.owner.id, data.owner.username, data.owner.fullname, data.owner.avatarUrl);
      this.joinedRoom = new Room(data.id, data.name, owner, data.usersMax, data.hasPassword, host, data.users);
      if (host) {
        const currentUser = this.__getUser(this.uid);
        if (currentUser) {
          currentUser.stream = this.stream;
        } else {
          console.log('WARN: currentUser is undefined');
        }
      }
    },

    async userConnected(user) {
      user.pc = this.__createPeerConnection(user, this.stream);
      user.dc = user.pc.createDataChannel('chat');

      const offer = await user.pc.createOffer();
      await user.pc.setLocalDescription(offer);
      this.send({
        to: user.id,
        command: 'offer',
        offer: offer
      });

      this.joinedRoom.addUser(user);
      await this.sounds.userJoined.play();
    },

    wsOpenAction() {
      this.connected = true;
      this.wasConnected = true;

      this.send({
        command: 'setInfo',
        jwtToken: this.$store.state.user.jwtToken
      });
      this.send({ command: 'getRooms' });
    },

    wsCloseAction() {
      this.connected = false;
      this.joinedRoom = null;
      this.updateDots();
    },

    wsMessageHandler(message) {
      const data = JSON.parse(message.data);
      const command = data.command;

      if (command === 'setRooms') {
        this.rooms = data.rooms;
      } else if (command === 'setRoom') {
        this.setRoom(data);
      } else if (command === 'leaveRoom') {
        if (data.kick) {
          this.$store.state.popups.alert('Вы были исключены из комнаты!');
        }
        this.joinedRoom = null;
      } else if (command === 'addRoomUser') {
        this.userConnected(new User(data.id, data.username, data.fullname, data.avatarUrl));
      } else if (command === 'deleteRoomUser') {
        this.joinedRoom.deleteUser(data.id);
        this.sounds.userLeft.play();
      } else if (command === 'setInfo') {
        this.uid = data.id;
        this.iceServers = data.iceServers;
      } else if (command === 'candidate') {
        this.__candidateReceived(data.candidate, data.from);
      } else if (command === 'offer') {
        this.__offerReceived(data.offer, data.from);
      } else if (command === 'answer') {
        this.__answerReceived(data.answer, data.from);
      } else if (command === 'ping') {
        this.send({ command: 'pong' });
      } else if (command === 'error') {
        this.$store.state.popups.error('Ошибка!', data.message);
      } else {
        console.log(`WS ERROR: Unknown command ${command} received`);
      }
    },
  },

  async mounted() {
    // only after some time username is available
    await this.waitForLogin();

    ws = new ReconnectingWebSocket(WS_ROOMS_URL, {
      open: () => this.wsOpenAction(),
      close: () => this.wsCloseAction(),
      message: (message) => this.wsMessageHandler(message)
    });
  },
}
</script>
