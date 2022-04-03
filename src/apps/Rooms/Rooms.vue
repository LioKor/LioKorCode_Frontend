<style lang="stylus">
@import '../../styles/constants.styl'

bgColor1 = #282C34
bgColor2 = #1D1E1F
bgColor3 = #252627

highlightColor = orange

textColor1 = #DADADA
textColor2 = #AAA

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

  div.chat
    background-color bgColor2
    border-radius 8px
    max-width 640px
    height 480px
    margin-bottom 32px

    div.messages
      padding 8px
      overflow-y scroll
      height 80%

      div.message
        display flex

        div.avatar
          img
            width 48px
            height 48px
            border-radius 32px
        div.body
          margin-left 16px
          div.title
            a.username
              text-decoration none
              font-weight bold
            span.datetime
              font-style italic
              font-size 0.9em
              color textColor2
            margin-bottom 8px
      div.message:not(:last-child)
        margin-bottom 16px
    div.message-input
      height 20%

      textarea
        height 100%
        font-family Arial
        border-radius 0 0 8px 8px
        border none
        padding 8px

        color textColor1
        background-color bgColor3

        display block
        width 100%
        resize none
        box-shadow none
        outline none
</style>

<template>
  <div @contextmenu.prevent="state = !state">
    <div v-if="!this.$store.state.user.isLogined">
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
      <div class="chat">
        <div id="messagesDiv" class="messages" ref="messages">
          <div v-for="message in messages" class="message">
            <div class="avatar">
              <img alt="" src="">
            </div>
            <div class="body">
              <div class="title">
                <a href="#" class="username" target="_blank">{{ message.username }}</a>
                <span class="datetime"></span>
              </div>
              <div class="content">{{ message.content }}</div>
            </div>
          </div>
        </div>

        <div class="message-input">
          <textarea
              v-model="message"
              @keydown.ctrl.enter.prevent="sendMessage"
              placeholder="Your message... (Ctrl+Enter to send)"
          >
          </textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const WS_ROOMS_URL = `ws://${document.location.hostname}:9090`

let ws = null;

class Message {
  constructor(username, content) {
    this.username = username;
    this.content = content;
  }
}

class Room {
  constructor(id, name, maxUsers, users) {
    this.id = id
    this.name = name;
    this.maxUsers = maxUsers;

    this.users = users
  }
}

export default {
  components: { },

  data() {
    return {
      joinedRoom: null, //new Room('asdfasdfsda', 'Wolf', '10', []),

      createName: 'Волчачье логово',
      createMaxUsers: 10,

      rooms: [],

      message: '',
      messages: []
    }
  },

  methods: {
    sendMessage() {
      ws.send(JSON.stringify({
        command: 'sendMessage',
        content: this.message
      }));
      this.message = '';
    },

    roomJoin(id) {
      this.messages = [];
      ws.send(JSON.stringify({
        command: 'joinRoom',
        id: id
      }));
    },

    roomCreate() {
      this.messages = []
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
  },

  async mounted() {
    // only after some time username is available
    await this.waitForUsername();

    ws = new WebSocket(WS_ROOMS_URL);
    ws.addEventListener('open', () => {
      console.log('WebSocket connected!')

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
        this.messages.push(new Message(data.username, data.content));
      } else if (data.command === 'error') {
        alert(data.message);
      }
    });
  },
}
</script>
