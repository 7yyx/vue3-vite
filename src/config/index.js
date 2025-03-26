const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
  // 开发环境
  development: {
    baseApi: '/api',
    mockApi: 'https://mock.apifox.cn/m1/4068509-0-default/api',
  },
  test: {
    baseApi: '//test.future.com/api',
    mockApi: 'https://mock.apifox.cn/m1/4068509-0-default/api',
  },
  pro: {
    // 实际开发中  把'//future.com/api',  换成真实的即可
    baseApi: '//future.com/api',
    mockApi: 'https://mock.apifox.cn/m1/4068509-0-default/api',
  },
}

export default {
  env,
  // 控制mock ,false 所有请求线上的mock请求，本地五拦截，请求到的就是真实的数据

  mock: false,

  ...EnvConfig[env]
}