export default {
	// 开启命名空间
	namespaced: true,

	// 模块的 state 数据
	state: () => ({
		// 购物车数组 商品信息都包含6个属性
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state },
		cart: JSON.parse(uni.getStorageSync("cart") || '[]'),
	}),

	// 模块的 mutations 方法
	mutations: {
		// m1. 添加购物车数据方法
		addToCart(state, payload) {
			// m1.1 查找是否已有对应商品
			const findResult = state.cart.find((x) => x.goods_id === payload.goods_id);
			// 判断有无 选择操作
			if (!findResult) {
				state.cart.unshift(payload); //添加新商品
			} else {
				findResult.goods_count++; //购物车数量+1
			}
			console.log(findResult); //@log

			// 通过commit方法，调用 m_cart 命名空间下的 saveCartToStorage 方法
			this.commit("m_cart/saveCartToStorage");
		},

		// 持久化存储购物车的商品
		saveCartToStorage(state) {
			uni.setStorageSync("cart", JSON.stringify(state.cart));
		},

		// 更新商品的勾选状态
		updateGoodsState(state, payload) {
			// 利用some遍历，满足后 后面无需遍历
			state.cart.some(item => {
				if (item.goods_id === payload.goods_id) {
					// 更新商品的勾选状态
					item.goods_state = !item.goods_state;
					// 持久化存储到本地
					this.commit("m_cart/saveCartToStorage");
					return true;
				}
			})
		},

		// 更新商品的数量
		updateGoodsCount(state, payload) {
			// 利用some遍历，满足后 后面无需遍历
			state.cart.some(item => {
				if (item.goods_id === payload.goods_id) {
					// 更新商品的数量
					item.goods_count = +payload.goods_count;
					// 持久化存储到本地
					this.commit("m_cart/saveCartToStorage");
					return true;
				}
			})
		},

		// 删除购物车商品
		deleteGoods(state, payload) {
			// console.log(state); //@log

			console.log(payload);
			// filter 方法过滤
			state.cart = state.cart.filter(x => x.goods_id !== payload.goods_id);
			// 持久化存储到本地
			this.commit("m_cart/saveCartToStorage");
		},

		// 更新所有商品的勾选状态（newState）
		updateAllGoodsState(state, newState) {
			state.cart.forEach(x => x.goods_state = newState);

			// 持久化存储到本地
			this.commit("m_cart/saveCartToStorage");
		}

	},

	actions: {
		demo: {
			// 定义全局actions方法 脱离命名空间（mutations不支持）
			root: true,
			handler(namespacedContext, payload) {
				console.log("demo-acitons");
			},
		},
	},

	// 模块的 getters 属性
	getters: {
		// 统计购物车中商品的总数量
		total(state) {
			// let sum = 0;
			// // 循环统计商品的数量，累加到c变量中
			// state.cart.forEach(n => sum += n.goods_count);
			// console.log(sum);
			// return sum;

			// 利用 reduce 累加器求和
			return state.cart.reduce((total, item) => total += item.goods_count, 0);
		},

		// 统计勾选商品的总数量
		checkedCount(state) {
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0);
		},

		// 统计勾选商品的总价格
		checkedGoodsAmount(state) {
			return state.cart.filter(x => x.goods_state)
				.reduce((total, item) => total += item.goods_count * item.goods_price, 0)
				.toFixed(2);
		},
	},
}
