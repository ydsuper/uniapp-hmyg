<template>
	<view class="userinfo-container">
		<!-- 头像昵称区域 -->
		<view class="top-box">
			<!-- <image :src="userInfo.avatarUrl" class="avatar"></image>
			<view class="nickname">{{userInfo.nickName}}</view> -->
			<image src="https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2501836331,2716458074&fm=26&gp=0.jpg"
				class="avatar"></image>
			<view class="nickname">我是小优</view>
		</view>

		<!-- 面板的列表区域 -->
		<view class="panel-list">
			<!-- 第一个面板 start -->
			<view class="panel">
				<view class="panel-body">
					<view class="panel-item">
						<text>8</text>
						<text>收藏的店铺</text>
					</view>
					<view class="panel-item">
						<text>14</text>
						<text>收藏的商品</text>
					</view>
					<view class="panel-item">
						<text>18</text>
						<text>关注的商品</text>
					</view>
					<view class="panel-item">
						<text>84</text>
						<text>足迹</text>
					</view>
				</view>
			</view>
			<!-- 第一个面板 end -->

			<!-- 第二个面板 start -->
			<view class="panel">
				<!-- 面板的标题 -->
				<view class="panel-title">我的订单</view>
				<!-- 面板的主体 -->
				<view class="panel-body">
					<!-- 面板主体中的 item 项 -->
					<view class="panel-item">
						<image src="/static/my-icons/icon1.png" class="icon"></image>
						<text>待付款</text>
					</view>
					<view class="panel-item">
						<image src="/static/my-icons/icon2.png" class="icon"></image>
						<text>待收货</text>
					</view>
					<view class="panel-item">
						<image src="/static/my-icons/icon3.png" class="icon"></image>
						<text>退款/退货</text>
					</view>
					<view class="panel-item">
						<image src="/static/my-icons/icon4.png" class="icon"></image>
						<text>全部订单</text>
					</view>
				</view>
			</view>
			<!-- 第二个面板 end -->

			<!-- 第三个面板 start -->
			<view class="panel">
				<view class="panel-list-item">
					<text>收货地址</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
				<view class="panel-list-item">
					<text>联系客服</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
				<view class="panel-list-item" @click="logout">
					<text>退出登录</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
			</view>
			<!-- 第三个面板 end -->
		</view>

	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";

	export default {
		name: "my-userInfo",
		computed: {
			// 导入vuex数据
			...mapState("m_user", ["userInfo"]),
		},
		data() {
			return {

			};
		},
		methods: {
			//【退出登录】
			async logout() {
				const [err, succ] = await uni.showModal({
					title: "提示",
					content: "确认退出登录吗？"
				}).catch(err => err);
				console.log(err, succ);

				if (succ && succ.confirm) {
					// 用户确认了退出登录操作
					// 需要清空 vuex中的 userInfo,token,address
					this.$store.commit("m_user/updateUserInfo", {});
					this.$store.commit("m_user/updateToken", "");
					this.$store.commit("m_user/updateAddress", {});
				}

			}
		}
	}
</script>

<style lang="scss">
	.userinfo-container {
		height: 100%;
		background-color: #f4f4f4;

		// 头像区域
		.top-box {
			height: 400rpx;
			background-color: #c00000;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.avatar {
				display: block;
				width: 180rpx;
				height: 180rpx;
				border-radius: 50%;
				border: 4rpx solid #ffffff;
				box-shadow: 0 2rpx 10rpx #000000;
			}

			.nickname {
				font-size: 32rpx;
				font-weight: 700;
				color: #ffffff;
				margin-top: 20rpx;
			}
		}
	}

	// 面板的列表区域
	.panel-list {
		padding: 0 20rpx;
		position: relative;
		top: -20rpx;

		.panel {
			background-color: #ffffff;
			border-radius: 6rpx;
			margin-bottom: 16rpx;

			.panel-title {
				font-size: 30rpx;
				line-height: 90rpx;
				padding-left: 20rpx;
				border-bottom: 1rpx solid #f4f4f4;
			}

			.panel-body {
				display: flex;
				justify-content: space-around;

				.panel-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-around;
					font-size: 26rpx;
					padding: 20rpx 0;
				}

				.icon {
					width: 70rpx;
					height: 70rpx;
				}
			}

			// 第三块面板 item
			.panel-list-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 10rpx;
				height: 90rpx;
				font-size: 30rpx;
			}
		}
	}
</style>
