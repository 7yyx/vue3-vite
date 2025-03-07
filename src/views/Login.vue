<script setup>
import { reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useAllDataStore } from "@/stores";
const { proxy } = getCurrentInstance();
const router = useRouter();
const loginForm = reactive({
  username: "admin",
  password: "",
});
const store = useAllDataStore();
const handleLogin = async () => {
  const res = await proxy.$api.getMenu(loginForm);
  // console.log(res);

  //在这里执行updateMenuList，传入res.menuList
  store.updateMenuList(res.menuList);
  //直接修改token
  store.state.token = res.token;
  router.push("/home");
};
</script>
<template>
  <div class="body-login">
    <el-form :model="loginForm" class="login-container">
      <h3>后台登录系统</h3>
      <el-form-item>
        <el-input
          type="input"
          v-model="loginForm.username"
          placeholder="请输入用户名/账号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="input"
          v-model="loginForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleLogin"> 登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.body-login {
  width: 100%;
  height: 100%;
  height: 900px;

  background-image: url("../assets/images/background.png");
  /* background-size: 100%; */
  overflow: hidden;
}
.login-container {
  width: 350px;
  background-color: #eaeaea;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 35px 35px 15px 35px;
  box-shadow: 0 0 25px #cacaca;
  margin: 180px auto;
}
h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #505450;
}
:deep(.el-form-item__content) {
  /* .el-form-item__content 在浏览器-f12查看源码中能看到 */
  /* 样式穿刺 */
  justify-content: center;
}

/* el-button {
  display: flex;
  justify-content: center;
} */
</style>


