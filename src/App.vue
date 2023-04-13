<template>
  <div class="app-container">
    <el-container>
      <!-- 导航栏 -->
      <el-header class="header">
        <my-header></my-header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <my-asider></my-asider>
        </el-aside>
        <!-- 主体内容区域 -->
        <el-main>
          <router-view style="height: 100%; width: 100%;"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import myAsider from "@/components/common/myAsider.vue";
import myHeader from "@/components/common/myHeader.vue";

export default {
  name: "App",
  components: {
    myAsider,
    myHeader,
  },
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
