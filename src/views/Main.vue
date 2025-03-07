<script setup>
import CommonAside from "@/components/CommonAside.vue";
import CommonHeader from "@/components/CommonHeader.vue";
import CommonTab from "@/components/CommonTab.vue";
</script>
<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <!-- 左侧 -->
      <common-aside />
      <!-- 右侧 -->
      <el-container>
        <!-- 右侧头部 -->
        <el-header class="el-header"><common-header /></el-header>
        <common-tab />
        <el-main class="right-main"><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout,
.lay-container {
  height: 100%;
}
.el-header {
  background-color: #333;
  /* font-color: rgb(241, 241, 241); */
  color: #edebeb;
}
</style>


