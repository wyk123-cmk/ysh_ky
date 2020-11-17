import Vue from 'vue'
import App from './App'
import util from './common/js/util'
import store from './common/js/store'
import {apiHost, apiUrl, appId, wxappid, agreeContent} from './common/js/config'
import pageImges from './components/page-discount/page-discount.vue' //首次活动提醒
//#ifdef H5
import './hybrid/html/weixin-js-sdk/ican-clipBoard'
//#endif

Vue.config.productionTip = false;
Vue.prototype.$util = util;
Vue.prototype.wxappid = wxappid;
Vue.prototype.apiHost = apiHost;
Vue.prototype.apiUrl = apiUrl;
Vue.prototype.appId = appId;
Vue.prototype.agreeContent = agreeContent;
Vue.component('page-imges',pageImges);

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()