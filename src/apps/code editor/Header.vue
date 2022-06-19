<style lang="stylus">
  @require "../../styles/constants.styl"

  .header-editor
    .top-line
      > a
      > div
        letter-spacing 1px
        padding 0 15px
      .logo
        margin 0

  .header.header-editor
    margin-bottom 0

  .control-button::before
    background linear-gradient(#2A9922, highLightColorTransparent, transparent) 0 100% / 100% 200% no-repeat
  .control-button.warning::before
    background linear-gradient(#ffe344, transparent) 0 100% / 100% 200% no-repeat
  .control-button.danger::before
    background linear-gradient(#ff2e1f, transparent) 0 100% / 100% 200% no-repeat

  .logo
    padding 0 10px
    margin-right 15px
    @media screen and ({mobile})
      margin-right 0

  .header
    .top-line
      .back-button
        display flex
        align-items center
        svg
          height 30px
      .change-together
        padding 5px 20px
        svg
          height 35px
          fill white
      .leave-session
        display flex
        align-items center
        svg
          transform rotate(180deg)
          height 32px
          fill white
      .copy-join-link
        display flex
        align-items center
        svg
          margin-left 10px
          height 26px
          fill white
</style>

<template>
  <div class="header header-editor">
    <div class="top-line">
      <router-link to="/" class="mobile-hide first-child"><div class="logo"><strong>LioKor Code</strong> <span @contextmenu="showVersion">{{ version }}</span></div></router-link>
      <router-link to="/" class="desktop-hide first-child back-button">
        <svg class="desktop-hide" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>
        <div class="logo"><strong>LK Code</strong></div>
      </router-link>
      <router-link to="/" class="back-button mobile-hide">Задания</router-link>
      <div class="control-button" v-show="!isCheckInProgress && !isCheckError" @click=checkStartEmit>Проверить<span class="mobile-hide"> (F9)</span></div>
      <div class="control-button warning" v-show="isCheckInProgress" :disabled="isCheckInProgress">Проверяем...</div>
      <div class="control-button danger" v-show="isCheckError" :disabled="isCheckError">Нужна авторизация...</div>

      <div class="change-together" v-show="!redactorSessionUid" @click="openSession">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M23.7 23.7Q25 22.1 25.625 20.4Q26.25 18.7 26.25 16.45Q26.25 14.2 25.625 12.5Q25 10.8 23.7 9.2Q27.5 8.35 30.375 10.35Q33.25 12.35 33.25 16.45Q33.25 20.55 30.375 22.55Q27.5 24.55 23.7 23.7ZM34.5 40V35.3Q34.5 32.75 33.2 30.55Q31.9 28.35 28.7 26.85Q37.35 27.95 40.525 30.05Q43.7 32.15 43.7 35.3V40ZM40 25.55V20.55H35V17.55H40V12.55H43V17.55H48V20.55H43V25.55ZM15.75 23.95Q12.45 23.95 10.35 21.85Q8.25 19.75 8.25 16.45Q8.25 13.15 10.35 11.05Q12.45 8.95 15.75 8.95Q19.05 8.95 21.15 11.05Q23.25 13.15 23.25 16.45Q23.25 19.75 21.15 21.85Q19.05 23.95 15.75 23.95ZM0 40V35.3Q0 33.55 0.925 32.125Q1.85 30.7 3.4 30Q7 28.4 9.825 27.7Q12.65 27 15.75 27Q18.85 27 21.65 27.7Q24.45 28.4 28.05 30Q29.6 30.7 30.55 32.125Q31.5 33.55 31.5 35.3V40ZM15.75 20.95Q17.7 20.95 18.975 19.675Q20.25 18.4 20.25 16.45Q20.25 14.5 18.975 13.225Q17.7 11.95 15.75 11.95Q13.8 11.95 12.525 13.225Q11.25 14.5 11.25 16.45Q11.25 18.4 12.525 19.675Q13.8 20.95 15.75 20.95ZM3 37H28.5V35.3Q28.5 34.5 28.1 33.8Q27.7 33.1 26.85 32.7Q23.4 31.1 21 30.55Q18.6 30 15.75 30Q12.9 30 10.525 30.55Q8.15 31.1 4.6 32.7Q3.85 33.05 3.425 33.775Q3 34.5 3 35.3ZM15.75 16.45Q15.75 16.45 15.75 16.45Q15.75 16.45 15.75 16.45Q15.75 16.45 15.75 16.45Q15.75 16.45 15.75 16.45Q15.75 16.45 15.75 16.45Q15.75 16.45 15.75 16.45Q15.75 16.45 15.75 16.45Q15.75 16.45 15.75 16.45ZM15.75 37Q15.75 37 15.75 37Q15.75 37 15.75 37Q15.75 37 15.75 37Q15.75 37 15.75 37Q15.75 37 15.75 37Q15.75 37 15.75 37Q15.75 37 15.75 37Q15.75 37 15.75 37Z"/></svg>
      </div>
      <div class="leave-session" v-show="redactorSessionUid" @click="leaveSession">
        <span class="mobile-hide">Отключиться</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M6 25.5V22.5H24.3L18.4 16.6L20.65 14.35L30.3 24L20.65 33.65L18.4 31.4L24.3 25.5ZM9 28.5V39Q9 39 9 39Q9 39 9 39H39Q39 39 39 39Q39 39 39 39V8.9Q39 8.9 39 8.9Q39 8.9 39 8.9H9Q9 8.9 9 8.9Q9 8.9 9 8.9V19.5H6V8.9Q6 7.7 6.9 6.8Q7.8 5.9 9 5.9H39Q40.2 5.9 41.1 6.8Q42 7.7 42 8.9V39Q42 40.2 41.1 41.1Q40.2 42 39 42H9Q7.8 42 6.9 41.1Q6 40.2 6 39V28.5Z"/></svg>
      </div>
      <div class="copy-join-link" v-show="redactorSessionUid" @click="copyLinkToClipboard">
        <span class="mobile-hide">Копировать приглашение</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 460">
          <g><path d="M425.934,0H171.662c-18.122,0-32.864,14.743-32.864,32.864v77.134h30V32.864c0-1.579,1.285-2.864,2.864-2.864h254.272     c1.579,0,2.864,1.285,2.864,2.864v254.272c0,1.58-1.285,2.865-2.864,2.865h-74.729v30h74.729     c18.121,0,32.864-14.743,32.864-32.865V32.864C458.797,14.743,444.055,0,425.934,0z"/><path d="M288.339,139.998H34.068c-18.122,0-32.865,14.743-32.865,32.865v254.272C1.204,445.257,15.946,460,34.068,460h254.272     c18.122,0,32.865-14.743,32.865-32.864V172.863C321.206,154.741,306.461,139.998,288.339,139.998z M288.341,430H34.068     c-1.58,0-2.865-1.285-2.865-2.864V172.863c0-1.58,1.285-2.865,2.865-2.865h254.272c1.58,0,2.865,1.285,2.865,2.865v254.273h0.001     C291.206,428.715,289.92,430,288.341,430z"/></g>
          <g transform="scale(5) translate(-2, 60) rotate(-45)"><path d="M22.5 34H14Q9.75 34 6.875 31.125Q4 28.25 4 24Q4 19.75 6.875 16.875Q9.75 14 14 14H22.5V17H14Q11 17 9 19Q7 21 7 24Q7 27 9 29Q11 31 14 31H22.5ZM16.25 25.5V22.5H31.75V25.5ZM25.5 34V31H34Q37 31 39 29Q41 27 41 24Q41 21 39 19Q37 17 34 17H25.5V14H34Q38.25 14 41.125 16.875Q44 19.75 44 24Q44 28.25 41.125 31.125Q38.25 34 34 34Z"/></g>
        </svg>
      </div>

      <router-link v-if="$store.state.user.isLogined" to="/profile" class="right profile-button mobile-hide">
        <span class="username">{{$store.state.user.username}}</span>
<!--        Если аватарка анимированная, она сильно мешает кодить - отвлекает-->
<!--        <img class="avatar-preview gif-hover-activate" :src="$store.state.user.avatarUrl" alt="">-->
      </router-link>
      <router-link v-else to="/signin" class="right">Войти</router-link>
    </div>
  </div>
</template>

<script>
  const queryParamsName = {
    sessionId: 'session',
    //taskId: 'task',
    filename: 'file',
  };

  export default {
    data() {
      return {
        version: VERSION,
        buildDate: (new Date(BUILD_TIMESTAMP)).toLocaleDateString('en-GB'),
        isCheckInProgress: false,
        isCheckError: false,
        redactorSessionUid: undefined,
        redactorJoinLink: '',
      }
    },

    mounted() {
      window.addEventListener('keydown', (ev) => {
        if (ev.key === 'F9') {
          this.checkStartEmit();
        }
      });

      this.tryToLinkToURL(location.href);
      this.$store.state.eventBus.on('connect-to-editor', this.tryToLinkToURL);
    },
    unmounted() {
      this.$store.state.eventBus.off('connect-to-editor', this.tryToLinkToURL);
    },

    methods: {
      async tryToLinkToURL(url) {
        if (this.redactorSessionUid)
          await this.leaveSession();

        url = new URL(url);
        const sessionId = url.searchParams.get(queryParamsName.sessionId);
        //const taskId = url.searchParams.get(queryParamsName.taskId);
        const filename = url.searchParams.get(queryParamsName.filename);
        if (sessionId !== null) {
          console.log("CONNECT", sessionId);
          this.connectToSession(sessionId, filename);
          this.redactorJoinLink = location.href;
        }
      },
      showVersion() {
        this.$store.state.popups.alert(`Build date: ${this.buildDate}`)
      },
      checkStartEmit() {
        if (this.isCheckInProgress === false) {
          this.$emit('startCheck');
        }
      },
      checkBegin() {
        this.isCheckInProgress = true;
      },
      checkDone() {
        this.isCheckInProgress = false;
      },
      checkError() {
        this.isCheckError = true;
      },

      async openSession() {
        if (!await this.$store.state.modal.confirm('Вы уверены, что хотите открыть текущий файл для совместного редактирования?', 'Подключиться сможет любой, кому вы предоставите ссылку')) {
          return;
        }

        if (this.$parent.isAllFilesClosed) {
          this.$store.state.popups.error('Сперва откройте файл, чтобы открыть его для редактирования');
          return;
        }

        const uid = await this.$store.state.api.openRedactorSession(this.$parent.$refs.editor.aceEditor.getValue());
        if (!uid.ok_) {
          this.$store.state.popups.error('Не удалось создать сессию');
          return;
        }
        this.redactorSessionUid = uid.id;
        const url = new URL(location.href);
        url.searchParams.append(queryParamsName.sessionId, this.redactorSessionUid);
        url.searchParams.append(queryParamsName.filename, this.$parent.$refs.tabs.getSelected().uniqueValue.name);
        this.redactorJoinLink = url.toString();
        this.$store.state.popups.success('Сессия создана');

        this.$emit('openSession', uid.id);
      },
      async leaveSession(userConfirm = false, noParentCall = false) {
        if (userConfirm && (!await this.$store.state.modal.confirm('Вы уверены, что хотите покинуть сессию?', 'Сессия будет закрыта, если все участники выйдут'))) {
          return;
        }

        console.log("LEAVE", this.redactorSessionUid);
        this.redactorSessionUid = undefined;
        this.redactorJoinLink = '';

        const url = new URL(location.href);
        url.searchParams.delete(queryParamsName.sessionId);
        url.searchParams.delete(queryParamsName.filename);
        history.pushState(null, null, url.toString());

        this.$parent.$refs.tabs.deleteTabByItem(this.uniqueRemoteTab);
        this.uniqueRemoteTab = undefined;

        if (!noParentCall)
          await this.$parent.leaveSession();

      },
      async connectToSession(uid, filename) {
        if (uid === undefined) {
          const uid = await this.$store.state.modal.prompt('Ведите ID сессии');
          if (!uid)
            return;
        }

        this.$store.state.popups.success('Вы подключились к сессии');
        this.redactorSessionUid = uid;

        this.uniqueRemoteTab = {name: null, value: ''};
        await this.$parent.$refs.tabs.addTab({
          name: "remote: " + filename,
          closable: false,
          uniqueValue: this.uniqueRemoteTab
        });
        this.$emit('connectSession', uid, filename);
      },

      async copyLinkToClipboard() {
        if (!this.redactorSessionUid)
          return;

        await navigator.clipboard.writeText(this.redactorJoinLink);
        this.$store.state.popups.success('Ссылка скопирована в буфер обмена');
      }
    }
  }
</script>
