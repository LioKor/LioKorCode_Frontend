<template></template>

<script>
  import Vuex from 'vuex'
  import {User} from "../models/models";
  import ApiRequests from "../utils/requests";

  export const Store = new Vuex.Store({
    state: {
      user: new User(),
      api: new ApiRequests('http://localhost:9000/api/v1'),
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
        const response = await this.state.api.get('/user');
        const res = response.json();
        if (!response.ok)
          return;
        state.commit('SET_USER', res);
      }
    }
  });
</script>
