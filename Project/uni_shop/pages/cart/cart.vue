<template>
	<view class="cart-container" v-if="cart.length!==0">
		<!-- 收货地址 -->
		<my_address></my_address>

		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart-title-text">购物车</text>
		</view>

		<!-- 购物商品列表 -->
		<uni-swipe-action>
			<block v-for="(item,i) in cart" :key="item.goods_id">
				<uni-swipe-action-item :rightOptions="options" @click="swipeActionClick($event,item)">
					<view class="cart-item">
						<view class="cart-item-left">
							<radio :checked="item.goods_state" color="#C00000" @click="clickRadio(item)"></radio>
							<image :src="item.goods_small_logo || defaultPic" class="goods-pic"
								@click="gotoDetail(item.goods_id)"></image>
						</view>
						<view class="cart-item-right">
							<view class="goods-name">{{item.goods_name}}</view>
							<view class="goods-buy">
								<view class="goods-price">￥{{handlePrice(item.goods_price)}}</view>
								<uni-number-box :min="1" :value="item.goods_count" @change="changeCount($event, item)"
									@blur="blurCount">
								</uni-number-box>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>

		<!-- 结算商品 -->
		<my_settle></my_settle>
	</view>

	<view class="empty-cart" v-else>
		<image src="/static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也~</text>
	</view>
</template>

<script>
	import badgeMix from "@/mixins/tabbar-badge.js";
	import {
		mapState
	} from "vuex";

	export default {
		// 传入mixins
		mixins: [badgeMix],
		computed: {
			...mapState("m_cart", ["cart"]),
		},
		data() {
			return {
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				// 左滑删除 配置信息
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#C00000'
					}
				}],
			};
		},
		methods: {
			// #ifndef 保留小数
			handlePrice(p) {
				return p.toFixed(2);
			},
			// #endif

			// #ifndef 切换商品的勾选状态
			clickRadio(item) {
				this.$store.commit("m_cart/updateGoodsState", item);
			},
			// #endif

			// #ifndef 修改商品数量[change,blur]
			changeCount(val, item) {
				// console.log(val); //@log
				// 值改变 & 是Number类型 & 不是小数
				if (val !== item.goods_count && Number(val) && String(val).indexOf('.') === -1) {
					item.goods_count = val;
					this.$store.commit("m_cart/updateGoodsCount", item);
				}
			},
			// 失焦 处理
			blurCount(e) {
				// console.log(e); //@log
				const val = parseInt(e.detail.value);
				// console.log(val); //@log
				if (!val) {
					e.detail.value = 1;
				} else {
					e.detail.value = val;
				}
			},
			// #endif

			// #ifndef 删除购物车商品
			swipeActionClick(e, item) {
				console.log(e);
				this.$store.commit("m_cart/deleteGoods", item);
			},
			// #endif

			// #ifndef 跳转商品详情
			gotoDetail(id) {
				uni.navigateTo({
					url: `/subpkg/goods_detail/goods_detail?goods_id=${id}`
				})
			},
			// #endif

		}
	}
</script>

<style lang="scss">
	.cart-container {
		padding-bottom: 100rpx;
	}

	// 购物车商品列表标题
	.cart-title {
		height: 80rpx;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		padding-left: 10rpx;
		border-bottom: 1rpx solid #efefef;

		.cart-title-text {
			padding-left: 20rpx;
		}
	}

	.cart-item {
		display: flex;
		padding: 20rpx 10rpx;
		justify-content: space-between;
		border-bottom: 1rpx solid #efefef;
		box-sizing: border-box;
	}

	// 购物车列表
	.cart-item-left {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.goods-pic {
			width: 200rpx;
			height: 200rpx;
			display: block;
		}
	}

	.cart-item-right {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		padding-left: 20rpx;

		.goods-buy {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.goods-name {
			font-size: 24rpx;

		}

		.goods-price {
			font-size: 32rpx;
			color: #c00000;
		}
	}

	// 空的购物车
	.empty-cart {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 300rpx;

		.empty-img {
			width: 180rpx;
			height: 180rpx;
		}

		.tip-text {
			font-size: 24rpx;
			color: gray;
			margin-top: 30rpx;
		}
	}
</style>
