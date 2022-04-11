<style lang="stylus">
@import '../../styles/constants.styl'

#rooms
  height 100vh
  background-color #0c2129
  overflow-y auto
  color textColor1
  width 100%
  padding 0 20px

  .room-join-or-create
    max-width 500px

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
    .user
      margin-bottom 10px
</style>

<template>
  <div @contextmenu.prevent="state = !state">
    <div v-if="!connected">
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
    <div v-else-if="!this.$store.state.user.isLogined">
      <h1>Комнаты</h1>
      <h2><router-link to="/signin">Авторизуйтесь</router-link>, чтобы создать или присоединиться к комнате</h2>
    </div>
    <div v-else-if="!joinedRoom">
      <div class="room-join-or-create">
        <h1>Комнаты</h1>

        <h2>Создать</h2>
        <form>
          <div class="form-group">
            <input v-model="createName" type="text" class="form-control" placeholder="Название">
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
      <button class="btn btn-danger" @click="roomLeave">Покинуть</button>
      <h2>Участники {{ joinedRoom.users.length }}<!-- / {{ joinedRoom.maxUsers }}--></h2>
      <div class="users">
        <div v-for="user in joinedRoom.users" class="user form-control">
          <div class="username">{{ user.username }}</div>
        </div>
      </div>

      <h2>Chat</h2>
      <Chat ref="chat" @sendMessage="sendMessage" />
    </div>
  </div>
</template>

<script>

import Chat from './Chat.vue'

import { Room, Message } from './models'

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

      createName: 'Волчачье логово',
      createMaxUsers: 10,

      rooms: [],
    }
  },

  methods: {
    sendMessage(message) {
      ws.send(JSON.stringify({
        command: 'sendMessage',
        content: message
      }));
    },

    updateDots() {
      if (this.dots.length === 3) {
        this.dots = '.'
      } else {
        this.dots += '.'
      }
    },

    roomJoin(id) {
      ws.send(JSON.stringify({
        command: 'joinRoom',
        id: id
      }));
    },

    roomCreate() {
      const data = JSON.stringify({
        command: 'createRoom',
        name: this.createName,
        maxUsers: this.createMaxUsers
      })
      ws.send(data);
    },

    roomLeave() {
      ws.send(JSON.stringify({
        command: 'leaveRoom',
      }))
    },

    async waitForUsername() {
      const self = this;
      return new Promise(function(resolve) {
        const checkInterval = setInterval(function() {
          if (self.$store.state.user.username) {
            clearInterval(checkInterval);
            resolve()
          }
        }, 50)
      })
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
        ws = null
        setTimeout(function() {
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

        ws.send(JSON.stringify({
          command: 'setInfo',
          username: this.$store.state.user.username
        }))
        ws.send(JSON.stringify({ command: 'getRooms' }));
      })

      ws.addEventListener('message', (message) => {
        const data = JSON.parse(message.data)

        if (data.command === 'setRooms') {
          this.rooms = data.rooms
        } else if (data.command === 'setRoom') {
          this.joinedRoom = new Room(data.id, data.name, data.maxUsers, data.users)
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
        } else if (data.command === 'error') {
          console.log(`WS ERROR: ${data.message}`);
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
