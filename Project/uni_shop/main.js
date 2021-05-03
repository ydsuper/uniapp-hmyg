import Vue from 'vue'
import App from './App'

import "./common/uni.css";
// promise化方法
import uniPromise from "./common/uniPromise.js";
Vue.prototype.$uni = uniPromise;

import store from "./store/store";

Vue.config.productionTip = false

App.mpType = 'app';

const app = new Vue({
	...App,
	// 将 store 挂载到 Vue 实例上
	store,
})
app.$mount()

//【封装uni的网络请求】
// 1.导入网络请求包
import {
	$http
} from "@escook/request-miniprogram";

// 2.全局挂载请求
uni.$http = $http;

// 3.配置请求的基准地址
// $http.baseUrl = "https://www.uinav.com";
$http.baseUrl = "https://api-hmugo-web.itheima.net";

// 4.请求拦截器
$http.beforeRequest = function(options) {
	// 弹窗加载
	uni.showLoading({
		title: '数据加载中...',
		mask: true
	})

	// 请求头 - token
	if (options.url.indexOf("/my/") !== -1) {
		console.log("token请求头");
		options.header = {
			// 手动token [-无token-]
			Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUzLCJpYXQiOjE2MTc5NTQyMTYsImV4cCI6MTAwMTYxNzk1NDIxNX0.wpJqjziOCXcPMBX-RNC-uobzTQjif7dU0mwvtNi-sYU"
		}
	}
}

// 5.响应拦截器
$http.afterRequest = function() {
	// 隐藏加载
	uni.hideLoading()
	// setTimeout(() => {
	// 	uni.hideLoading()
	// }, 2000);
}

//【封装uni.$showMsg】解决经常调用 uni.showToast({ /* 配置对象 */ }) 提示用户
uni.$showMsg = function(title = "数据请求失败！", duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: "none"
	})
}
