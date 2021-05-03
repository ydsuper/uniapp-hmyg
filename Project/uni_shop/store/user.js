export default {
	// 开启命名空间
	namespaced: true,

	state: () => ({
		// 购物车地址
		address: JSON.parse(uni.getStorageSync("address") || "{}"),
		// 登录成功后的token字符串
		token: uni.getStorageSync("token") || "",
		// 用户的基本信息
		userInfo: JSON.parse(uni.getStorageSync("userInfo") || "{}"),
		// 重定向的 object对象 (openType, from)
		redirectInfo: null,
	}),

	mutations: {
		// 更新收货地址
		updateAddress(state, payload) {
			state.address = payload;
			// 持久化存储到本地
			this.commit("m_user/saveAddressToStorage");
		},
		// 持久化存储地址信息
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address));
		},

		// 更新用户的基本信息
		updateUserInfo(state, payload) {
			state.userInfo = payload;
			// 持久化存储到本地
			this.commit("m_user/saveUserInfoToStorage");
		},
		// 持久化存储用户信息
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo));
		},

		// 更新 token
		updateToken(state, payload) {
			state.token = payload;
			// 持久化存储到本地
			this.commit("m_user/saveTokenToStorage");
		},
		// 持久化存储 token
		saveTokenToStorage(state) {
			console.log(state.token); //@log
			uni.setStorageSync('token', state.token);
		},

		// 更新重定向的信息对象
		updateRedirectInfo(state, info) {
			state.redirectInfo = info;
		},

	},

	getters: {
		// 收货地址[详]
		addressTotal(state) {
			if (!state.address.provinceName) return "";
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address
				.detailInfo;
		},
	}

}
