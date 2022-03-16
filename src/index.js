import { createApp } from 'vue'

import App from './apps/App.vue'
import {Store} from './apps/VuexStore.vue'

import './styles/main.styl'

const app = createApp(App)

app.use(Store);
app.mount('#app')
