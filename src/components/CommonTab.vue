<script setup>
import { computed, ref } from "vue";

import { useRouter, useRoute } from "vue-router";
import { useAllDataStore } from "@/stores";
const store = useAllDataStore();
const tags = computed(() => store.state.tags);
const route = useRoute();
const router = useRouter();
// 在主页面 实现点击商品管理跳转到商品管理，点击首页跳转到首页
const handleMenu = (tag) => {
  router.push(tag.name);
  store.selectMenu(tag);
};
const handleClose = (tag, index) => {
  //pinia
  store.updateTags(tag);
  if (tag.name !== route.naem) return;
  if (index === store.state.tags.length) {
    store.selectMenu(tags.value[index - 1]);
    router.push(tags.value[index - 1].name);
  } else {
    store.selectMenu(tags.value[index]);
    router.push(tags.value[index - 1].name);
  }
};
</script>

<template>
  <div class="tabs">
    <el-tag
      class="tags"
      v-for="(tag, index) in tags"
      :key="tag.name"
      :closable="tag.name !== 'home'"
      :effect="route.name === tag.name ? 'dark' : 'plain'"
      @click="handleMenu(tag)"
      @close="handleClose(tag, index)"
    >
      {{ tag.label }}
      <!-- 首页 -->
    </el-tag>
  </div>
</template>

<style lang="less" scoped>
.tags {
  margin: 10px 10px 0 20px;
  height: 40px;
  line-height: 40px;
  width: 80px;
  text-align: center;
}
.el-tag {
  width: 60px;
  height: 30px;
  line-height: 30px;
}
</style>
