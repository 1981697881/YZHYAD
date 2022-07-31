import Vue from 'vue'
import App from './App'
import store from '@/common/store'
import cuCustom from '@/static/colorui/components/cu-custom.vue'
import router from '@/common/router'
import tools from '@/common/utils/tools'
import '@/common/utils/sdk/sdk-h5.js'
import Json from './csJson/Json.js' //测试用数据
import {
	API_URL
} from './env.js'
//引入全局uView
import uView from 'uview-ui'
Vue.use(uView)
import appShare from '@/common/mixins/app-share'
Vue.mixin(appShare);

import {
	RouterMount
} from 'uni-simple-router'
import api from '@/common/request/index'
Vue.prototype.$store = store;
Vue.prototype.$api = api;
Vue.prototype.$tools = tools;
Vue.prototype.$isPreviewApi = false;
Vue.prototype.$API_URL = API_URL;
//状态栏高度
Vue.prototype.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
Vue.component('cu-custom', cuCustom);
Vue.config.productionTip = false;
App.mpType = 'app';
const msg = (title, icon = 'none', duration = 1500, mask = false) => {
	// 全局统一提示
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

const loading = (statu, title = '加载中') => {
	// Loading
	if (Boolean(statu) === false) {
		uni.hideLoading();
	} else {
		uni.showLoading({
			title
		});
	}
}
const json = type => {
	// 模拟异步请求数据
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(Json[type]);
		}, 500)
	})
}
const app = new Vue({
	store,
	...App
});
Vue.prototype.$json = {
	msg,
	json,
	loading
}

// #ifdef H5
import wxsdk from '@/common/wechat/sdk'

Vue.prototype.$wxsdk = wxsdk;
RouterMount(app, '#app');
// #endif

// #ifndef H5
app.$mount();
// #endif
