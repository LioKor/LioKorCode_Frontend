<style lang="stylus">
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

  .control-button:before
    background linear-gradient(#2A9922, highLightColorTransparent, transparent) 0 100% / 100% 200% no-repeat
  .control-button.warning:before
    background linear-gradient(#ffe344, transparent) 0 100% / 100% 200% no-repeat
  .control-button.danger:before
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

      <div v-show="!sessionStatus" @click="openSession">Открыть сессию</div>
      <div v-show="!sessionStatus" @click="connectToSession">Подключиться</div>
      <div v-show="sessionStatus" @click="leaveSession">Отключиться</div>

      <router-link v-if="$store.state.user.isLogined" to="/profile" class="right">{{$store.state.user.username}}</router-link>
      <router-link v-else to="/signin" class="right">Войти</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        version: VERSION,
        buildDate: (new Date(BUILD_TIMESTAMP)).toLocaleDateString('en-GB'),
        isCheckInProgress: false,
        isCheckError: false,
        sessionStatus: '',
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
        if (!await this.$store.state.modal.confirm('Вы уверены, что хотите открыть текущий файл для совместного редактирования?', 'Подключиться сможет любой, кому вы предоставите ID сессии')) {
          return;
        }

        const uid = this.$store.state.api.openRedactorSession(this.$refs.editor.aceEditor.getValue());
        if (!uid.ok_) {
          this.$store.state.popups.error('Не удалось создать сессию');
          return;
        }
        this.redatorSessionUid = uid.id;
        this.$store.state.modal.alert('Ваша сессия создана. ID:', uid.id);

        this.$emit('openSession', uid.id);
        this.sessionStatus = 'opened';
      },
      async leaveSession() {
        if (!await this.$store.state.modal.confirm('Вы уверены, что хотите закрыть сессию? ID:', this.redatorSessionUid)) {
          return;
        }

        this.$emit('leaveSession');
        this.sessionStatus = '';
      },
      async connectToSession() {
        const uid = await this.$store.state.modal.prompt('Ведите ID сессии');
        if (!uid)
          return;

        this.$emit('connectSession', uid);
        this.sessionStatus = 'connected';
      },
    },

    mounted() {
      window.addEventListener('keydown', (ev) => {
        if (ev.key === 'F9') {
          this.checkStartEmit();
        }
      });
    },
  }
</script>
