import axios from 'axios'
import { ElMessage } from 'element-plus'
import config from '@/config';
// 对于axios请求之前和之后的公共部分进行封装 处理
const service = axios.create(
  { baseURL: config.baseApi, }
);
const NetWork_error = '网络错误。。。'
// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use((res) => {
  // #ok 能打印出数据
  const { code, data, msg } = res.data
  if (code === 200) {
    return data
  } else {
    const NetWork_error = '网络错误。。。'
    ElMessage.error(msg || NetWork_error)
    return Promise.reject(msg || NetWork_error)
  }
});

function request(options) {
  // options.method 如果有复制给options.method 没有则给get
  options.method = options.method || "get";
  // 
  if (options.method.toLowerCase() === "get") {
    options.params = options.data;
  }
  //对mock开关做处理
  let isMock = config.mock;
  if (typeof options.mock !== "undefined") {
    isMock = options.mock
  }
  // 针对环境 prod如果是线上环境 不能用mock
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }

  return service(options);
}
export default request;