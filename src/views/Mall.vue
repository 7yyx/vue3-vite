<script lang="ts" setup>
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance();
const getMallData = async () => {
  let data = await proxy.$api.getMallData(config);
  //拿到数据了 userData的数据
  console.log(data);
  // tableData.value = data.list;
  // map可以返回一个新的数组
  tableData.value = data.list.map((item) => ({
    ...item,
    sexLabel: item.sex === 1 ? "男" : "女",
  }));
  config.total = data.count;
  console.log(data.count);
};
const tableData = ref([]);
// console.log(tableData);

const tableLabel = reactive([
  { prop: "name", label: "姓名" },
  { prop: "age", label: "年龄" },
  { prop: "sexLabel", label: "性别" },
  { prop: "addr", label: "地址", width: "300px" },
  // { prop: "birth", label: "出生日期", width: "200px" },
  //
  { prop: "price", label: "价格" },
  { prop: "description", label: "房间类型" },
]);

//搜索
const formInline = reactive({
  keyWord: "",
  // address: "",
});
const config = reactive({
  name: "",
  // address: "",
  total: 0,
  page: 1,
});
const handleSearch = () => {
  config.name = formInline.keyWord;
  // config.address = formInline.address;
  getMallData();
};
// 分页
const handleChange = (page) => {
  config.page = page;
  getMallData();
};
// 删除用户
// 删除用户
const handledelete = (val) => {
  ElMessageBox.confirm("确定要删除吗？").then(async () => {
    await proxy.$api.deleteMallUser({ id: val.id });
    ElMessage({
      showClose: true,
      message: "删除成功",
      type: "success",
    });
    getMallData();
  });
};
// 添加房型信息
const dialogVisible = ref(false);
const formMallUser = ref({});
const action = ref("add");
const handleAdd = () => {
  // console.log(11);
  dialogVisible.value = true;
};
const rules = reactive({
  name: [{ required: true, message: "姓名是必选项", trigger: "blur" }],
  age: [{ required: true, message: "年龄是必填项", trigger: "blur" }],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  addr: [{ required: true, message: "地址是必选项" }],
  price: [{ required: true, message: "价格是必填项" }],
  description: [{ required: true, message: "描述是必填项" }],
});

const handleCancel = () => {
  proxy.$refs["userForm"].resetFields();
  dialogVisible.value = false;
};
const onSubmit = () => {
  // dialogVisible.value = false;
  dialogVisible.value = false;
  proxy.$refs["userForm"].resetFields();
  getMallData();
};
onMounted(() => {
  getMallData();
});

// const tableData = [
//   {
//     date: "2016-05-03",
//     name: "Tom",
//     state: "California",
//     city: "Los Angeles",
//     address: "No. 189, Grove St, Los Angeles",
//     zip: "CA 90036",
//     tag: "Home",
//   },
//   {
//     date: "2016-05-02",
//     name: "Tom",
//     state: "California",
//     city: "Los Angeles",
//     address: "No. 189, Grove St, Los Angeles",
//     zip: "CA 90036",
//     tag: "Office",
//   },
//   {
//     date: "2016-05-04",
//     name: "Tom",
//     state: "California",
//     city: "Los Angeles",
//     address: "No. 189, Grove St, Los Angeles",
//     zip: "CA 90036",
//     tag: "Home",
//   },
//   {
//     date: "2016-05-01",
//     name: "Tom",
//     state: "California",
//     city: "Los Angeles",
//     address: "No. 189, Grove St, Los Angeles",
//     zip: "CA 90036",
//     tag: "Office",
//   },
// ];
</script>



<template>
  <div>
    <el-header>
      <el-left>
        <el-button type="primary" @click="handleAdd()">添加</el-button>
      </el-left>
      <el-form class="abc" :inline="true" :model="formInline">
        <el-input
          v-model="formInline.keyWord"
          type="text"
          placeholder="请输入关键字"
        ></el-input>
        <el-button type="primary" class="search" @click="handleSearch()"
          >搜索</el-button
        >
      </el-form>
    </el-header>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width ? item.width : 130"
      />

      <el-table-column fixed="right" label="Operations" min-width="120">
        <!-- scope 插槽 拿到整行数据 -->
        <template #="scope">
          <el-button link type="primary" size="small" @click="handleClick">
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row)"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      calss="page"
      background
      layout="prev, pager, next"
      :total="config.total"
      @current-change="handleChange"
      size="small"
    />

    <!-- 添加和编辑的对话框 -->
    <el-dialog
      v-model="dialogVisible"
      width="500"
      :before-close="handleClose"
      :title="action == 'add' ? '新增用户' : '编辑用户'"
    >
      <el-form
        :model="formMallUser"
        label-width="auto"
        style="max-width: 600px"
        :rules="rules"  
        :inline="true"
      >
        <el-form-item label="用户名" prop="name">
          <el-input
            v-model="formMallUser.name"
            ref="userForm"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="formMallUser.age" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="房间类型" prop="description">
          <el-select
            v-model="formMallUser.description"
            placeholder="请选择房间类型"
          >
            <el-option label="双人间"></el-option>
            <el-option label="单人间间"></el-option>
            <el-option label="豪华家庭房"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input
            v-model="formMallUser.addr"
            placeholder="请选择地址"
          ></el-input>
        </el-form-item>

        <div class="footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit"> 确定 </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>



<style scoped>
/* el-header {
  display: flex;
  justify-content: space-between;
} */
.abc {
  width: 300px;
  margin: 20px 0;
  float: right;
}
.search {
  display: float;
  float: left;
}
</style>
