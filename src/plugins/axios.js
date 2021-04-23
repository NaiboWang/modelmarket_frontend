import axios from "axios";
import { ElMessage } from "element-plus";
import router from '../router'
// import qs from 'qs';
// import store from '@/store';
// 导入NProgress, 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '../store'

const localAddress='http://192.168.163.129:8080/';
// eslint-disable-next-line no-unused-vars
const remoteAddress='http://xtra3090.d2.comp.nus.edu.sg/modelmarket_backend/';

// 创建axios实例
const service = axios.create({
    // api的base_url
    // baseURL: process.env.VUE_APP_URL, // 本地-后端解决跨域后
    baseURL: remoteAddress,
    withCredentials: true,
    timeout: 15000 // 请求超时时间
});

// request 请求拦截器
service.interceptors.request.use(
    config => {
        NProgress.start();
        //针对django框架设计的专属post方法
        if(config.method == "post")
        {
            let param = new URLSearchParams();
            for (let key in config.data){
                param.append(key, config.data[key]);
            }
            config.data = param;
        }
        // //设置header
        // config.headers["Content-Type"] = "application/json;charset=UTF-8";
        //
        // // 格式化 get 请求
        // if (config.method === 'get' && config.data) {
        //     config.url = `${config.url}?${qs.stringify(config.data, { indices: false })}`
        //     config.headers["Content-Type"] = "application/x-www-form-urlencoded";
        //
        // }
        // // 让每个请求携带自定义token
        // if (store.getters.token) {
        //     // header添加token
        //     config.headers["Authorization"] = store.getters.token;
        // }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
// respone 响应拦截器
service.interceptors.response.use(
    response => {
        NProgress.done();
        if (response.data.status != 200) {
            ElMessage({
                message: response.data.msg,
                type: 'error',
                center: true
            });
            if(response.data.status == 302){
                store.commit("setBackRef",window.location.pathname);
                router.push("/login"); //When not logged in, return to home page.
            }
            return false;
        }
        return response.data;
    },
    error => {
        NProgress.done();
        console.log(error);
        ElMessage({
            message: "Cannot connected to the server!",
            type: "error",
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

export default service;
// error => {
//     if (error.response.status == 400) {
//         Message({
//             message: "参数信息有误",
//             center: true
//         });
//         return;
//     } else if (error.response.status == 302) {
//         Message({
//             message: "用户未登录",
//             center: true
//         });
//         router.push("/login");
//         setStore({ name: 'TOKEN', content: '', type: 'session' })
//         return;
//     } else if (error.response.status == 404) {
//         Message({
//             message: "连接失败",
//             center: true
//         });
//         return;
//     } else if (error.response.status == 500) {
//         Message({
//             message: "服务器内部错误",
//             center: true
//         });
//         return;
//     } else if (error.response.status == 560) {
//         Message({
//             message: "数据库异常",
//             center: true
//         });
//         return;
//     }
