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
    name: 'Board',
    component: () => import('../views/BoardLayout'),
    children: [
      {
        path: '',
        name: 'BoardList',
        component: () => import('../views/BoardList'),
      },
      {
        path: 'boardView',
        name: 'BoardView',
        component: () => import('../views/BoardView')
      },
      {
        path: 'boardWrite',
        name: 'BoardWrite',
        component: () => import('../views/BoardWrite'),
        meta: { requireLogin: true }
      },
      {
        path: 'boardEdit',
        name: 'BoardEdit',
        component: () => import('../views/BoardEdit'),
        meta: { requireLogin: true }
      },
    ]
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
  // matched로 바꿨을때 장점은? meta에 데이터 넣는건 동일하고.
  // 중첩구조에서 내가 요청이 왔는데.... 상위에 requireLoging이 없고 하위에 있을때. 결국 to의 meta에도 있을거잖슴.
  // 상위에 있고 하위에 없을때? 도 있음? matched로 볼때는 하위에 meta가 없으면 없다고 뜨는데, to.meta.requireLogin에는 있음
  console.log(to);
  // if (to.matched.some(record => record.meta.requireLogin) {
  if (to.meta.requireLogin) {
    const isLogin = store.getters['loginStore/isLogin'];
    if (!isLogin) {
      // 1.
      // next({name: 'LoginView', query: {returnUrl: to.fullPath}});
      // 2.
      if (confirm('로그인 되어야 사용가능합니다. 로그인하시겠습니까?\n')) next({name: 'LoginView', query: {returnUrl: to.fullPath}});
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
