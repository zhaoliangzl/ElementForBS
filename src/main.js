import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";

//剪贴板插件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

//粒子特效
import VueParticles from 'vue-particles'
Vue.use(VueParticles)

import CryptoJS from 'crypto-js'
Vue.use(CryptoJS)
Vue.prototype.$CryptoJS = CryptoJS;

//文件md5编码获取
import SparkMD5 from 'spark-md5'
Vue.prototype.$SparkMD5 = SparkMD5;

Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios;

import md5 from 'js-md5';
Vue.prototype.$md5 = md5;

import global_ from './components/tools/Global'
Vue.prototype.GLOBAL = global_
Vue.prototype.URL = "http://127.0.0.1:8762"
//"https://gamex.izliang.com/upload"
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('dev_username');
    if((to.path == '/register') || (to.path == '/forgetpass') ){
        next();
    }else if ((!role && to.path !== '/login')) {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
})


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')