// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Common from '../common';
import Echarts from 'echarts';
import Axios from 'axios';

Vue.prototype.Echarts = Echarts;
Vue.prototype.Common = Common;
Vue.config.productionTip = false;
Vue.prototype.$axios = Axios;
// Axios.defaults.baseURL = '/vrl';
Axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.use(ElementUI);
Vue.use(Echarts);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
});
