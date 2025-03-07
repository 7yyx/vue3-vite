<script setup>
import { ref, computed } from "vue";
import { useAllDataStore } from "@/stores";
const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href;
};
//pinia
const store = useAllDataStore();
const handleCollapsse = () => {
  store.state.isCollapse = !store.state.isCollapse;
};
</script>

<template>
  <div class="header">
    <div class="l-content">
      <el-button
        size="small"
        class="l-content-button"
        @click="handleCollapsse()"
      >
        左侧菜单折叠
        <component class="icons" :is="menu"></component>
      </el-button>
      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }">首页 |</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }">用户中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 下拉菜单 -->
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img :src="getImageUrl('user')" class="user" alt="" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #333;
  color: #ffffff;
}

.icons {
  width: 20px;
  height: 20px;
}
.r-content .user {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.l-content {
  display: flex;
  align-items: center;
}
.l-content .el-button {
  margin-right: 20px;
  height: 50px;
}
</style>
