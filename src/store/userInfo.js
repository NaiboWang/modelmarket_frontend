import axios from '../plugins/axios'
import { ElMessage } from "element-plus";
import router from '../router'
import store from './index'

async function getIdentity() {
    let userInfo = await axios.get("getIdentity");
    store.commit("setUserInfo",userInfo);
    return userInfo;
}

export default getIdentity;
