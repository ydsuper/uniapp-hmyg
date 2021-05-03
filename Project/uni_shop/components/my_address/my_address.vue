<template>
	<view>
		<!-- 选择收货地址的盒子 -->
		<view class="address-choose-box" v-if="JSON.stringify(address)==='{}'">
			<button type="primary" size="mini" @click="chooseAddress">请选择收货地址+</button>
		</view>

		<!-- 收货地址信息盒子 -->
		<view class="address-info-box" v-else @click="chooseAddress">
			<view class="info-row1">
				<view class="info-name">收货人：<text>{{address.userName}}</text></view>
				<view class="info-phone">电话：<text>{{address.telNumber}}</text>
					<uni-icons class="arrow" type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			<view class="info-row2">
				<view class="info-address">收货地址：<text>{{addressTotal}}</text></view>
			</view>
		</view>

		<!-- 边界线框 -->
		<image src="/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from "vuex";
	export default {
		name: "my_address",
		computed: {
			// 引入vuex 数据
			...mapState("m_user", ["address"]),
			...mapGetters("m_user", ["addressTotal"]),
		},
		data() {
			return {
				// 收货地址
			};
		},
		methods: {
			// #ifndef 设置收货地址
			async chooseAddress() {
				// 1. 通过 chooseAddress API 获取收货地址 [返回值为数组:第1项是错误对象，第2项是成功后的收货地址对象]
				const [err, success] = await uni.chooseAddress().catch(err => err);
				console.log(err); //@log
				console.log(success) //@log

				// 2. 用户成功的选择了收货地址
				if (err === null && success.errMsg === "chooseAddress:ok") {
					// 调用vuex 更新存储更新
					return this.$store.commit("m_user/updateAddress", success);
				}

				// 3. 若是用户没有授权地址
				if (!this.addressTotal && err && (err.errMsg === "chooseAddress:cancel" || err.errMsg ===
					"chooseAddress:fail cancel")) {
					// 调用 this.reAddress 方法，向用户重新发起授权申请
					this.reAddress();
				}
			},
			// #endif

			// #ifndef 重新发起收货地址的请求
			async reAddress() {
				// 3.1 提示用户对地址进行授权
				const [err, confirmResult] = await uni.showModal({
					content: "检测到您没打开地址权限，是否去设置打开？",
					"confrimText": "确认",
					"cancelTetxt": "取消",
				});

				// 3.2 如果弹窗异常，则直接退出
				if (err) return;

				// 3.3 用户取消了地址授权，提示信息
				if (confirmResult.cancel) return uni.$showMsg("您取消了地址授权！")

				// 3.3 用户同意了地址授权，提示信息
				if (confirmResult.confirm) return uni.openSetting({
					success(settingResult) {
						// console.log(settingResult); //@log
						if (settingResult.authSetting["scope.address"]) {
							return uni.$showMsg("授权成功！请选择地址");
						}
						return uni.$showMsg("您取消了地址授权！");
					}
				})

			},
			// #endif
		}
	}
</script>

<style lang="scss">
	.address-choose-box {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 180rpx;
	}

	.address-info-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 190rpx;
		padding: 10rpx;
		font-size: 24rpx;

		.info-row1 {
			display: flex;
			justify-content: space-between;

			.arrow {
				margin-left: 10rpx;
			}
		}

		.info-row2 {
			padding-top: 20rpx;
		}
	}

	.address-border {
		display: block;
		width: 100%;
		height: 10rpx;
	}
</style>
