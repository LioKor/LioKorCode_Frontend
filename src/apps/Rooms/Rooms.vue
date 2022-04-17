<style lang="stylus">
@import '../../styles/constants.styl'

width = 640px

#rooms
  height 100vh
  background-color #0c2129
  overflow-y auto
  color textColor1
  width 100%
  padding 0 20px

  .room-join-or-create
    max-width width

    .create-room
      margin-bottom 10px
      input
        width 100%

    .room
      display flex
      cursor pointer
      margin-bottom 10px
      transition 0.2s ease background-color
      .name
        flex-grow 1
    .room:hover
      background-color clHighlight

  .room-users
    max-width width
    .user
      margin-bottom 10px
      video
        margin-top 10px
        max-width 100%
        max-height 256px
</style>

<template>
  <div class="rooms">
    <div v-if="!this.$store.state.user.isLogined">
      <h1>Комнаты</h1>
      <h2><router-link to="/signin">Авторизуйтесь</router-link>, чтобы создать или присоединиться к комнате</h2>
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
    <div v-else-if="!joinedRoom">
      <div class="room-join-or-create">
        <h1>Комнаты</h1>

        <h2>Создать</h2>
        <form>
          <div class="form-group">
            <input v-model="createName" type="text" class="form-control" placeholder="Название" maxlength="48">
          </div>

<!--          <div class="form-group">-->
<!--            <input v-model="createMaxUsers" type="number" class="form-control" placeholder="Максимальное кол-во участников">-->
<!--          </div>-->

          <div class="form-group">
            <button class="btn" @click.prevent="roomCreate">Создать</button>
          </div>
        </form>

        <h2>Список комнат</h2>
        <div class="rooms-list">
<!--          <form class="create-room">-->
<!--            <input type="text" class="form-control" placeholder="Поиск (id или название комнаты)">-->
<!--          </form>-->
          <div v-for="room in this.rooms" class="room form-control" @click="roomJoin(room.id)">
            <div class="name">{{ room.name }}</div>
            <div class="users">{{ room.usersAmount }}<!-- / {{ room.usersMax }}--></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="room-users">
      <h1>{{ joinedRoom.name }}</h1>
      <button class="btn btn-danger" @click="roomLeave">
        <span v-if="joinedRoom.host">Удалить</span>
        <span v-else>Покинуть</span>
      </button>
      <h2>Участники {{ joinedRoom.users.length }}<!-- / {{ joinedRoom.maxUsers }}--></h2>
      <div class="users">
        <div v-for="(user, index) in joinedRoom.users" class="user form-control">
          <div class="username">{{ user.username }}<span v-show="index === 0"> 👑</span></div>
          <div v-if="user.stream">
            <video :srcObject.prop="user.stream" autoplay controls></video>
          </div>
        </div>
      </div>

      <h2>Chat</h2>
      <Chat ref="chat" @sendMessage="sendMessage" />
    </div>
  </div>
</template>

<script>

import Chat from './Chat.vue'

import { Room, User, Message } from './models'

const WS_ADDR = (window.location.hostname === 'localhost')? 'localhost:9090': `${window.location.hostname}/ws`
const WS_ROOMS_URL = `${(window.location.protocol === 'http:')? 'ws': 'wss'}://${WS_ADDR}`

const CONNECT_TIMEOUT = 2000

const BASE_RECONNECT_TIMEOUT = 1000
const MAX_RECONNECT_TIMEOUT = 60 * 1000

let ws = null
let reconnectTimeout = BASE_RECONNECT_TIMEOUT

export default {
  components: { Chat },

  data() {
    return {
      dots: '...',

      connected: false,
      wasConnected: false,

      joinedRoom: null, //new Room('asdfasdfsda', 'Wolf', '10', []),

      createName: 'Волчачье логово 🐺',
      createMaxUsers: 10,

      rooms: [],

      iceServers: null,

      devices: null,
      stream: null
    }
  },

  methods: {
    send(data) {
      ws.send(JSON.stringify(data))
    },

    __getUser(id) {
      for (const user of this.joinedRoom.users) {
        if (user.id === id) {
          return user
        }
      }
      return null
    },

    async __getDevices() {
      try {
        /*if (!window.localStorage.getItem('hasMediaPermission')) {
          this.$store.state.modal('Доступ к устройствам', 'Сейчас мы попросим предоставить доступ к вашему микрофону и камере.');
        }*/
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });

        const devices = await navigator.mediaDevices.enumerateDevices();

        for (const track of stream.getTracks()) {
          track.stop();
        }

        // window.localStorage.setItem('hasMediaPermission', true);
        return devices;
      } catch (e) {
        // window.localStorage.getItem('hasMediaPermission', false);
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
          console.log(ev.data)
          // addMessage(messagesDiv, {
          //   username: user.username,
          //   avatarUrl: user.avatarUrl,
          //   datetime: new Date(),
          //   content: ev.data
          // })
          // this.messageSound.play()
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

    sendMessage(message) {
      this.send({
        command: 'sendMessage',
        content: message
      })
    },

    updateDots() {
      if (this.dots.length === 3) {
        this.dots = '.'
      } else {
        this.dots += '.'
      }
    },

    roomJoin(id) {
      this.send({
        command: 'joinRoom',
        id: id
      })
    },

    async roomCreate() {
      if (this.createName.length === 0) {
        this.$store.state.modal.alert('Название не может быть пустым')
        return
      }

      this.devices = await this.__getDevices()

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        },
        video: true
      });

      const data = {
        command: 'createRoom',
        name: this.createName,
        maxUsers: this.createMaxUsers
      }
      this.send(data);
    },

    roomLeave() {
      if (this.stream) {
        for (const track of this.stream.getTracks()) {
          track.stop()
        }
      }

      this.send({
        command: 'leaveRoom',
      })
    },

    async waitForUsername() {
      const self = this;
      return new Promise(function(resolve) {
        const checkInterval = setInterval(function() {
          if (self.$store.state.user.username) {
            clearInterval(checkInterval);
            resolve()
          }
        }, 100)
      })
    },

    async userConnected(user) {
      user.pc = this.__createPeerConnection(user, this.stream)
      const offer = await user.pc.createOffer({
        offerToReceiveAudio: 1
      })
      await user.pc.setLocalDescription(offer)
      this.send({
        to: user.id,
        command: 'offer',
        offer: offer
      })

      this.joinedRoom.addUser(user)
    },

    createWsConnection() {
      ws = new WebSocket(WS_ROOMS_URL);

      setTimeout(function() {
        if (ws.readyState === 0) {
          ws.close()
        }
      }.bind(this), CONNECT_TIMEOUT)

      ws.addEventListener('close', function() {
        this.connected = false
        this.joinedRoom = null
        ws = null
        setTimeout(function() {
          if (this.connected) {
            return
          }
          this.updateDots()
          this.createWsConnection()
          if (reconnectTimeout < MAX_RECONNECT_TIMEOUT) {
            reconnectTimeout *= 2
          }
        }.bind(this), reconnectTimeout)
      }.bind(this))

      ws.addEventListener('open', () => {
        reconnectTimeout = BASE_RECONNECT_TIMEOUT
        this.connected = true
        this.wasConnected = true

        this.send({
          command: 'setInfo',
          username: this.$store.state.user.username
        })
        this.send({ command: 'getRooms' })
      })

      ws.addEventListener('message', (message) => {
        const data = JSON.parse(message.data)

        if (data.command === 'setRooms') {
          this.rooms = data.rooms
        } else if (data.command === 'setRoom') {
          if (this.joinedRoom) {
            return
          }
          const users = []
          for (const user in data.users) {
            users.push(new User(user.id, user.username))
          }
          const host = data.users[0].username === this.$store.state.user.username;
          this.joinedRoom = new Room(data.id, data.name, data.maxUsers, host, data.users)
        } else if (data.command === 'leaveRoom') {
          if (data.kick) {
            alert('Вы были исключены из комнаты!')
          }
          this.joinedRoom = null;
        } else if (data.command === 'addMessage') {
          if (!this.joinedRoom) {
            return
          }
          const message = new Message(data.username, data.content)
          this.$refs.chat.addMessage(message)
        } else if (data.command === 'addRoomUser') {
          this.userConnected(new User(data.id, data.username))
        } else if (data.command === 'deleteRoomUser') {
          this.joinedRoom.deleteUser(data.id)
        } else if (data.command === 'setInfo') {
          this.iceServers = data.iceServers
        } else if (data.command === 'candidate') {
          this.__candidateReceived(data.candidate, data.from)
        } else if (data.command === 'offer') {
          this.__offerReceived(data.offer, data.from)
        } else if (data.command === 'answer') {
          this.__answerReceived(data.answer, data.from)
        } else if (data.command === 'error') {
          console.log(`WS ERROR: ${data.message}`);
        } else {
          console.log(`WS ERROR: Unknown command ${data.command} received`)
        }
      });
    }
  },

  async mounted() {
    // only after some time username is available
    await this.waitForUsername()

    this.createWsConnection()
  },
}
</script>
