import { createApp } from 'vue'

import App from './apps/App.vue'
import Store from './apps/Store.js'
import createVueRouter from './apps/Router.js'

import './styles/main.styl'
import './styles/forms.styl'
import './styles/header.styl'
import './styles/scrollbars.styl'
import './styles/show-hide.styl'


const app = createApp(App);

app.use(createVueRouter(Store));
app.use(Store);

app.mount('#app');
