<template>
  <div class="myClass">
    <el-text class="myText">
      <h1>地址收集系统</h1>
    </el-text>
    <login class="myLogin"></login>
  </div>
</template>

<script>
import login from "@/components/login/login.vue";
export default {
  name: "myHeader",
  components: {
    login,
  },
};
</script>

<style scoped>
.myClass {
  display: flex;
  background-color: #e1e4e8;
  padding: 0 !important;
}
.myText {
  flex-grow: 1;
}
.myLogin {
  flex-shrink: 0;
}
</style>
