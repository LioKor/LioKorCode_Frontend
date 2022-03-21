import { createApp } from 'vue'

import App from './apps/App.vue'
import Store from './apps/Store.js'
import createVueRouter from './apps/Router.js'

import './styles/main.styl'


const app = createApp(App);

app.use(createVueRouter(Store));
app.use(Store);

app.mount('#app');
