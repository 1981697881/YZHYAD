<template>
	<!-- 热映影片 -->
	<view class="group-goods pa20 mx20 mb10" v-if="goodsList.length">
		<view class="title-box x-bc" @tap="jump('/pages/cinema/list')">
			<text class="title">{{ detail.name }}</text>
			<view class="group-people x-f">
				<!-- <view class="head-box x-f"><image v-for="i in 3" class="head-img" src="" mode="" :key="i"></image></view> -->
				<text class="tip">全部</text>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="goods-box swiper-box x-f">
			<swiper class="carousel" circular @change="swiperChange" :autoplay="true" duration="2000">
				<swiper-item v-for="(goods, index) in goodsList" :key="index" class="carousel-item">
					<view class="goods-list-box x-f">
						<block v-for="mgoods in goods" :key="mgoods.filmId">
							<fz-film-list :detail="mgoods" class="goods-item"><!-- <block slot="titleText">立减￥8.5</block> --></fz-film-list>
						</block>
					</view>
				</swiper-item>
			</swiper>
			<view class="swiper-dots" v-if="goodsList.length > 1">
				<text :class="swiperCurrent === index ? 'dot-active' : 'dot'" v-for="(dot, index) in goodsList.length" :key="index"></text>
			</view>
		</view>
	</view>
</template>

<script>
import fzFilmList from './fz-film-list.vue';
import activity from '@/csJson/activity.json';
export default {
	name: 'shGroupon',
	components: {
		fzFilmList
	},
	data() {
		return {
			goodsList: [],
			swiperCurrent: 0
		};
	},
	props: {
		detail: {}
	},
	computed: {},
	created() {
		this.getGoodsList();
	},
	methods: {
		swiperChange(e) {
			this.swiperCurrent = e.detail.current;
		},
		// 数据分层
		sortData(oArr, length) {
			let arr = [];
			let minArr = [];
			oArr.forEach(c => {
				if (minArr.length === length) {
					minArr = [];
				}
				if (minArr.length === 0) {
					arr.push(minArr);
				}
				minArr.push(c);
			});

			return arr;
		},
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 获取热映影片
		getGoodsList() {
			let that = this;
			/* let res = activity
			let arr = that.sortData(res.data.goods.data, 4);
			that.goodsList = arr; */
			that.$api('cinema.lists', {}).then(res => {
				if (res.flag) {
					res.data.forEach((item,index)=>{
						item.type = 'Movie'
					})
					let resArray = []
					res.data.forEach((item,index)=>{
						if(index+1%4 === 0){
							resArray.push(item)
							that.goodsList.unshift(resArray);
							resArray = []
						}else{
							resArray.push(item)
							if(index+1 == res.data.length){
								that.goodsList.unshift(resArray);
							}
						}
					})
					console.log(that.goodsList)
					
				}
			});
		}
	}
};
</script>

<style lang="scss">
.swiper-box,
.carousel {
	width: 700rpx;
	height: 300upx;
	position: relative;
	border-radius: 20rpx;

	.carousel-item {
		width: 100%;
		height: 100%;
		// padding: 0 28upx;
		overflow: hidden;
	}

	.swiper-image {
		width: 100%;
		height: 100%;
		// border-radius: 10upx;
		background: #ccc;
	}
}

.swiper-dots {
	display: flex;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: 0rpx;
	z-index: 66;

	.dot {
		width: 45rpx;
		height: 3rpx;
		background: #eee;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.dot-active {
		width: 45rpx;
		height: 3rpx;
		background: #a8700d;
		border-radius: 50%;
		margin-right: 10rpx;
	}
}
// 今日必拼+限时抢购
.group-goods {
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	.title-box {
		padding-bottom: 20rpx;

		.title {
			font-size: 32rpx;
			font-weight: bold;
		}

		.group-people {
			.time-box {
				font-size: 26rpx;
				color: #edbf62;
				.count-text-box {
					width: 30rpx;
					height: 34rpx;
					background: #edbf62;
					text-align: center;
					line-height: 34rpx;
					font-size: 24rpx;
					border-radius: 6rpx;
					color: rgba(#fff, 0.9);
					margin: 0 8rpx;
				}
			}

			.head-box {
				.head-img {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					background: #ccc;
				}
			}

			.tip {
				font-size: 28rpx;
				padding-left: 30rpx;
				color: #666;
			}

			.cuIcon-right {
				font-size: 30rpx;
				line-height: 28rpx;
				color: #666;
			}
		}
	}

	.goods-box {
		.goods-item {
			margin-right: 22rpx;
			&:nth-child(4n) {
				margin-right: 0;
			}
		}
	}
}
</style>
