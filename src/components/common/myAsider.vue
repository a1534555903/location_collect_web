<template>
  <el-menu class="el-menu-demo" mode="vertical" :default-active="$route.path" router="router">
    <el-menu-item index="/index">首页</el-menu-item>
    <el-sub-menu index="/review">
      <template #title>审核</template>
      <el-menu-item index="/review/address">兴趣点审核</el-menu-item>
      <el-menu-item index="/review/standard">标准地址审核</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/management">
      <template #title>管理</template>
      <el-menu-item index="/management/address">兴趣点管理</el-menu-item>
      <el-menu-item index="/management/standard">标准地址管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/admin">
      <template #title>用户管理</template>
      <el-menu-item index="/admin/reset">重置密码</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/search">
      <template #title>查找</template>
      <el-menu-item index="/search/interest">查找兴趣点</el-menu-item>
      <el-menu-item index="/search/standard">查找标准地址</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script>
export default {
  name: "myAsider",
}
</script>

<style scoped>

</style>