<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#afafaf"></uni-icons>
		<!-- 登录按钮 -->
		<button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";

	export default {
		name: "my-login",
		computed: {
			...mapState("m_user", ["redirectInfo"]),
		},
		data() {
			return {

			};
		},
		methods: {
			// 判断是否获取用户信息成功
			getUserInfo(e) {
				console.log(e.detail); //@log

				// 判断是否获取用户信息成功
				if (e.detail.errMsg === "getUserInfo:fail") return uni.$showMsg("您取消了登录授权！");

				// 获取用户信息成功 e.detail.userInfo 即为用户的基本信息
				// console.log(e.detail.userInfo); //@log

				// 将用户的基本信息存储到 vuex 中
				this.$store.commit("m_user/updateUserInfo", e.detail.userInfo);

				// 调用接口方法 获取登录成功后的 Token 字符串
				this.getToken(e.detail);
			},

			// 调用登录接口 获取永久的token
			async getToken(info) {
				// 调用微信登录接口，实现登录的功能
				const [err, res] = await uni.login().catch(err => err);
				console.log(res); //@log
				// 判断是否 uni.login() 调用失败
				if (err || res.errMsg !== "login:ok") uni.$showError("登录失败");

				// 准备参数对象
				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					// rawData: JSON.stringify(info.rawData),
					signature: info.signature
				}

				// 用参数对象 换区 token
				const {
					data: loginResult
				} = await uni.$http.post("/api/public/v1/users/wxlogin", query);
				console.log(loginResult); //@log

				if (loginResult.meta.status !== 200) {
					uni.$showMsg("失败又怎样？？？");
					this.$store.commit("m_user/updateToken", "失败乃成功之母！");
					// 跳转返回切换的页面
					return setTimeout(() => this.backPreviousPage(), 1000);
				}

				uni.$showMsg("登录成功");
				// 存储token 到vuex中
				this.$store.commit("m_user/updateToken", loginResult.message.token);

				// 跳转返回切换的页面
				this.backPreviousPage();
			},
			// 返回登录之前的页面
			backPreviousPage() {
				// redirectInfo 不为null  且导航方式为switchTab
				if (this.redirectInfo && this.redirectInfo.openType === "switchTab") {
					uni.switchTab({
						url: this.redirectInfo.from,
						complete: () => {
							this.$store.commit("m_user/updateRedirectInfo", null);
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	// 登录盒子的样式
	.login-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 1000rpx;
		background-color: #f8f8f8;
		position: relative;
		// overflow: hidden;

		// 绘制登录盒子底部的半椭圆造型
		&::after {
			content: "";
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: #ffffff;
			border-radius: 100%;
			transform: translateY(50%);
		}

		// 登录按钮的样式
		.btn-login {
			width: 90%;
			border-radius: 200rpx;
			margin: 30rpx 0;
			background-color: #c00000;
		}

		// 按钮下方提示消息的样式
		.tips-text {
			font-size: 24rpx;
			color: gray;
		}
	}
</style>
