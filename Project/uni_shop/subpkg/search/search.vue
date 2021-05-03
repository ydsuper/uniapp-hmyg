<template>
	<view>
		<!-- 搜索框 -->
		<view class="search-box">
			<uni-search-bar focus v-model="keyword" :radius="30" cancelButton="none" @confirm="hanldeInput" @clear="handleClear">
			</uni-search-bar>
		</view>

		<!-- 搜索历史 -->
		<view class="history-box" v-if="keyword.length===0">
			<!-- 搜索历史标题 -->
			<view class="history-title" v-if="historyList.length!==0">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="isClear"></uni-icons>
			</view>
			<!-- 弹窗确认删除记录 -->
			<uni-popup ref="popup" type="dialog" :animation="false">
				<uni-popup-dialog mode="base" title="确认" content="确认要清除所有搜索历史吗？" @confirm="confirmClear">
				</uni-popup-dialog>
			</uni-popup>
			<!-- 历史列表 -->
			<view class="history-list">
				<uni-tag circle size="small" :text="item" v-for="(item,i) in historyList" :key="i"
					@click="clickHistory(item)"></uni-tag>
			</view>
		</view>

		<!-- 搜索结果 -->
		<view class="search-list" v-else-if="searchList.length!==0">
			<view class="search-item" v-for="(item,i) in searchList" :key="item.goods_id"
				@click="clickJumpDetail(item.goods_id)">
				<view class="search-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		
		<!-- 无搜索内容 -->
		<view class="notext" v-else-if="isEmpty">
				暂无搜索内容
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 搜索关键词
				keyword: "",
				// 定义定时器
				timer: null,
				// 搜索结果列表
				searchList: [],
				// 搜索历史记录
				historyList: [],
				// 搜索结果是否为空
				isEmpty: false
			};
		},
		// 页面加载 生命周啊
		onLoad() {
			// 获取本地存储中的 搜索历史记录
			this.historyList = JSON.parse(uni.getStorageSync("keyword") || "[]");
			console.log(this.historyList); //@log
		},
		methods: {
			// #ifndef 搜索请求
			hanldeInput(e) {
				// console.log(e); //@log

				// 0. 清理上次的定时器
				clearTimeout(this.timer);
				// 1. 重新定义定时器
				this.timer = setTimeout(() => {
					this.keyword = e.value;
					console.log(this.keyword); //@log
					// 调用搜索结果列表
					this.getSearchList();
				}, 500)
			},
			// #endif
			
			// #ifndef 点击搜索的清除按钮
			handleClear(){
				this.keyword = "";
				this.searchList = [];
				// 默认搜索结果不为空
				this.isEmpty = false;
			},
			// #endif

			// #ifndef 获取搜索结果列表数据
			async getSearchList() {
				// 判断keyword是否为空
				if (this.keyword.trim() === "") {
					return this.searchList = [];
				}
				// 请求获取搜索结果数据
				const {
					data: res
				} = await uni.$http.get("/api/public/v1/goods/qsearch", {
					query: this.keyword
				});
				console.log(res); //@log
				// 将keyword存进搜索历史里
				this.saveSearchHistory();

				if (res.meta.status !== 200) return uni.$showMsg();
				this.searchList = res.message;
				// 判断是否有搜索结果 修改data:isEmpty
				if(this.searchList.length===0) this.isEmpty=true;
			},
			// #endif

			// #ifndef 定义保存历史记录方法
			saveSearchHistory() {
				this.historyList.unshift(this.keyword);
				// 去重 借助Set集合特性
				const list = new Set(this.historyList);
				console.log(list);
				// 转数组并存储
				this.historyList = Array.from(list); //方式一
				// this.historyList = [...list]; //方式二
				// 本地存储
				uni.setStorageSync("keyword", JSON.stringify(this.historyList));
			},
			// #endif

			// #ifndef 跳转商品详情
			clickJumpDetail(id) {
				uni.navigateTo({
					url: `/subpkg/goods_detail/goods_detail?goods_id=${id}`
				})
			},
			// #endif

			// #ifndef 点击历史记录
			clickHistory(kw) {
				// console.log(kw); //@log
				this.keyword = kw;
				// 调用搜索结果 [X] 无需调用 有handleInput自动检测内容
				this.getSearchList();
			},
			// #endif

			// #ifndef 是否确认清除搜索历史[弹窗]
			isClear() {
				// 弹出弹窗
				this.$refs.popup.open();
			},
			// #endif

			// #ifndef 确认清除历史
			confirmClear() {
				// 调用清除历史
				this.clearHistory();
				this.$refs.popup.close();
			},
			// #endif

			// #ifndef 清除历史记录
			clearHistory() {
				this.historyList = [];
				uni.setStorageSync("keyword", JSON.stringify([]));
			},
			// #endif
		}
	}
</script>

<style lang="scss">
	// 搜索框
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
		background-color: #c00000;
	}

	// 搜索结果列表
	.search-list {
		padding: 0 10rpx;

		.search-item {
			display: flex;
			justify-content: space-between;
			// align-items: center;
			padding: 24rpx 0;
			font-size: 24rpx;
			border-bottom: 1px solid #efefef;
		}

		.search-name {
			// 超出省略号..表示
			text-overflow: ellipsis;
			// 一行显示
			white-space: nowrap;
			overflow: hidden;
		}
	}

	// 搜索历史
	.history-box {
		padding: 0 10rpx;
	}

	.history-title {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0;
		font-size: 26rpx;
		border-bottom: 1px solid #efefef;
	}

	.history-list {
		display: flex;
		flex-wrap: wrap;

		.uni-tag {
			margin-top: 10rpx;
			margin-right: 10rpx;
		}
	}
	
	// 无搜索内容
	.notext{
		padding: 20rpx 0;
		text-align: center;
		color: #ccc;
	}
</style>
