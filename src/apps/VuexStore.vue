<template></template>

<script>
  import Vuex from 'vuex'
  import Api from "./api.js";
  import {User} from "../models/user";

  const Store = new Vuex.Store({
    state: {
      user: new User(),
      api: new Api('/api/v1'),
    },
    getters: {
      SET_USER: state => {
        return state.user;
      },
    },
    mutations: {
      SET_USER: (state, userData) => {
        state.user.set(userData);
      },
      SET_USER_CHOSENROOMID: (state, id) => {
        state.user.setChosenRoomId(id)
      },
    },
    actions: {
      GET_USER: async (state, _) => {
        const userData = await state.state.api.getUser();
        state.commit('SET_USER', userData);
      },
    }
  });

  export default Store;
</script>
