<script setup>
import { computed, ref } from "vue";

import { useRouter } from "vue-router";
import { useAllDataStore } from "@/stores";
const store = useAllDataStore();
// const tags = computed(() => {
//   store.state.tags;
// });
const tags = ref([
  {
    path: "/home",
    name: "home",
    label: "首页",
    icon: "home",
  },
]);
const route = useRouter();
</script>

<template>
  <div class="tabs">
    <el-tag
      class="tags"
      v-for="tag in tags"
      :key="tag.name"
      :closable="tag.name !== 'home'"
      :effect="route.name === tag.name ? 'dark' : 'plain'"
    >
      {{ tag.label }}
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
</style>
