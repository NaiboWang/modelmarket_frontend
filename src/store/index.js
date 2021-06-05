import {createStore} from 'vuex'
import {ElMessage} from "element-plus";

export default createStore({
    state: {
        backRef: "/",
        activePath: "/personalModelList", //默认激活的标签
        activeManagementPath: "/managementInfo", //默认激活的标签
        iconObj: {
            '0': 'iconfont-user icon-users',
            '1': 'iconfont icon-tijikongjian',
            '2': 'iconfont icon-danju',
            '21': 'el-icon-sold-out',
            '22': 'el-icon-sell',
            '3': 'el-icon-menu icon-align',
            '4': 'iconfont icon-user',
            '5': 'el-icon-s-claim icon-align',
            '6': 'el-icon-tickets icon-align',
            '41': 'el-icon-info',
            '42': 'el-icon-lock',
            '43': 'el-icon-wallet',
            '102': 'iconfont icon-danju',
            '145': 'iconfont icon-baobiao'
        },
        userInfo: {
            nickname: 'guest',
            role: "guest",
            username: "guest",
            notifications:0,
        },
    },
    mutations: {
        setBackRef(state, address) {
            state.backRef = address;
        },
        setActivePath(state, path) {
            state.activePath = path;
        },
        setActiveManagementPath(state, path) {
            state.activeManagementPath = path;
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
    },
    actions: {},
    modules: {},
})
