<style lang="stylus">
bgColor1 = #282C34
bgColor2 = #1D1E1F
bgColor3 = #252627

highlightColor = orange

textColor1 = #DADADA
textColor2 = #AAA

chatPadding = 10px
fontSize = 18px

div.chat
  background-color bgColor2
  border-radius 8px
  max-width 640px
  height 480px
  margin-bottom 32px

  div.messages
    padding chatPadding
    overflow-y scroll
    height 100%

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
            margin-left 5px
            font-style italic
            font-size 0.9em
            color textColor2
          margin-bottom 8px
    div.message:not(:last-child)
      margin-bottom 16px
  div.message-input
    display flex
    height = fontSize + chatPadding * 2
    height height

    .message-textarea
      flex-grow 1
      textarea
        margin 0

        font-family Arial

        height height
        font-size fontSize
        padding chatPadding

        border-radius 0 0 0 8px
        border none

        color textColor1
        background-color bgColor3

        width 100%
        resize none
        box-shadow none
        outline none
        overflow hidden
    .send-button
      button
        font-size 1rem
        height height
        width height
        padding 0
        border-radius 0 0 8px 0
        svg
          width (height / 2)
          height (height / 2)
</style>

<template>
  <div class="chat">
    <div id="messagesDiv" ref="messagesList" class="messages">
      <div v-for="message in messages" class="message">
        <div class="avatar">
          <img alt="" src="">
        </div>
        <div class="body">
          <div class="title">
            <a href="#" class="username" target="_blank">{{ message.username }}</a>
            <span class="datetime">{{ message.date.toLocaleString() }}</span>
          </div>
          <div class="content" v-html="message.content"></div>
        </div>
      </div>
    </div>

    <div class="message-input">
      <div class="message-textarea">
        <textarea
            rows="1"
            v-model="message"
            @keydown.ctrl.enter.prevent="sendMessage"
            placeholder="Ваше сообщение... (Ctrl+Enter для отправки)"
        >
        </textarea>
      </div>
      <div class="send-button">
        <button class="btn" :class="{ 'btn-disabled': message.length === 0}" @click="sendMessage">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      message: '',
      messages: []
    }
  },

  methods: {
    sendMessage() {
      if (this.message.length > 0) {
        const message = this.message
        this.message = ''
        this.$emit('sendMessage', message)
      }
    },

    setMessage(message) {
      this.message = message
    },

    scrollToBottom() {
      this.$refs.messagesList.scrollTop = this.$refs.messagesList.scrollHeight
    },

    async addMessage(message) {
      this.messages.push(message)
      await this.$nextTick()
      this.scrollToBottom()
    }
  }
}
</script>
