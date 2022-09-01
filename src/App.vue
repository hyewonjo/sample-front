<template>
  <div class="header">
    <div class="topline">
      <div class="headmenu">
        <div v-if="isLogin">
          {{ this.$store.state.loginStore.memberId }}님 안녕하세요.
          <span v-on:click="logout">로그아웃</span>
        </div>
        <div v-else>
          <router-link :to="{name: 'LoginView', query: {returnUrl: '/'}}">로그인</router-link>
        </div>
      </div>
    </div>
    <div class="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link :to="{name: 'BoardList'}">Board</router-link>
    </div>
  </div>
  <router-view/>
</template>

<script>
export default {
  name: 'App',
  methods: {
    logout() {
      this.$store.dispatch('loginStore/doLogout');
      this.$router.push('/');
    }
  },
  computed: {
    isLogin() {
      return this.$store.getters['loginStore/isLogin'];
    }
  },
  mounted() {
    this.$store.dispatch('loginStore/doReadStateFromStorage');
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.nav {
  padding: 30px;
}

.nav a {
  font-weight: bold;
  color: #2c3e50;
}

.nav a.router-link-exact-active {
  color: #42b983;
}

.header { position:relative; }
.header .topline { position:relative; height:30px; margin:0 10px; }
.header .topline .headmenu { position:absolute; right:0; top:4px; }
.header .topline .headmenu a { font-weight:bold; color:#2c3e50; }
.header .topline .headmenu span { font-weight:bold; color:#2c3e50; cursor:pointer; text-decoration:underline; }
</style>
