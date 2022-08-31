import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import store from "@/store";

const app = createApp(App).use(router).use(store);
// app.config 는 Vue 프로젝트 전역으로 사용되는 설정 객체
// config 에 있는 globalProperties 는 Vue 프로젝트에서 전역으로 사용되는 속성 객체
// mount 전에 설정해야함
app.config.globalProperties.axios = axios; 

app.mount('#app');
