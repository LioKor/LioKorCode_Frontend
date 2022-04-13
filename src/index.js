import { createApp } from 'vue'

import App from './apps/App.vue'
import Store from './apps/Store.js'
import createVueRouter from './apps/Router.js'

import './styles/main.styl'
import './styles/forms.styl'
import './styles/header.styl'
import './styles/scrollbars.styl'
import './styles/show-hide.styl'
import './styles/components.styl'


createApp(App)
  .use(createVueRouter(Store))
  .use(Store)
  .mount('#app');
