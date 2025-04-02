import request from "./request"
// api的统一管理
export default {
  // home组件 左侧表格数据获取
  getTableData() {
    return request({
      url: '/home/getTableData',
      method: 'get',
      // mock: false

    })
  },
  //获取表单数据
  getCountData() {
    return request({
      url: '/home/getCountData',
      method: 'get',
      mock: false

    })
  },
  //获取图表数据
  getChartData() {
    return request({
      url: '/home/getChartData',
      method: 'get',
      mock: false

    })
  },
  //获取用户数据
  getUserData(data) {
    return request({
      url: '/home/getUserData',
      method: 'get',
      // mock: false,
      data
    })
  },

  // 删除用户
  deleteUser(data) {
    return request({
      url: '/user/deleteUser',
      method: 'get',
      // mock: false,
      data
    })
  },
  // 添加用户
  addUser(data) {
    return request({
      url: '/user/addUser',
      method: 'post',
      data
    })
  },
  // 编辑
  editUser(data) {
    return request({
      url: '/user/editUser',
      method: 'post',
      data,
    })
  },
  getMenu(params) {
    return request({
      url: '/permission/getMenu',
      method: 'post',
      data: params
    })
  },
  // 获取房间信息
  getMallData(data) {
    return request({
      url: '/home/getMallData',
      method: 'get',
      data
    })
  },
  deleteMallUser(data) {
    return request({
      url: '/mall/deleteMallUser',
      method: 'get',
      // mock: false,
      data
    })
  },
  // 添加用户
  addMallUser(data) {
    return request({
      url: '/user/addMallUser',
      method: 'post',
      data
    })
  }


}
// export default 'a'