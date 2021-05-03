<template>
	<view class="search-box" :style="{'backgroundColor':bgcolor}" @click="clickJumpSearch">
		<view class="search-btn" :style="{'borderRadius':radius+'rpx'}">
			<uni-icons type="search" size="17"></uni-icons>
			<text>搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "goods_search",
		data() {
			return {

			};
		},
		props: {
			// 抽离样式【增强组件的通用性】
			"bgcolor": {
				type: String,
				default: "#c00000"
			},
			"radius": {
				default: 30
			}
		},
		methods: {
			clickJumpSearch() {
				uni.navigateTo({
					url: "/subpkg/search/search"
				})
			}
		}
	}
</script>

<style lang="scss">
	.search-box {
		height: 100rpx;
		// background-color: var(--themeColor); //抽离
		display: flex;
		align-items: center;
		padding: 0 20rpx;
	}

	.search-btn {
		height: 72rpx;
		width: 100%;
		background-color: #ffffff;
		// border-radius: 30rpx; //抽离
		display: flex;
		justify-content: center;
		align-items: center;

		text {
			font-size: 30rpx;
			padding-left: 10rpx;
		}
	}
</style>
