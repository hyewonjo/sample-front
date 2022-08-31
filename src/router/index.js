import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import store from "@/store"; // @는 src 폴더의 alias

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/board',
    name: 'BoardList',
    component: () => import('../views/BoardList'),
    // beforeEnter: (to, from, next) => {
    //   const isLogin = store.getters['loginStore/isLogin'];
    //   if (!isLogin) {
    //     next({name: 'LoginView', query: {returnUrl: to.fullPath}});
    //   } else {
    //     next();
    //   }
    // }
  },
  {
    path: '/boardView',
    name: 'BoardView',
    component: () => import('../views/BoardView')
  },
  {
    path: '/boardWrite',
    name: 'BoardWrite',
    component: () => import('../views/BoardWrite')
  },
  {
    path: '/boardEdit',
    name: 'BoardEdit',
    component: () => import('../views/BoardEdit')
  },
  {
    path: '/login',
    name: 'LoginView',
    component: () => import('../views/Login')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path === '/board') {
    const isLogin = store.getters['loginStore/isLogin'];
    if (!isLogin) {
      next({name: 'LoginView', query: {returnUrl: to.fullPath}});
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
