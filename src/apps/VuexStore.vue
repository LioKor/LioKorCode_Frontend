<template></template>

<script>
  import Vuex from 'vuex'
  import Api from "./api.js";

  const Store = new Vuex.Store({
    state: {
      user: {},
      api: new Api('/api/v1'),
    },
    getters: {
      SET_USER: state => {
        return state.user;
      },
    },
    mutations: {
      SET_USER: (state, user) => {
        state.user.set(user);
      },
      SET_USER_CHOSENROOMID: (state, id) => {
        return state.user.setChosenRoomId(id)
      },
    },
    actions: {
      GET_USER: async (state, _) => {
        const userData = await this.api.getUser();
        if (!userData.ok_)
          return;
        state.commit('SET_USER', userData);
      }
    }
  });

  export default Store;
</script>
