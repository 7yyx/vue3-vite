<script setup>
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance();
const getUserData = async () => {
  let data = await proxy.$api.getUserData(config);
  // 获取数据，对性别进行处理
  // tableData.value = data.list;
  tableData.value = data.list.map((item) => ({
    ...item,
    sexLabel: item.sex === 1 ? "男" : "女",
  }));
  config.total = data.count;
};

const tableData = ref([]);
const tableLabel = reactive([
  { prop: "name", label: "姓名" },
  { prop: "age", label: "年龄" },
  { prop: "sexLabel", label: "性别" },
  { prop: "addr", label: "地址", width: "300px" },
  { prop: "birth", label: "出生日期", width: "200px" },
]);
// 搜索
const formInline = reactive({
  keyWord: "",
  address: "", // 地址
});
const handleSearch = () => {
  config.name = formInline.keyWord;
  config.address = formInline.address;
  getUserData();
};
const config = reactive({
  name: "",
  total: 0,
  page: 1,
});
// 分页
const handleChange = (page) => {
  config.page = page;
  getUserData();
};
// 删除用户
const handledelete = (val) => {
  ElMessageBox.confirm("确定要删除吗？").then(async () => {
    await proxy.$api.deleteUser({ id: val.id });
    ElMessage({
      showClose: true,
      message: "删除成功",
      type: "success",
    });
    getUserData();
  });
};

// /------------------添加用户的对话框------------------------
// 控制对话框是否显示
const dialogVisible = ref(false);
const action = ref("add"); //新增和编辑共用一个窗口，所以通过设置action区分
const formUser = reactive({});
// 表单校验规则
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [{ required: true, message: "年龄是必填项", trigger: "blur" }],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr: [{ required: true, message: "地址是必填项" }],
});

const handleAdd = () => {
  action.value = "add";
  dialogVisible.value = true;
};
const handleClose = () => {
  // 获取重置表单
  proxy.$refs["userForm"].resetFields();
  dialogVisible.value = false;
};
//对话框右下角的取消事件
const handleCancel = () => {
  proxy.$refs["userForm"].resetFields();
  dialogVisible.value = false;
};

// //格式化日期，格式化为：1997-01-02这种
const timeFormat = (time) => {
  var time = new Date(time);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var date = time.getDate();
  function add(m) {
    return m < 10 ? "0" + m : m;
  }
  return year + "-" + add(month) + "-" + add(date);
};
const onSubmit = () => {
  //执行userForm表单的validate进行规则校验，传入一个回调函数，回调函数会接受到一个是否校验通过的变量
  // 添加时这里报错
  proxy.$refs["userForm"].validate(async (valid) => {
    //如果校验成功
    if (valid) {
      //res用于接收添加用户或者编辑用户接口的返回值
      let res = null;
      //这里无论是新增或者是编辑，我们都要对这个日期进行一个格式化
      //如果不是1997-01-02这种格式，使用timeFormat方法进行格式化
      formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth)
        ? formUser.birth
        : timeFormat(formUser.birth);
      //如果当前的操作是新增，则调用新增接口
      if (action.value == "add") {
        res = await proxy.$api.addUser(formUser);
      } else if (action.value == "edit") {
        res = await proxy.$api.editUser(formUser);
      }
      //如果接口调用成功
      if (res) {
        //关闭对话框，重置表单，重新请求用户数据
        dialogVisible.value = false;
        proxy.$refs["userForm"].resetFields();
        getUserData();
      }
      //如果校验失败
    } else {
      ElMessage({
        showClose: true,
        message: "请输入正确的内容",
        type: "error",
      });
    }
  });
};
// 编辑
const handleEdit = (val) => {
  action.value = "edit";
  dialogVisible.value = true;
  // 如果没有nextTick这个函数，在点击添加按钮时 里面的input框中的值不为空
  nextTick(() => {
    //因为在第一次显示弹窗的时候form组件没有加载出来，如果直接对formUser赋值，这个值会作为form表单的初始值
    //所以使用nextTick，赋值的操作在一个微任务中，这样就可以避免在from表单加载之前赋值
    //这里需要改变sex数据类型，是因为el-option的value有类型的校验
    Object.assign(formUser, { ...val, sex: "" + val.sex });
  });
};
//在之前的onSubmit方法中增加的代码
//如果是编辑
// if (action.value == "edit") {
//   res = await proxy.$api.editUser(formUser);
// }

onMounted(() => {
  getUserData();
});
</script>
<template>
  <!-- 上 -->
  <div class="common-layout">
    <!-- <div class="user-top">
      <el-card>首页 用户管理 </el-card>
    </div> -->
    <!-- 中 -->
    <div class="user-center">
      <el-button class="add" @click="handleAdd">添加</el-button>
      <el-form :inline="true" :model="formInline">
        <el-form-item label="请输入">
          <el-input
            v-model="formInline.keyWord"
            type="text"
            placeholder="请输入用户名"
          ></el-input>
          <!-- <el-input
            v-model="formInline.address"
            type="text"
            placeholder="请输入地址"
          ></el-input> -->
        </el-form-item>
        <el-form-item>
          <el-button class="search" @click="handleSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 下 -->
    <div class="user-bottom">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          v-for="item in tableLabel"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : 180"
        />

        <el-table-column fixed="right" label="Operations" min-width="120">
          <!-- <template #default="{ scope }"> -->
          <template #="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button @click="handledelete" type="danger" size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="page"
        background
        layout="prev, pager, next"
        :total="config.total"
        size="small"
        @current-change="handleChange"
      />
    </div>
    <!-- 添加 的模态框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="action == 'add' ? '新增用户' : '编辑用户'"
      width="35%"
      :before-close="handleClose"
    >
      <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
        <el-row>
          <!-- 姓名 -->
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="formUser.name"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 年龄 -->
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input
                v-model="formUser.age"
                placeholder="请输入年龄"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 性别 -->
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select
                class="select-clearn"
                v-model="formUser.sex"
                placeholder="请选择"
              >
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 出生日期 -->
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birth">
              <el-date-picker
                v-model="formUser.birth"
                type="date"
                placeholder="请选择"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 地址 -->
          <el-col :span="12">
            <el-form-item label="地址" prop="addr">
              <el-input
                v-model="formUser.addr"
                placeholder="请输入地址"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 最终的取消 和确定 -->
          <el-row style="justify-content: flex-end">
            <el-form-item>
              <el-button type="primary" @click="handleCancel">取消</el-button>
              <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
          </el-row>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped>
.user-center {
  display: flex;
  justify-content: space-between;
  /* margin: 10px 0 5px 0; */
  margin-top: 15px;
  /* text-align: center; */
}
.add {
  background-color: rgba(255, 228, 196, 0.644);
}

.search {
  margin-left: 10px;
  /* color: aquamarine; */
  background-color: rgba(255, 228, 196, 0.644);
  font-size: 14px;
}
.user-bottom {
  position: relative;
  height: 500px;
}
.el-table {
  width: 100%;
  height: 490px;
}
.user-bottom .page {
  position: absolute;
  right: 10px;
  bottom: 20px;
}
/* .select-clearn {
  display: flex;
} */
</style>


