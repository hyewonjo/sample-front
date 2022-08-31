<template>
  <div class="login">
    <h1>This is an Login page</h1>
    <form class="loginform">
      <p>
        <label for="memberIdInput">아이디</label>
        <input type="text" id="memberIdInput" class="input_text" ref="memberIdInput" v-model.trim="memberId" placeholder="아이디를 입력하세요."/>
      </p>
      <p>
        <label for="memberPasswordInput">패스워드</label>
        <input type="password" id="memberPasswordInput" class="input_text" ref="memberPasswordInput" v-model.trim="memberPassword" placeholder="패스워드를 입력하세요." />
      </p>
      <p class="buttons">
        <!-- prevent를 추가하면 form의 input에서 엔터키를 누를때 form이 submit되는것을 방지할수 있다. submit되면 그 이벤트를 캐치해서 중간 밸리데이션같은거 해줘야되니까. submit 막고 선언한 method 실행하는게 나음-->
        <button v-on:click.prevent="doLogin" class="button blue">로그인</button>
        <button v-on:click.prevent="doCancel" class="button">취소</button>
      </p>
    </form>
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data: function() {
    return {
      memberId: '',
      memberPassword: '',
      errorMessage: ''
    };
  },
  methods: {
    doLogin() {
      if (this.memberId === '') {
        alert('아이디를 입력하세요');
        this.$refs.memberIdInput.focus();
        return;
      } else if (this.memberPassword === '') {
        alert('패스워드를 입력하세요');
        this.$refs.memberPasswordInput.focus();
        return;
      }

      this.$store.dispatch('loginStore/doLogin', {
        id: this.memberId,
        password: this.memberPassword
      }).then(() => {
        const returnUrl = window.location.search.replace(/^\?returnUrl=/, "");
        this.$router.push(returnUrl);
      }).catch(err => {
        this.errorMessage = err.response.data.errormessage;
      });

    },
    doCancel() {
      this.$router.push('../');
    }
  },
  mounted() {
    this.$refs.memberIdInput.focus();
  }
};
</script>

<style scoped>
.login { width:800px; margin:20px auto; }
.loginform { width:400px; margin:auto; }
.loginform p > label { display:inline-block; width:100px; font-size:14px; padding-right:10px; }
.loginform p > .input_text { width:200px; font-size:14px; height:32px; }
.buttons { position:relative; height:32px; margin-top:20px; }
.buttons > .button { overflow:visible; cursor:pointer; min-width:125px; height:32px; margin:0 2px; padding:0 15px; line-height:32px; font-size:14px; border:1px solid #dfdfdf; background:#fff; border-radius:10px; }
.buttons > .button.blue { color:#fff; border-color:#0099d2 !important; background:#0099d2 !important; }
</style>