// 1.导入vue 和 vuex
import Vue from "vue";
import Vuex from "vuex";
// 1.1 导入购物车 vuex模块
import moduleCart from "./cart.js";
import moduleUser from "./user.js";

// 2.将vuex 安装为 vue的插件
Vue.use(Vuex);

// 3.创建 store 的实例对象
const store = new Vuex.Store({
	// TODO: 挂载 store 模块
	modules: {
		// 1.2挂载购物车的vuex模块
		m_cart: moduleCart,
		// 1.3挂载用户的vuex模块
		m_user: moduleUser,
	},
})

// 4.向外共享 Store 实例对象
export default store;
