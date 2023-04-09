<template>
  <div class="app-container">
    <el-container>
      <!-- 导航栏 -->
      <el-header class="header">
        <el-menu mode="horizontal">
          <el-menu-item index="1">审核</el-menu-item>
          <el-menu-item index="2">地址管理</el-menu-item>
          <el-menu-item index="3">用户信息管理</el-menu-item>
          <el-submenu index="4">
            <template slot="title">
              <span>{{ userInfo }}</span>
            </template>
            <el-menu-item index="4-1" @click="logout">退出登录</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>


      <el-container>
        <!-- 菜单栏 -->
        <el-aside width="200px">
          <el-menu
              :default-active="activeMenu"
              class="menu"
              @select="handleMenuSelect"
              :collapse="isCollapse"
              :collapse-transition="false"
              router
          >
            <el-submenu index="sub1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>地址管理</span>
              </template>
              <el-menu-item index="/address/list">地址列表</el-menu-item>
              <el-menu-item index="/address/add">添加地址</el-menu-item>
            </el-submenu>
            <el-submenu index="sub2">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>菜单一</span>
              </template>
              <el-menu-item index="/menu1/page1">页面一</el-menu-item>
              <el-menu-item index="/menu1/page2">页面二</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- 主体内容区域 -->
        <el-main>
          <!--          <router-view></router-view>-->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

export default {
  name: "App"
};
</script>

<style scoped>
.app-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  margin: 0;
  flex-direction: column;
  padding-left: 0;
}
.header {
  display: flex;
  justify-content: space-between;
}
.flex-grow {
  flex-grow: 1;
}
.menu {
  height: 100%;
}
</style>
