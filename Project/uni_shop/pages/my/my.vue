<template>
	<view class="my-container">
		<!-- 未登录-用户登录组件 -->
		<my-login v-if="!token"></my-login>

		<!-- 已登录-用户信息组件 -->
		<my-userInfo v-else></my-userInfo>
	</view>
</template>

<script>
	import badgeMix from "@/mixins/tabbar-badge.js";
	import {
		mapState
	} from "vuex";

	export default {
		mixins: [badgeMix],
		computed: {
			// 获取vuex数据
			...mapState("m_user", ["token"]),
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	page,
	.my-container {
		height: 100%;
	}
</style>
