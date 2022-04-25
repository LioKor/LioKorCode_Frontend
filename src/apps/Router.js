import { createRouter, createWebHistory } from 'vue-router'

const Task = () => import('./code editor/Page.vue')
const TaskEdit = () => import('./TaskEdit.vue')
const SignIn = () => import('./SignIn.vue')
const Profile = () => import('./Profile.vue')
const SignUp = () => import('./SignUp.vue')
const TaskList = () => import('./task previews/Page.vue')
const Page404 = () => import('./Page404.vue')
const TaskCreate = () => import('./TaskCreate.vue')

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
