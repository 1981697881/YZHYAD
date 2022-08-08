<template>
	<view class="shop-list y-f" @tap="changeRelation">
		<!-- jump('/pages/user/equipment/detail', { id: scoreData.id, type: 'score' }) -->
		<view class="image-box">
			<image class="shop-img" src="https://cfzx.gzfzdev.com/movie/uploadFiles/image/zanwu.jpg" mode="aspectFill">
			</image>
		</view>
		<view class="shop-title more-t">设备：{{ scoreData.equipmentName }}</view>
		<view class="num-box x-bc">
			<view class="end-cash">设备单价:{{ scoreData.equipmentPrice }}</view>
			<view class="beans-box x-f">
				<image v-if="scoreData.status==0" class="bean-img" src="https://i.postimg.cc/KzHmxw6S/image.png"
					mode=""></image>
				<image v-else class="bean-img" src="https://i.postimg.cc/vmXQScXm/ic.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {};
		},
		computed: {},
		props: {
			scoreData: {}
		},
		methods: {
			changeRelation() {
				let that = this;
				uni.showActionSheet({
					/* '启动', '停用', */
					itemList: ['更新'],
					success: (res) => {
						switch (res.tapIndex) {
							case 0:
								//显示加载框
								uni.showLoading({
									title: '加载中'
								});
								that.$api('device.sendMessage', {
									code: '1001',
									equipmentCode: that.scoreData.equipmentCode,
								}).then(res => {
									if (res.code == 0) {
										if(res.data == null){
											that.$tools.toast('设备连接失败');
										}
										//隐藏加载框
										uni.hideLoading();
									}
								});
								return;
								/* case 1:
									return;
								case 2:
									return; */
						}
					}
				})
			},

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
	.shop-list {
		width: 345upx;
		margin-bottom: 20upx;
		background-color: #fff;

		// padding-bottom: 30rpx;
		.image-box {
			margin-bottom: 20upx;
			width: 345upx;
			height: 345upx;
			border-radius: 20rpx 20rpx 0 0;
			overflow: hidden;

			.shop-img {
				width: 100%;
				height: 100%;
				background: #ccc;
			}
		}

		.shop-title {
			font-size: 28upx;
			line-height: 36rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			line-height: 36upx;
			width: 300rpx;
			margin: 0 auto 20rpx;
			/*height: 72rpx; */
		}

		.num-box {
			width: 100%;
			padding: 0 20rpx;
			flex-wrap: wrap;
		}

		.beans-box {
			font-size: 32upx;
			font-family: SimHei;
			font-weight: bold;
			color: rgba(228, 141, 4, 1);
			margin-bottom: 10rpx;

			.bean-img {
				width: 36upx;
				height: 36upx;
				margin-right: 8upx;
			}
		}

		.end-cash {
			font-size: 22upx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			margin-bottom: 10rpx;
		}
	}
</style>
