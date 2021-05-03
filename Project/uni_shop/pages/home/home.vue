<template>
	<view>
		<!-- 0. 搜索 -->
		<view class="search">
			<goods_search></goods_search>
		</view>

		<!-- 1. 轮播图 -->
		<swiper indicator-dots autoplay circular :interval="3000" :duration="1000">
			<swiper-item v-for="(item,i) in swiperList" :key="item.goods_id">
				<!-- view 改造成 navigator 导航跳转 -->
				<navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>

		<!-- 2. 导航区 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,i) in navList" :key="i" @click="clickJumpNav(item)">
				<image class="nav-img" :src="item.image_src"></image>
			</view>
		</view>

		<!-- 3. 楼层区 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item,i) in floorList" :key="i">
				<!-- 楼层标题 -->
				<image class="floor-title" :src="item.floor_title.image_src"></image>
				<!-- 楼层导航 -->
				<view class="floor-img-box">
					<view class="left-img-box" @click="clickJumpGList(item.product_list[0])">
						<image :src="item.product_list[0].image_src" mode="widthFix"
							:style="{width:item.product_list[0].image_width+'rpx'}"></image>
					</view>
					<view class="right-img-box">
						<view class="right-img-item" v-for="(subItem,subI) in item.product_list" :key="subI"
							v-if="subI!==0" @click="clickJumpGList(subItem)">
							<image :src="subItem.image_src" mode="widthFix" :style="{width:subItem.image_width+'rpx'}">
							</image>
							<!-- <image :src="subItem.image_src" mode="heightFix" :style="{height:'188rpx'}"></image> -->
						</view>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import badgeMix from "@/mixins/tabbar-badge.js";
	
	export default {
		mixins: [badgeMix],
		data() {
			return {
				// 1.1 定义轮播图数组
				swiperList: [],
				// 2.1 定义导航数据
				navList: [],
				// 3.1 定义楼层数据
				floorList: []
			};
		},
		// 小程序页面的生命周期函数(开始加载)
		onLoad() {
			// 1.3 调用获取轮播图数据方法
			this.getSwiperList();
			// 2.3 调用获取导航数据方法
			this.getNavList();
			// 3.3 调用获取楼层数据方法
			this.getFloorList();
		},
		methods: {
			// 1.2 定义获取轮播图数据的方法
			async getSwiperList() {
				const {
					data: res
				} = await uni.$http.get("/api/public/v1/home/swiperdata");
				console.log(res); //@log

				// 请求失败提示信息
				if (res.meta.status !== 200) return uni.$showMsg()
				// 获取轮播图数据
				this.swiperList = res.message;
			},

			// 2.2 定义获取导航数据的方法
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get("/api/public/v1/home/catitems");
				console.log(res); //@log
				if (res.meta.status !== 200) return uni.$showMsg();
				this.navList = res.message;
			},

			// 2.4 定义导航点击跳转
			clickJumpNav(item) {
				// console.log(item);
				if (item.name == "分类") {
					console.log("跳转分类"); //@log
					uni.switchTab({
						url: "/pages/cate/cate"
					})
				}
			},

			// 3.2 定义获取楼层数据的方法
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get("/api/public/v1/home/floordata");
				console.log(res); //@log
				if (res.meta.status !== 200) return uni.$showMsg();
				this.floorList = res.message;
			},

			// 3.4 定义商品列表点击跳转
			clickJumpGList(item) {
				console.log(item.name); //@log
				const {
					navigator_url
				} = item;
				// 编程式跳转 非tabBar
				uni.navigateTo({
					url: "/subpkg/goods_list/goods_list?" + navigator_url.split("?")[1]
				})
			}
		},
	}
</script>

<style lang="scss">
	// 1. 轮播图
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	// 2. 导航区
	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	// 3. 楼层区
	.floor-title {
		width: 100%;
		height: 60rpx;
		display: flex;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10rpx;
	}

	.floor-list {
		.right-img-box {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
		}
	}

	// 搜索
	.search {
		// 粘性定位sticky
		position: sticky;
		top: 0;
		z-index: 999;
	}
</style>
