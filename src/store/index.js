import { createStore } from 'vuex'

export default createStore({
  state: {
    backRef:"/",
    activePath:"/personalModelManagement", //默认激活的标签
    activeManagementPath:"/managementInfo", //默认激活的标签
    iconObj: {
      '1': 'iconfont icon-tijikongjian',
      '2': 'iconfont icon-danju',
      '21': 'el-icon-sold-out',
      '22': 'el-icon-sell',
      '3': 'el-icon-menu icon-align',
      '4': 'iconfont icon-user',
      '41': 'el-icon-info',
      '42': 'el-icon-lock',
      '43': 'el-icon-wallet',
      '102': 'iconfont icon-danju',
      '145': 'iconfont icon-baobiao'
    }
  },
  mutations: {
    setBackRef (state, address) {
      state.backRef = address;
    },
    setActivePath (state, path) {
      state.activePath = path;
    },
    setActiveManagementPath(state, path){
      state.activeManagementPath = path;
    }
  },
  actions: {
  },
  modules: {
  }
})
