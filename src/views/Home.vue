<script setup>
import { ref, getCurrentInstance, onMounted, reactive } from "vue";
import * as echarts from "echarts";
// import axios from "axios";
const { proxy } = getCurrentInstance();
const tableData = ref([]);
const countData = ref([]);
const chartData = ref([]);
const observer = ref([]);
const tableLabel = ref({
  name: "课程",
  todayBuy: "今日购买",
  monthBuy: "本月购买",
  totalBuy: "总购买",
});

// axios
//   .get({
//     url: "/api/home/getTableData",
//     method: "get",
//   })
//   .then((res) => {
//     // 不知道为啥请求不到数据
//     if (res.data.code === 200) {
//       console.log(res.data.data.tableData);
//       tableData.value = res.data.data.tableData;
//     }
// });
// axios 的二次封装
const getTableData = async () => {
  const data = await proxy.$api.getTableData();
  // console.log(data);
  // 可以打印;

  tableData.value = data.tableData;
};
const getCountData = async () => {
  const data = await proxy.$api.getCountData();
  // console.log(data);
  // 可以打印;
  countData.value = data;
};

//请求图表数据并渲染的方法
const getChartData = async () => {
  const { orderData, userData, videoData } = await proxy.$api.getChartData();
  //对折现图表的xAxis和series赋值 日期
  xOptions.xAxis.data = orderData.date;
  xOptions.series = Object.keys(orderData.data[0]).map((val) => {
    return {
      name: val,
      data: orderData.data.map((item) => item[val]),
      type: "line",
    };
  });
  //one               echarts.init方法初始化ECharts实例，需要传入dom对象
  const OneEcharts = echarts.init(proxy.$refs["echart"]);
  //setOption方法应用配置对象
  OneEcharts.setOption(xOptions);

  //对柱状图图表的xAxis和series赋值
  xOptions.xAxis.data = userData.map((item) => item.date);
  xOptions.series = [
    {
      name: "新增用户",
      data: userData.map((item) => item.new),
      type: "bar",
    },
    {
      name: "活跃用户",
      data: userData.map((item) => item.active),
      type: "bar",
    },
  ];
  //two
  const TwoEcharts = echarts.init(proxy.$refs["userEchart"]);
  TwoEcharts.setOption(xOptions);

  // //对饼状图图表的series赋值
  pieOptions.series = [
    {
      data: videoData,
      type: "pie",
    },
  ];
  //three
  const ThreeEcharts = echarts.init(proxy.$refs["videoEchart"]);
  ThreeEcharts.setOption(pieOptions);

  //ResizeObserver 随页面大小改变而改变
  // 如果监视的容器大小变化，如果改变会执行传递的回调
  observer.value = new ResizeObserver((entries) => {
    OneEcharts.resize();
    TwoEcharts.resize();
    ThreeEcharts.resize();
  });
  //如果这个容器存在
  if (proxy.$refs["echart"]) {
    //则调用监视器的observe方法，监视这个容器的大小
    observer.value.observe(proxy.$refs["echart"]);
  }
};

// echarts
//observer 接收观察器实例对象

// //这个是折线图和柱状图 两个图表共用的公共配置
const xOptions = reactive({
  // 图例文字颜色
  textStyle: {
    color: "#333",
  },
  legend: {},
  grid: {
    left: "20%",
  },
  // 提示框
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category", // 类目轴
    data: [],
    axisLine: {
      lineStyle: {
        color: "#17b3a3",
      },
    },
    axisLabel: {
      interval: 0,
      color: "#333",
    },
  },
  yAxis: [
    {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#17b3a3",
        },
      },
    },
  ],
  color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
  series: [],
});

const pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {},
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: [],
});

const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href;
};
onMounted(() => {
  getTableData();
  getCountData();
  getChartData();
});
</script>

<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <!-- 个人信息名片 -->
      <el-card shadow="hover">
        <div class="user">
          <img :src="getImageUrl('user')" class="user" />
          <div class="user-info">
            <p class="user-info-en">Admin</p>
            <p>超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间：<span>2025/3/2</span></p>

          <p>上次登录地点：<span>辽宁省/大连市</span></p>
        </div>
      </el-card>
      <!--展示 table -->
      <el-card shadow="hover" class="user-table">
        <el-table :data="tableData">
          <el-table-column
            v-for="(val, key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px">
      <!-- 折线图上面部分 的渲染 -->
      <div class="nums">
        <el-card
          :body-style="{ display: 'flex', padding: 0 }"
          v-for="item in countData"
          :key="item.name"
        >
          <component
            :is="item.icon"
            class="icons"
            :style="{ background: item, color }"
          ></component>
          <div class="detail">
            <p class="num">￥{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <!-- 折线图的渲染 -->
      <el-card class="top-echart">
        <div ref="echart" style="height: 240px">11</div>
      </el-card>
      <div class="graph">
        <el-card>
          <div ref="userEchart" style="height: 240px"></div>
        </el-card>
        <el-card>
          <div ref="videoEchart" style="height: 240px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
.nums {
  display: flex;
  flex-wrap: wrap;
  // 两边均匀分开
  justify-content: space-between;
  .el-card {
    width: 32%;
    // height: 32%;
    margin-bottom: 10px;
    .icons {
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: #2da597;
    }
    .detail {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .num {
        font-size: 28px;
      }
      .txt {
        font-size: 12px;
        padding-top: 10px;
        text-align: center;
      }
    }
  }
}
.home {
  height: 100%;
  overflow: hidden;
  .user {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
  }
  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-right: 40px;
  }
}
.user-info .user-info-en {
  margin-bottom: 20px;
  font-size: 26px;
}

.login-info {
  p {
    line-height: 30px;
    font-size: 14px;
    color: #999;
  }
  span {
    margin-left: 20px;
  }
}
.user-table {
  margin-top: 20px;
}
.graph {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  .el-card {
    width: 48%;
    height: 240px;
  }
}
</style>


