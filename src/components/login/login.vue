<template>
  <div>
    <div v-if="username===undefined">
      <el-text size="large">尚未登录</el-text>
    </div>
    <div v-else>
      <el-text size="large">欢迎用户:{{username}}</el-text>
      <a @click="logout">退出登录</a>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
  name: "login",
  computed: {
    username() {
      return this.$store.state.username;
    }
  },
  methods: {
    logout() {
      Cookies.remove('user', { path: '/' ,domain: 'localhost'});
      this.$store.commit('setUsername', undefined);
      this.$router.push('/login/loginPage');
    }
  }
}
</script>

<style scoped>
a {
  color: blue; /* 设置链接的颜色为蓝色 */
  text-decoration: underline; /* 为链接添加下划线 */
}

a:hover {
  color: red; /* 当鼠标悬停在链接上时，链接文本颜色变为红色 */
}
</style>