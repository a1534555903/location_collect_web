<template>
  <div class="app-container">
    <el-container>
      <!-- 导航栏 -->
      <el-header class="header">
        <el-menu class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1">Element Plus</el-menu-item>
          <el-sub-menu index="2">
            <template #title>Workspace</template>
            <el-menu-item index="2-1">item one</el-menu-item>
            <el-menu-item index="2-2">item two</el-menu-item>
            <el-menu-item index="2-3">item three</el-menu-item>
            <el-sub-menu index="2-4">
              <template #title>item four</template>
              <el-menu-item index="2-4-1">item one</el-menu-item>
              <el-menu-item index="2-4-2">item two</el-menu-item>
              <el-menu-item index="2-4-3">item three</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="3" disabled>Info</el-menu-item>
          <el-menu-item index="4">Orders</el-menu-item>
        </el-menu>
      </el-header>


      <el-container>

        <!-- 主体内容区域 -->
        <el-main>
                    <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
.app-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  margin: 0;
  flex-direction: column;
}
.flex-grow {
  flex-grow: 1;
}
.menu {
  height: 100%;
}
</style>
