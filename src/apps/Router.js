import { createRouter, createWebHistory } from 'vue-router'

import Task from './code editor/Page.vue'
import TaskEdit from './TaskEdit.vue'
import SignIn from './SignIn.vue'
import Profile from './Profile.vue'
import SignUp from './SignUp.vue'
import TaskList from './task previews/Page.vue'
import Page404 from './Page404.vue'
import TaskCreate from './TaskCreate.vue';

export default function createVueRouter(Store) {
    const routes = [
        {path: '/', component: TaskList},
        {path: '/task/create', component: TaskCreate},
        {path: '/task/:taskId', component: Task},
        {path: '/task/edit/:taskId', component: TaskEdit},
        {path: '/signin', component: SignIn, meta: {noLoginRequired: true}},
        {path: '/signup', component: SignUp, meta: {noLoginRequired: true}},
        {path: '/profile', component: Profile, meta: {loginRequired: true}},
        {path: '/:pathMatch(.*)*', component: Page404}
    ]

    const Router = createRouter({
        history: createWebHistory(),
        routes: routes,
    });

    let router_got_user = false
    Router.beforeEach(async (to, from, next) => {
        if (!router_got_user) {
            await Store.dispatch('GET_USER');
            router_got_user = true;
        }

        if (to.matched.some(record => record.meta.loginRequired)) {
            if (Store.state.user.isLogined) {
                next();
                return;
            }
            next({
                path: '/signin',
                params: {nextUrl: to.fullPath}
            });
        } else if (to.matched.some(record => record.meta.noLoginRequired)) {
            if (!Store.state.user.isLogined) {
                next();
                return;
            }
            next({
                path: '/profile',
                params: {nextUrl: to.fullPath}
            });
        }
        next();
    });

    return Router;
}
