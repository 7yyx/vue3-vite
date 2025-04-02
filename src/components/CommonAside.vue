<script setup>
import { ref, computed } from "vue";
import { useAllDataStore } from "@/stores";
import { useRouter, useRoute } from "vue-router";
// const list = ref([
//   {
//     path: "/home",
//     name: "home",
//     label: "首页",
//     icon: "house",
//     url: "Home",
//   },
//   {
//     path: "/mall",
//     name: "mall",
//     label: "商品管理",
//     icon: "video-play",
//     url: "Mall",
//   },
//   {
//     path: "/user",
//     name: "user",
//     label: "用户管理",
//     icon: "user",
//     url: "User",
//   },
//   {
//     path: "other",
//     label: "其他",
//     icon: "location",
//     children: [
//       {
//         path: "/page1",
//         name: "page1",
//         label: "页面1",
//         icon: "setting",
//         url: "Page1",
//       },
//       {
//         path: "/page2",
//         name: "page2",
//         label: "页面2",
//         icon: "setting",
//         url: "Page2",
//       },
//     ],
//   },
// ]);
const noChildren = computed(() => list.value.filter((item) => !item.children));
const hasChildren = computed(() => list.value.filter((item) => item.children));
// pinia
const store = useAllDataStore();
// computed 属性是响应式的，当依赖的数据变化时，会触发组件的重新渲染。
// 普通函数是非响应式的，不会自动更新依赖它的组件。
const isCollapse = computed(() => store.state.isCollapse);
const width = computed(() => (store.state.isCollapse ? "74px" : "230px"));
// tags组件的 编写
const router = useRouter();
const route = useRoute();
const list = computed(() => store.state.menuList);
const handleMenu = (item) => {
  router.push(item.path); //实现路由跳转
  store.selectMenu(item); //实现tag标签的
};
const activeMenu = computed(() => route.path);
</script>

<template>
  <el-aside :width="width">
    <el-menu
      text-color:="#fff"
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="activeMenu"
    >
      <h3 v-show="!isCollapse">伪装目标检测后台管理系统</h3>
      <h3 v-show="isCollapse">后台</h3>
      <el-menu-item
        v-for="item in noChildren"
        :key="item.path"
        :index="item.path"
        @click="handleMenu(item)"
      >
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>

      <el-sub-menu
        v-for="item in hasChildren"
        :key="item.path"
        :index="item.path"
        @click="handleMenu(item)"
      >
        <template #title>
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
      </el-sub-menu>
      <el-menu-item-group>
        <!-- <el-menu-item
          v-for="(subItem, subIndex) in item.children"
          :index="subItem.path"
          :key="subItem.path"
          >item one</el-menu-item
        > -->
        <template #title>
          <!-- <component class="icons" :is="subItem.icon"></component>
            <span>{{ subItem.lable }}</span> -->
        </template>
      </el-menu-item-group>
    </el-menu>
  </el-aside>
</template>

<style scoped>
.icons {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  /* padding-right: 20px; */
  /* font-size: 20px; */
}
h3 {
  padding: 20px 5px;
  font-size: 18px;
  font-weight: bold;
}
.el-menu {
  border-right: none;
  background-color: #848484;

  font-size: 16px;
}
.el-aside {
  height: 1000px;
  background-color: #848484;
}
</style>
