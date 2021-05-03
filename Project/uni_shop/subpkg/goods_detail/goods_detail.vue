<template>
	<view>
		<!-- 轮播图 -->
		<swiper indicator-dots circular autoplay :interval="3000" :duration="1000">
			<swiper-item v-for="(item,i) in goodsInfo.pics" :key="item.pics_id">
				<!-- <image :src="item.pics_big" @click="preview(i)"></image> -->
				<image :src="item.pics_mid" @click="preview(i)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息 -->
		<view class="goods-msg" v-if="goodsInfo.goods_name">
			<view class="goods-price">￥{{goodsInfo.goods_price}}</view>
			<view class="goods-msg-body">
				<!-- 商品名称 -->
				<view class="goods-name">{{goodsInfo.goods_name}}</view>
				<!-- 收藏 -->
				<view class="goods-collect">
					<uni-icons type="star" size="18" color="r"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="goods-courier">快递：{{goods_info.goods_price>5000?'免运费':'不包邮'}}</view>
		</view>
		<!-- 商品详情图片 -->
		<view class="goods-img-box">
			<rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
		</view>

		<!-- 商品导航组件 -->
		<view class="goods_nav">
			<!-- fill 控制右侧按钮的样式 -->
			<!-- options 左侧按钮的配置项 -->
			<!-- buttonGroup 右侧按钮的配置项 -->
			<!-- click 左侧按钮的点击事件处理函数 -->
			<!-- buttonClick 右侧按钮的点击事件处理函数 -->
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="navClick"
				@buttonClick="navBtnClick" />
		</view>
	</view>
</template>

<script>
	// 导入 Vuex 模块中的辅助方法（mapState,mapMutations,mapGetters）
	import {
		mapState,
		mapMutations,
		mapGetters
	} from "vuex";

	export default {
		computed: {
			// 调用mapstate方法，把m_cart模块中的cart数组映射到当前页面中，作为计算属性来使用
			// ...mapState("模块的名称(命名空间的原因)", ["要映射的数据名称1", "要映射的数据名称2"])
			...mapState("m_cart", ["cart"]),
			...mapGetters("m_cart", ["total"]),
		},
		watch: {
			// 监听total 购物车数字徽标
			total: {
				handler(newVal) {
					// console.log(newVal); //@log
					const cartObj = this.options.find(x => x.text == "购物车");
					if (cartObj) cartObj.info = newVal;
				},
				immediate: true,
			},
		},
		data() {
			return {
				// 商品详情数据
				goodsInfo: {},
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				/* 商品nav 数据 */
				// nav左侧按钮组的配置对象
				options: [{
					icon: 'headphones',
					text: '客服'
				}, {
					icon: 'shop',
					text: '店铺'
				}, {
					icon: 'cart',
					text: '购物车',
					info: 0,
					infoBackgroundColor: '#ff0000', //角标背景色
					infoColor: "#ffffff" //角标前景色
				}],
				// 右侧按钮组的配置对象
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				],
			};
		},
		// 生命周期函数-页面加载
		onLoad(options) {
			console.log(options); //@log
			const {
				goods_id
			} = options;
			this.getGoodsInfo(goods_id);
		},
		methods: {
			// #ifndef 获取商品详情数据
			async getGoodsInfo(goods_id) {
				const {
					data: res
				} = await uni.$http.get("/api/public/v1/goods/detail", {
					goods_id
				});
				console.log(res); // @log
				if (res.meta.status !== 200) return uni.$showMsg();

				// 解决 .webp 格式图片在 ios 设备上无法正常显示的问题
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,
					'<img style="display:block;"').replace(/webp/g, 'jpg');
				// 处理轮播图为空 情况
				if (res.message.pics.length === 0) res.message.pics = [this.defaultPic, this.defaultPic]
				this.goodsInfo = res.message;
			},
			// #endif

			// #ifndef 预览图片[previewImage-api]
			preview(i) {
				// 调用 uni.previewImage() 方法预览图片
				uni.previewImage({
					current: i,
					urls: this.goodsInfo.pics.map(x => x.pics_big)
				})
			},
			// #endif

			// #ifndef 商品nav按钮点击
			// nav左侧按钮点击
			navClick(e) {
				console.log(e); //@log
				uni.showToast({
					title: `点击${e.content.text}`,
					icon: 'none'
				})
				// 购物车跳转
				if (e.content.text === '购物车') {
					uni.switchTab({
						url: "/pages/cart/cart"
					})
				}
			},
			// nav右侧按钮点击
			navBtnClick(e) {
				console.log(e); //@log
				// this.options[2].info++ //购物车商品数量+1

				// 1.判断是否点击"加入购物车"
				if (e.content.text === "加入购物车") {
					// 2.搭建一个商品的信息对象
					const goods = {
						goods_id: this.goodsInfo.goods_id, // 商品的ID
						goods_name: this.goodsInfo.goods_name, // 商品的名称
						goods_price: this.goodsInfo.goods_price, // 商品的价格
						goods_count: 1, // 商品的数量
						goods_small_logo: this.goodsInfo.goods_small_logo, // 商品的图片
						goods_state: true // 商品的勾选状态
					}
					// 3.通过this 调用addToCart
					this.addToCart(goods);
				}
				// ...
			},
			// #endif

			// #ifndef 把m_cart模块中的addToCart方法映射到当前页面中使用
			...mapMutations("m_cart", ["addToCart"]),
			// #endif

		}
	}
</script>

<style lang="scss">
	// 轮播图
	swiper {
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	// 商品详情信息
	.goods-msg {
		padding: 20rpx;
		padding-right: 0;

		.goods-price {
			font-size: 36rpx;
			color: #c00000;
		}

		.goods-msg-body {
			display: flex;
			justify-content: space-between;
		}

		.goods-name {
			font-size: 26rpx;
			padding-right: 20rpx;
		}

		.goods-collect {
			width: 240rpx;
			font-size: 24rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: gray;
			border-left: 1rpx solid #efefef;
		}

		.goods-courier {
			font-size: 24rpx;
			color: gray;
			padding: 20rpx 0;
		}
	}

	.goods-img-box {
		// 防止页面内容被底部的商品导航组件遮盖
		padding-bottom: 100rpx;
	}

	// 商品nav
	.goods_nav {
		// position: sticky; //不适合[会有闪现bug]
		position: fixed;
		z-index: 99;
		bottom: 0;
		width: 100%;
	}
</style>
