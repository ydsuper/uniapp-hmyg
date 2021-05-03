<template>
	<view class="list-container">
		<view class="goods-list">
			<!--【goods-item】可以封装成components引入使用[这里不采用] -->
			<view class="goods-item" v-for="(item,i) in goodsList" :key="item.goods_id"
				@click="clickJumpDetail(item.goods_id)">
				<!-- 左-图 -->
				<view class="goods-left-img">
					<image class="goods-img" :src="item.goods_small_logo || defaultPic"></image>
				</view>
				<!-- 右-信息 -->
				<view class="goods-right-info">
					<view class="goods-info">{{item.goods_name}}</view>
					<view class="goods-price">￥{{handlePrice(item.goods_price)}}</view>
				</view>
			</view>
		</view>
		<!-- 上拉加载 组件 -->
		<view class="reach-bottom" v-show="isReachBottom">
			<uni-load-more :status="loadStatus" iconSize="16"></uni-load-more>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 定义请求对象
				queryObj: {
					query: "", //搜索关键字
					cid: "", //商品分类id
					pagenum: 1, //页码
					pagesize: 10 //每页数量
				},
				// 商品列表数据
				goodsList: [],
				// 商品总数
				total: "",
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				//#ifndef 上拉加载[相关]
				// 是否触底
				isReachBottom: false,
				// 记录滑动时的高度
				pressY: 0,
				// 加载状态
				loadStatus: "loading",
				//#endif
			};
		},
		// 页面加载-生命周期
		onLoad(options) {
			console.log(options); //@log
			// 将页面参数存到 queryOjb 中
			this.queryObj.query = options.query || "";
			this.queryObj.cid = options.cid || "";

			// 调用请求数据
			this.getGoodsList();
		},
		// #ifndef 下拉刷新
		onPullDownRefresh() {
			this.queryObj.pagenum = 1;
			this.goodsList = []; //清空数组
			this.getGoodsList(); //加载
		},
		// 上拉加载
		onReachBottom() {
			this.isBottom = true;
		},
		// #endif
		methods: {
			// #ifndef 请求商品列表数据
			async getGoodsList() {
				// 判断是否数据是否加载完
				const {
					data: res
				} = await uni.$http.get("/api/public/v1/goods/search", this.queryObj);
				console.log(res); //@log
				if (res.meta.status !== 200) return uni.$showMsg();
				this.goodsList = [...this.goodsList, ...res.message["goods"]];
				this.total = res.message["total"];
			},
			// #endif

			// #ifndef 保留2位小数
			handlePrice(p) {
				return p.toFixed(2);
			},
			// #endif

			// #ifndef 跳转商品详情
			clickJumpDetail(id) {
				uni.navigateTo({
					url: `/subpkg/goods_detail/goods_detail?goods_id=${id}`
				})
			},
			// #endif
			
			// #ifndef 上拉加载
			async onReachBottom() {
				this.isReachBottom = true;
				if ((this.queryObj.pagenum * this.queryObj.pagesize) >= this.total) {
					return this.loadStatus = "nomore";
				}
				this.queryObj.pagenum++;
				await this.getGoodsList();
				this.isReachBottom = false;
			},
			// #endif

			// #ifndef 触底后上拉滑动[touchmove][touchstart][touchend][-弃-]
			handletouchmove(e) {
				const currentY = e.changedTouches[0].pageY;
				// console.log(currentY); //@log

				if (this.isReachBottom && this.pressY > currentY) {
					console.log("上拉中..")
				}
			},

			async handletouchstart(e) {
				// 获取高度
				this.judgeReachBottom();
				this.pressY = e.changedTouches[0].pageY;
				// console.log(this.pressY); //@log
			},

			async handletouchend() {
				console.log("-松开-");
				// 判断松开后
				this.handlePullLoad();
				// 定义中加载status
				if (this.isReachBottom) {
					await this.getGoodsList();
					console.log("关闭加载");
				}
			},
			// #endif

			// #ifndef 处理当前是否处于底部[最底][-弃-]
			judgeReachBottom() {
				// 可视视口高度
				const wh = uni.getSystemInfoSync().windowHeight;
				console.log(wh); //@log

				// view属性
				const query = uni.createSelectorQuery();
				query.select('.list-container').boundingClientRect()
				query.selectViewport().scrollOffset()
				query.exec((res) => {
					console.log(res);
					this.isReachBottom = (wh + res[1].scrollTop) === res[1].scrollHeight;
					console.log('到底：' + this.isReachBottom) //@log
				})
			},
			// #endif

		},
	}
</script>

<style lang="scss">
	// 商品列表
	.goods-item {
		display: flex;
		padding: 20rpx 10rpx;
		border-bottom: 1rpx solid #f0f0f0;

		.goods-img {
			width: 200rpx;
			height: 200rpx;
		}

		.goods-right-info {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-left: 20rpx;
		}

		.goods-info {
			font-size: 26rpx;
		}

		.goods-price {
			font-size: 32rpx;
			color: #c00000;
		}
	}

	// 底部加载
	.reach-bottom {
		height: 100rpx;
		text-align: center;
	}
</style>
