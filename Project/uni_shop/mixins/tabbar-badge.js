// 使用 Vue 提供的 mixins 特性，提高代码的可维护性。
import {
	mapGetters
} from 'vuex'

export default {
	data() {
		return {};
	},
	computed: {
		...mapGetters("m_cart", ["total"]),
	},
	watch: {
		// 监听 taotal 值的变化
		total() {
			// 调用 methods 中的 setBadge 方法，重新为 tabBar 的数字徽章赋值
			this.setBadge();
		}
	},
	// 生命周期-页面刚展示
	onShow() {
		this.setBadge();
	},
	methods: {
		setBadge() {
			// 调用 setTabBarBadge 设置tabBar的数字徽标
			uni.setTabBarBadge({
				index: 2,
				text: this.total + '', // 注意：text的值必须是字符串，不能是数字
			})
		},
	}
}
