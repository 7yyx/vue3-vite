import { defineStore } from 'pinia'
import { ref } from 'vue'
// pinia 实现菜单收缩功能
// 跨组件之间传值，tags编写，点击左侧的用户管理，跳转到用户管理，点击首页跳转到首页
function initState() {
  return {
    isCollapse: false,
    tags: [
      {
        path: "/home",
        name: "home",
        label: "首页",
        icon: "home",
      },
    ],
    currentMenu: null,
    menuList: [],
    token: '',

  }
}

export const useAllDataStore = defineStore('allData', () => {
  const state = ref(initState());
  function selectMenu(val) {
    if (val.name === "home") {
      state.value.currentMenu = null;
    } else {
      let index = state.value.tags.findIndex(item => { item.name === val.name })
      index === -1 ? state.value.tags.push(val) : "";
    }
  }
  function updateMenuList(val) {
    state.value.menuList = val
  }
  return {
    state,
    updateMenuList,
    selectMenu
  }
})