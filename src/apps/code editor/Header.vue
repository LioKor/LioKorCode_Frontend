<style lang="stylus">
  @require "../../styles/constants.styl"

  .header-editor
    .topLine
      > a
      > div
        letter-spacing 1px
        padding 0 10px
      .logo
        margin 0

  .header.header-editor
    margin-bottom 0
    .join-link-button
      svg
        margin-left 10px
        margin-bottom -3px
        width 20px
        fill textColor3

  .control-button::before
    background linear-gradient(#2A9922, highLightColorTransparent, transparent) 0 100% / 100% 200% no-repeat
  .control-button.warning::before
    background linear-gradient(#ffe344, transparent) 0 100% / 100% 200% no-repeat
  .control-button.danger::before
    background linear-gradient(#ff2e1f, transparent) 0 100% / 100% 200% no-repeat

  .logo
    padding 0 10px
    margin-right 15px
    @media screen and (max-width: $mobileWidth) {
      margin-right 0
    }
</style>

<template>
  <div class="header header-editor">
    <div class="topLine">
      <router-link to="/" class="mobile-hide"><div class="logo"><strong>LioKor Code</strong> <span @contextmenu="showVersion">{{ version }}</span></div></router-link>
      <router-link to="/" class="mobile-show"><div class="logo"><strong>LK Code</strong></div></router-link>
      <router-link to="/">Задания</router-link>
      <div class="control-button" v-show="!isCheckInProgress && !isCheckError" @click=checkStartEmit>Check<span class="mobile-hide"> (F9)</span></div>
      <div class="control-button warning" v-show="isCheckInProgress" :disabled="isCheckInProgress">Checking...</div>
      <div class="control-button danger" v-show="isCheckError" :disabled="isCheckError">Need auth</div>

      <div v-show="!redatorSessionUid" @click="openSession">Открыть сессию</div>
      <div v-show="redatorSessionUid" @click="leaveSession">Отключиться</div>
      <div v-show="redatorSessionUid" @click="copyLinkToClipboard" class="join-link-button">
        Копировать приглашение <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 460"><g><path d="M425.934,0H171.662c-18.122,0-32.864,14.743-32.864,32.864v77.134h30V32.864c0-1.579,1.285-2.864,2.864-2.864h254.272     c1.579,0,2.864,1.285,2.864,2.864v254.272c0,1.58-1.285,2.865-2.864,2.865h-74.729v30h74.729     c18.121,0,32.864-14.743,32.864-32.865V32.864C458.797,14.743,444.055,0,425.934,0z"/><path d="M288.339,139.998H34.068c-18.122,0-32.865,14.743-32.865,32.865v254.272C1.204,445.257,15.946,460,34.068,460h254.272     c18.122,0,32.865-14.743,32.865-32.864V172.863C321.206,154.741,306.461,139.998,288.339,139.998z M288.341,430H34.068     c-1.58,0-2.865-1.285-2.865-2.864V172.863c0-1.58,1.285-2.865,2.865-2.865h254.272c1.58,0,2.865,1.285,2.865,2.865v254.273h0.001     C291.206,428.715,289.92,430,288.341,430z"/></g></svg>
      </div>

      <router-link v-if="$store.state.user.isLogined" to="/profile" class="right">{{$store.state.user.username}}</router-link>
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
        redatorSessionUid: undefined,
        redactorJoinLink: '',
      }
    },

    mounted() {
      window.addEventListener('keydown', (ev) => {
        if (ev.key === 'F9') {
          this.checkStartEmit();
        }
      });

      const url = new URL(location.href);
      const sessionId = url.searchParams.get(queryParamsName.sessionId);
      //const taskId = url.searchParams.get(queryParamsName.taskId);
      const filename = url.searchParams.get(queryParamsName.filename);
      if (sessionId !== null) {
        this.connectToSession(sessionId, filename);
        this.redactorJoinLink = location.href;
      }
    },

    methods: {
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

        const uid = await this.$store.state.api.openRedactorSession(this.$parent.$refs.editor.aceEditor.getValue());
        if (!uid.ok_) {
          this.$store.state.popups.error('Не удалось создать сессию');
          return;
        }
        this.redatorSessionUid = uid.id;
        const url = new URL(location.href);
        url.searchParams.append(queryParamsName.sessionId, this.redatorSessionUid);
        //url.searchParams.append(queryParamsName.taskId, this.$parent.$refs.taskInfo.taskId);
        url.searchParams.append(queryParamsName.filename, this.$parent.$refs.tabs.getSelected().uniqueValue.name);
        this.redactorJoinLink = url.toString();
        this.$store.state.popups.success('Сессия создана');

        this.$emit('openSession', uid.id);
      },
      async leaveSession() {
        if (!await this.$store.state.modal.confirm('Вы уверены, что хотите покинуть сессию?', 'Сессия будет закрыта, если все участники выйдут')) {
          return;
        }

        this.redatorSessionUid = undefined;
        this.redactorJoinLink = '';

        this.$parent.$refs.tabs.deleteTabByItem(this.uniqueRemoteTab);
        this.uniqueRemoteTab = undefined;

        this.$emit('leaveSession');
      },
      async connectToSession(uid, filename) {
        if (uid === undefined) {
          const uid = await this.$store.state.modal.prompt('Ведите ID сессии');
          if (!uid)
            return;
        }

        this.$store.state.popups.success('Вы подключились к сессии');
        this.redatorSessionUid = uid;

        this.uniqueRemoteTab = {name: null, value: ''};
        await this.$parent.$refs.tabs.addTab({
          name: "remote: " + filename,
          closable: false,
          uniqueValue: this.uniqueRemoteTab
        });
        this.$emit('connectSession', uid, filename);
      },

      async copyLinkToClipboard() {
        if (!this.redatorSessionUid)
          return;

        await navigator.clipboard.writeText(this.redactorJoinLink);
        this.$store.state.popups.success('Ссылка скопирована в буфер обмена')
      }
    }
  }
</script>
