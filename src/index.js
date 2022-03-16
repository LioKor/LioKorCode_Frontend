import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './apps/App.vue'
import Store from './apps/VuexStore.vue'
import Task from './apps/code editor/Task.vue'
import SignIn from './apps/SignIn.vue'
import SignUp from './apps/SignUp.vue'
import TaskList from './apps/tasks/TaskList.vue'
import Page404 from './apps/Page404.vue'

import './styles/main.styl'

const routes = [
    { path: '/', component: TaskList },
    { path: '/tasks/:id', component: Task },
    { path: '/signin', component: SignIn },
    { path: '/signup', component: SignUp },
    { path: '/:pathMatch(.*)*', component: Page404 }
]
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

const app = createApp(App)

app.use(router)
app.use(Store)

app.mount('#app')
