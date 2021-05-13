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


//Load the root component
const app = createApp(App);
app.use(store).use(router);
app.use(ElementPlus,{locale});
app.config.globalProperties.$axios=axios;//配置全局属性
app.config.globalProperties.waitingList = waitingList;
app.config.globalProperties.staticURL = 'http://xtra3090.d2.comp.nus.edu.sg/modelmarket/'; //配置全局静态文件地址，如图片
app.mount('#app');
