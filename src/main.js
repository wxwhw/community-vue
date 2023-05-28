import Vue from 'vue'

// element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// mavon-editor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 图片裁剪插件
import VueCropper from 'vue-cropper'

import './assets/home.css'

import App from './App.vue'
import router from './router'
import request from './utils/request';
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import store from './utils/store'

Vue.config.productionTip = false

// user element-ui
Vue.use(ElementUI,{
  size:'small'
});

Vue.use(VueCropper)

Vue.use(mavonEditor)
Vue.prototype.request=request

Vue.component('Sidebar',Sidebar)
Vue.component('Header',Header)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
