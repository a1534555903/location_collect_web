<template>
    <el-menu class="el-menu-demo" mode="vertical">
      <el-menu-item index="1" @click="toIndex">首页</el-menu-item>
      <el-sub-menu index="2">
        <template #title>审核</template>
        <el-menu-item index="2-1" @click="toReviewAddress">兴趣点审核</el-menu-item>
        <el-menu-item index="2-2">标准地址审核</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>管理</template>
        <el-menu-item index="3-1">兴趣点管理</el-menu-item>
        <el-menu-item index="3-2">标准地址管理</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="4">
        <template #title>用户管理</template>
        <el-menu-item index="4-1" @click="toResetPassword">重置密码</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="5">
        <template #title>查找</template>
        <el-menu-item index="5-1">查找兴趣点</el-menu-item>
        <el-menu-item index="5-2">查找标准地址</el-menu-item>
      </el-sub-menu>
    </el-menu>

</template>

<script>
export default {
  name: "myAsider",
  methods: {
    ResetPassword() {
      return ResetPassword
    },
    toIndex() {
      this.$router.push('/index');
    },
    toReviewAddress() {
      this.$router.push('/review/address');
    },
    toResetPassword() {
      this.$router.push('/login/reset');
    },
  }
}
</script>

<style scoped>

</style>