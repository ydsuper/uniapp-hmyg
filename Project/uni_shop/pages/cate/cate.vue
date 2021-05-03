<template>
	<view>
		<!-- 0.搜索 -->
		<goods_search></goods_search>
		
		<!-- 1.分类列表 -->
		<view class="scroll-list">
			<!-- 左-列表 -->
			<scroll-view class="left-scroll-list" scroll-y :style="{height: wh + 'px'}">
				<view :class="['left-scroll-item',i===active?'active':'']" @click="activeChange(i)"
					v-for="(item,i) in cateList" :key="item.cat_id">
					{{item.cat_name}}
				</view>
			</scroll-view>
		
			<!-- 右-列表 -->
			<scroll-view class="right-scroll-list" scroll-y :style="{height:wh+'px'}" :scroll-top="scrollTop">
				<view class="right-lv2-item" v-for="(item,i) in cateLevel2" :key="item.cat_id">
					<!-- 二级标题 -->
					<view class="right-lv2-title">/ {{item.cat_name}} /</view>
					<!-- 三级分类 -->
					<view class="right-lv3-list">
						<view class="right-lv3-item" v-for="(item2,i2) in item.children" :key="item2.cat_id"
							@click="clickJumpGList(item2)">
							<!-- 图片 -->
							<image :src="item2.cat_icon" mode="widthFix"></image>
							<!-- 文字 -->
							<text>{{item2.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import badgeMix from "@/mixins/tabbar-badge.js";
	
	export default {
		mixins: [badgeMix],
		data() {
			return {
				// 0. 定义 窗口可用的高度 = 屏幕高度 - navigationBar高度 - tabBar高度
				wh: 0,
				// 1. 定义分类列表数据
				cateList: [],
				// 3. 列表右侧数据
				cateLevel2: [],
				// 2. 当前列表项的索引
				active: 0,
				// 4. 视图高度
				scrollTop: 0
			};
		},
		onLoad() {
			// 0.1 获取设备信息
			const sysInfo = uni.getSystemInfoSync();
			// console.log(sysInfo);
			this.wh = sysInfo.windowHeight - 50;
			console.log('windowHeight：' + this.wh); //@log

			// 3. 调用获取分类数据的方法
			this.getCateList();
		},
		methods: {
			// 2.1 定义获取分类数据的方法
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get("/api/public/v1/categories");
				console.log(res); //@log
				if (res.meta.status !== 200) uni.$showMsg();
				this.cateList = res.message; //列表数据
				this.cateLevel2 = res.message[0].children; //右侧列表数据
			},

			// 2.2 列表选中项改变的方法
			activeChange(i) {
				this.active = i;
				this.cateLevel2 = this.cateList[i].children;

				// 重置滚动高度（回到顶部）
				// this.scrollTop = 0;【✖】值始终未改变，导致无法识别，不会触发回到顶部
				this.scrollTop = this.scrollTop === 0 ? 0.01 : 0 //【✔】切换标记，达到触发回到顶部的目的
				// this.scrollTop = this.scrollTop ? 1 : 0 //【↑:简写】
			},

			// 2.3 点击跳转商品列表页面
			clickJumpGList(item) {
				// console.log(item); //@log
				const {
					cat_id
				} = item;
				// 跳转商品列表页面
				uni.navigateTo({
					url: `/subpkg/goods_list/goods_list?cid=${cat_id}`
				});
			}
		}
	}
</script>

<style lang="scss">
	.scroll-list {
		display: flex;
	}

	// 左-列表
	.left-scroll-list {
		width: 200rpx;
		background-color: #f7f7f7;
		text-align: center;
	}

	.left-scroll-item {
		line-height: 120rpx;
		font-size: 24rpx;

		&.active {
			background-color: #ffffff;
			position: relative;

			&::before {
				content: "";
				display: block;
				width: 6rpx;
				height: 60rpx;
				background-color: #c00000;
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}

	// 右-列表
	.right-lv2-title {
		font-size: 24rpx;
		font-weight: 700;
		text-align: center;
		padding: 32rpx 0;
	}

	.right-lv3-list {
		display: flex;
		flex-wrap: wrap;
	}

	.right-lv3-item {
		width: 33.33%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 20rpx;

		image {
			width: 120rpx;
			height: 120rpx;
		}

		text {
			font-size: 24rpx;
		}
	}
</style>
