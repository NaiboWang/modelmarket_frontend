import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './plugins/axios'
import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/en'
import 'element-plus/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'
import './assets/fonts/iconfont-user/iconfont.css'
import "./assets/css/global.css"
import waitingList from './components/waitingList.vue'
import jse from './plugins/encrypt';
import lodash from 'lodash'
import SearchBox from "@/components/SearchBox/index.js";

//Load the root component
const app = createApp(App);
app.use(store).use(router);
app.use(ElementPlus,{locale});
app.use(SearchBox);
app.config.globalProperties.$axios=axios;//配置全局属性
app.config.globalProperties.$jse=jse;//配置全局属性
app.config.globalProperties.waitingList = waitingList;
app.config.globalProperties.$lodash = lodash;
app.config.globalProperties.$rootURL = process.env.VUE_APP_ROOT_URL;
app.config.globalProperties.staticURL = process.env.VUE_APP_BACKEND_URL.replace("_backend",""); //配置全局静态文件地址，如图片
app.mount('#app');
