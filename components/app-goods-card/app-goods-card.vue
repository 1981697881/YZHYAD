<template>
	<view class="goods-box" v-if="detail" @tap="jump('/pages/goods/detail/index', { id: detail.id })">
		<view class="img-box">
			<!-- <image v-if="isTag && detail.activity" class="tag-img" :src="tagPath[detail.activity.type]" mode=""></image> -->
			<image class="img" src="https://cfzx.gzfzdev.com/movie/uploadFiles/image/zanwu.jpg" lazy-load mode="scaleToFill"></image>
		</view>
		<view class="tip one-t">{{ detail.subtitle }}</view>
		<!-- <view class="title more-t">{{ detail.title }}</view> -->
		<view class="price-box">
			<view class="flex x-bc align-end">
				<view class="current">{{ detail.price }}</view>
				<view class="sales miso-font">{{ detail.sales }}人 已购买</view>
			</view>
			<view class="x-f tag-box">
				<!-- <view class="discount">新人礼</view>
				<view class="discount">满100减60</view> -->
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'appGoodsCard',
	components: {},
	data() {
		return {
			tagPath: {
				groupon: '/static/imgs/groupon_tag.png',
				seckill: '/static/imgs/seckill_tag.png'
			}
		};
	},
	props: {
		isTag: {
			type: [Boolean, String],
			default: false
		},
		detail: {
			type: Object,
			default: null
		}
	},
	computed: {},
	methods: {
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		}
	}
};
</script>

<style lang="scss">
.goods-box {
	width: 345rpx;
	background: #fff;
	padding-bottom: 10rpx;
	border-radius: 20rpx;
	overflow: hidden;
	.img-box {
		width: 345rpx;
		height: 350rpx;
		overflow: hidden;
		position: relative;
		.tag-img {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 2;
			width: 80rpx;
			height: 40rpx;
		}

		.img {
			width: 345rpx;
			height: 450rpx;
			background-color: #ccc;
		}
	}

	.tip {
		width: 346rpx;
		line-height: 56rpx;
		background: rgba(246, 242, 234, 1);
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(168, 112, 13, 1);
		padding: 0 20rpx;
	}

	.title {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 36rpx;
		height: 72rpx;
		margin: 20rpx 20rpx 10rpx;
	}

	.price-box {
		padding: 20rpx 20rpx 0;
		width: 344rpx;
		.sales {
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			line-height: 20rpx;
			margin-bottom: 20rpx;
		}
		.current {
			font-size: 30rpx;
			font-weight: 500;
			color: rgba(225, 33, 43, 1);
			line-height: 30rpx;
			margin-bottom: 20rpx;
			&:before {
				content: '￥';
				font-size: 26rpx;
			}
		}

		.original {
			font-size: 22rpx;
			font-weight: 400;
			text-decoration: line-through;
			color: rgba(153, 153, 153, 1);
			margin-left: 14rpx;
			line-height: 22rpx;
			margin-bottom: 10rpx;
			&:before {
				content: '￥';
				font-size: 20rpx;
			}
		}

		.tag-box {
			.discount {
				line-height: 28rpx;
				border: 1rpx solid rgba(225, 33, 43, 1);
				border-radius: 8rpx;
				font-size: 18rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(225, 33, 43, 1);
				padding: 0 8rpx;
				margin-right: 10rpx;
			}
		}
	}
}
</style>
