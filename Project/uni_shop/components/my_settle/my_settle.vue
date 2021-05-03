<template>
	<view class="settle-container">
		<!-- (取消)全选 -->
		<view class="checked-all">
			<label class="radio" @click="changeAllState">
				<radio :checked="isAllCheck" color="#c00000"></radio>
				<text>全选</text>
			</label>
		</view>
		<!-- 合计 -->
		<view class="amount-box">
			合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		<!-- 结算按钮 -->
		<view class="settle-btn" @click="settlement">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapState,
	} from "vuex";

	export default {
		name: "my_settle",
		computed: {
			// 获取vuex数据
			...mapGetters("m_cart", ["checkedCount", "total", "checkedGoodsAmount"]), //结算选中
			...mapGetters("m_user", ["addressTotal"]), //用户地址
			...mapState("m_user", ["token"]), //用户登录
			...mapState("m_cart", ["cart"]), //用户登录
			// 是否全选
			isAllCheck() {
				return this.total === this.checkedCount;
			}
		},
		data() {
			return {
				// 定时器的ID
				timer: null,
				// (跳转)倒计时的秒数
				seconds: 3,
			};
		},
		methods: {
			// #ifndef 全选/反选
			changeAllState() {
				// 调用vuex方法 修改所有商品的勾选状态
				this.$store.commit("m_cart/updateAllGoodsState", !this.isAllCheck);
			},
			// #endif

			// #ifndef 商品结算
			settlement() {
				// 1. 先判断是否勾选了要结算的商品
				if (!this.checkedCount) return uni.$showMsg("请选择要结算的商品！");

				// 2. 再判断用户是否选择了收货地址
				if (!this.addressTotal) return uni.$showMsg("请选择收货地址！");

				// 3. 最后判断用户是否登录了
				// if (!this.token) return uni.$showMsg("请先登录");
				if (!this.token) return this.delayNavigate();

				// 4. 实现微信支付功能
				this.payOrder();
			},
			// #endif

			// 延迟导航到 my 页面 | 去登录
			delayNavigate() {
				this.showTips(this.seconds);

				// 创建定时器 每1秒执行一次
				this.timer = setInterval(() => {
					this.seconds--;

					if (this.seconds <= 0) {
						clearInterval(this.timer);
						// 跳转 my 页面
						return uni.switchTab({
							url: '/pages/my/my',
							success: () => {
								// 调用vuex的updateRedirectInfo 方法，把跳转信息存储到 Store中
								this.$store.commit("m_user/updateRedirectInfo", {
									openType: "switchTab",
									from: "/pages/cart/cart",
								});
							},
						})
					}

					this.showTips(this.seconds);
				}, 1000);
			},

			// 展示倒计时的提示信息
			showTips(n) {
				uni.showToast({
					icon: "none", //无icon
					title: `请先登录后再结算！${n}秒后自动跳转到登录页`, //提示信息
					mask: true, //遮障 防止点击穿透
					duration: 1500, //1.5秒后消失
				});
			},

			//【微信支付】
			async payOrder() {
				uni.$showMsg("请谨慎提防诈骗电话、信息！");

				// 1.【创建订单】
				// 1.1 组织订单的信息对象
				const orderInfo = {
					// order_price: this.checkedGoodsAmount, //开发时，注释真实的订单价格
					order_price: 0.01, //订单价格
					consignee_addr: this.addressTotal, //订单地址
					// map方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值
					goods: this.cart.filter(x => x.goods_state).map(x => ({
						goods_id: x.goods_id,
						goods_number: x.goods_count,
						goods_price: x.goods_price
					}))
				}
				// 1.2 发起请求创建订单
				const {
					data: res
				} = await uni.$http.post("/api/public/v1/my/orders/create", orderInfo);
				console.log(res); //@log
				if (res.meta.status !== 200) return uni.$showMsg("创建订单失败！");
				// 1.3 得到服务器响应的"订单编号"
				const orderNumber = res.message.order_number; //HMDD20210409000000009679

				// 2.【订单预支付】
				// 2.1 发起请求获取订单的支付信息
				const {
					data: res2
				} = await uni.$http.post("/api/public/v1/my/orders/req_unifiedorder", {
					order_number: orderNumber
				})
				console.log(res2); //@log
				// 2.2 预付订单生成失败
				if (res2.meta.status !== 200) return uni.$showMsg("预付订单生产失败！");
				// 2.3 得到订单支付相关的必要参数
				const payInfo = res2.message.pay;

				// 3.【发起微信支付】
				// 3.1 调用uni.requestPayment() 发起微信支付
				const [err, succ] = await uni.requestPayment(payInfo);
				console.log("微信支付");
				console.log(err); //@log
				console.log(succ); //@log
				
				// 3.2 未完成支付
				// if (err) return uni.$showMsg("订单未支付");
				
				// 3.3 完成了支付，进一步查询支付的结果
				const {
					data: res3
				} = await uni.$http.post("/api/public/v1/my/orders/chkOrder", {
					order_number: orderNumber
				})
				console.log("res3");
				console.log(res3); //@log
				
				// 3.4 检测到订单未支付
				if (res3.meta.status !== 200) return uni.$showMsg("订单未支付！");
				// 3.5 检测到订单支付成功
				uni.showToast({
					title: "支付成功！",
					icon: "success"
				})
			}
		}
	}
</script>

<style lang="scss">
	.settle-container {
		// position: sticky; //有时不适合置于底部时使用
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		background-color: #ffffff;
		z-index: 99;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 10rpx;
		font-size: 28rpx;
	}

	.radio {
		display: flex;
		align-items: center;
	}

	.amount {
		color: #C00000;
	}

	.settle-btn {
		min-width: 200rpx;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #c00000;
		color: #ffffff;
	}
</style>
