<template>
	<view class="page_box">
		<view class="head_box">
			<view class="box-head bg-white flex flex-wrap justify-between align-center">
				<view class="padding-sm">当前设备: <text class="text-orange">{{equipmentObj.equipmentName || '无'}}</text>
				</view>
				<view class="padding-sm text-gray">
					<button class="cu-btn round block line-orange" @tap="getMachine">
						<text class="cuIcon-scan padding-right"></text> {{ equipmentObj.equipmentName?'切换机台':'扫描机台'}}</button>
				</view>
			</view>
		</view>
		<view class="content_box">
			<scroll-view :style="{ height: hHeight + 'px' }" class="scroll-box bg-white" scroll-y enable-back-to-top
				scroll-with-animation @scrolltolower="loadMore">
				<view class="content-box">
					<!--<view class="goods-list x-f">
						 <view class="goods-item" v-for="(goods, index) in goodsList" :key="index" @tap="
								jump('/pages/order/payment/chargeMoney', {
									goodsDescribe: goods.goodsDescribe,
									coinCount: goods.coinCount,
									goodsName: goods.goodsName,
									goodsPrice: goods.goodsPrice,
									goodsId: goods.goodsId,
									integral: goods.integral
								})
							">
							<fz-circuit-meal :detail="goods" :colorItem="colorList[index].name" :tabId="tabId"
								:isTag="true"></fz-circuit-meal>
						</view>
					</view> -->
					<view class="box-header text-black">
						<view class="padding-left box-title">
							游戏币: {{ userInfo.integral || 0}}
						</view>
						<view class="box-price text-bold text-xl">
							{{equipmentObj.equipmentPrice || '?'}} 币 / 次
						</view>
					</view>
					<view class="box-handler padding-top">
						<view class="handler-content">
							<uni-number-box :min="1" @change="changeVal" :max="userInfo.integral/equipmentObj.equipmentPrice"></uni-number-box>
						</view>
					</view>
					<view class="box-select text-center">
						<view class="select-content text-white text-sm" @tap="showSku = true">
							选择局数
						</view>
					</view>
					<app-sku v-model="showSku" :userPrice="gameCurrency" @changeType="changeType"
						@getSkuText="getSkuText"></app-sku>
					<view class="box-btn padding-top"> 
						<button style="width: 50%;" @tap="confirm" class="cu-btn round lg block bg-yellow text-white">
							<text class="cuIcon-cardboard padding-right" ></text>开始游戏</button>
					</view>
					<!-- 加载更多 -->
					<view v-if="goodsList.length" class="cu-load text-gray" :class="loadStatus"></view>
					<!-- load -->
					<app-load v-model="isLoading"></app-load>
				</view>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
		<!-- 自定义底部导航 -->
		<!-- <app-tabbar></app-tabbar> -->
		<!-- 关注弹窗 -->
		<app-float-btn></app-float-btn>
		<!-- 连续弹窗提醒 -->
		<app-notice-modal></app-notice-modal>
		<!-- 登录提示 -->
		<app-login-modal></app-login-modal>
	</view>
</template>

<script>
	import moreGoodList from '@/csJson/moreGoodList.json';
	import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
	import fzCircuitMeal from '@/components/fz-circuit-card/fz-circuit-meal.vue';
	import appSku from '@/components/app-price-sku/app-price-sku.vue';
	import AppPay from '@/common/app-pay';
	import {
		mapMutations,
		mapActions,
		mapState
	} from 'vuex';
	export default {
		components: {
			fzCircuitMeal,
			appSku,
			uniNumberBox
		},
		data() {
			return {
				hHeight: '0',
				listParams: {
					keywords: '',
					page: 1
				},
				equipmentObj: {
					
				},
				showSku: false,
				machine: '',
				num: '1',
				integralNum: 0,
				payType: 'wechat',
				colorList: this.ColorList,
				isLoading: false, //loading和空白页。
				loadStatus: '', //loading,over
				lastPage: 1,
				goodsList: []
			};
		},
		props: {
			tabId: ''
		},
		mounted() {
			this.getScrHeight();
			/* this.init(); */
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		created() {},
		methods: {
			...mapActions(['getUserDetails']),
			init() {
				this.getGoodsList();
				this.getUserDetails()
			},
			changeVal(val){
				this.integralNum = val
				console.log(val)
			},
			// 组件返回的type;
			changeType(e) {
				this.buyType = e;
			},
			// 组件返回的规格;
			getSkuText(e) {
				this.currentSkuText = e;
			},
			confirm() {
				this.$u.debounce(this.startGame);
			},
			startGame() {
				let that = this;
				if(JSON.stringify(that.equipmentObj)=="{}"){
					return that.$tools.toast('请扫描机器上的二维码');
				}
				
				if(that.userInfo.integral == 0 || (that.userInfo.integral/that.equipmentObj.equipmentPrice == 0)){
					that.$tools.toast('余额不足');
				}else{
					if(that.integralNum == 0){
						that.$tools.toast('请选择局数');
					}else{
						that.$api('device.sendMessage', {
							code: 1000,
							coins: that.integralNum,
							pulseWidth: 10,
							interval: 10,
							lowLevel: 0,
							equipmentCode: that.equipmentObj.macId
						}).then(res => {
							if (res.flag) {
								if(res.data == null){
									that.$tools.toast('设备不存在或离线');
								}else{
									that.equipmentObj = res.data
									that.isLoading = false;
								}
							}
						});
					}
				}
			},
			getMachine() {
				let that = this;
				that.isLoading = true;
				uni.scanCode({
					success: function(res) {
						that.machine = res.result;
						that.$api('device.checkEquipment', {
							equipmentCode: res.result
						}).then(reso => {
							if (reso.flag) {
								if(reso.data == null){
									that.$tools.toast('设备不存在或离线');
								}else{
									that.equipmentObj = reso.data
									that.isLoading = false;
								}
							}
						});
					}
				});
			},
			// 加载更多
			loadMore() {
				if (this.listParams.page < this.lastPage) {
					this.listParams.page += 1;
					this.getGoodsList();
				}
			},
			getScrHeight() {
				let me = this;
				uni.getSystemInfo({
					success: function(res) {
						// res - 各种参数
						let info = uni.createSelectorQuery().select('.head_box');
						info.boundingClientRect(function(data) {
							//data - 各种参数
							me.hHeight = res.windowHeight - data.height;
						}).exec();
					}
				});
			},
			// 商品列表
			getGoodsList() {
				let me = this;
				let that = this;
				that.isLoading = true;
				that.loadStatus = 'loading';
				that.$api('goods.commodityList', {
					goodsType: 1
				}).then(res => {
					if (res.flag) {
						that.isLoading = false;
						that.goodsList = [...res.data];
						that.lastPage = res.data.last_page;
						if (that.listParams.page < res.data.last_page) {
							that.loadStatus = '';
						} else {
							that.loadStatus = 'over';
						}
					}
				});
			},

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
	// 宫格
	.sh-grid-box {
		background: #fff;
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 30rpx;

		.tool-item {
			width: (750rpx/3);

			.tool-img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				// background: #ccc;
			}

			.item-title {
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				line-height: 24rpx;
				padding-top: 10rpx;
			}
		}
	}

	.card-swiper {
		height: 350upx !important;
	}

	.card-swiper uni-swiper-item {
		padding: 5px 0 15px !important;
	}

	.content-box {
		margin: 50rpx;
		width: auto;
		overflow: hidden;
		height: 600rpx;
		position: relative;
		border-radius: 15rpx;
		box-shadow: 0px 0px 1px 1px #CCCCCC;
		/* 对于不支持渐变的浏览器*/
		background-image: linear-gradient(#D2691E, #D2691E, #8B4513);
		/* 标准语法(必须是最后一个) */
	}

	.box-header {
		overflow: hidden;
		background-color: white;
		border-radius: 20rpx;
		width: auto;
		height: 200rpx;
		margin: 15rpx;

		.box-title {
			background-color: #FFDAB9;
			height: 80rpx;
			line-height: 80rpx;
		}

		.box-price {
			line-height: 100rpx;
			width: auto;
			text-align: center;
		}
	}

	.box-select {
		position: absolute;
		top: 385rpx;
		z-index: 99;
		width: 100%;

		.select-content {
			background-color: #483D8B;
			box-shadow: 0px 0px 1rpx 1rpx #6495ED;
			height: 45rpx;
			line-height: 45rpx;
			border-radius: 10rpx;
			display: inline-block;
			width: 220rpx;
		}
	}

	.box-handler {
		width: 100%;
		text-align: center;

		.handler-content {
			width: auto;
			padding: 25rpx 25rpx 70rpx 25rpx;
			background-color: #800000;
			box-shadow: 0px 0px 1px 1px #F08080;
			border-radius: 15rpx;
			display: inline-block;
			text-align: center;
		}
	}

	.box-btn {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.box-head {
		border-bottom: 1px solid #e8eacf;
	}

	.goods-list {
		flex-wrap: wrap;

		.goods-item {
			width: 100%;
		}
	}

	.cir_group {
		width: 100%;
		height: 100%;
		background-color: red;
		/* 对于不支持渐变的浏览器*/
		background-image: linear-gradient(#2b4055, #5c92c1, #2b4055);
		/* 标准语法(必须是最后一个) */
		display: flex;

		.cir_logo {
			display: inline-flex;
			width: 40%;
			padding: 20rpx;

			image {
				border-radius: 15rpx;
				width: 100%;
			}

			.tag {
				position: absolute;
				left: 10rpx;
				top: 40rpx;
				z-index: 2;
				line-height: 30rpx;
				background: linear-gradient(132deg, rgba(28, 28, 28, 1), rgba(54, 54, 54, 1), rgba(236, 190, 96, 1));
				border-radius: 0px 18rpx 18rpx 0px;
				padding: 0 10rpx;
				-webkit-transform: scale(0.8);
				font-family: PingFang SC;
				color: white;
			}
		}

		.cir_detail {
			width: 60%;
			padding: 20rpx;
			padding-left: 0;
			font-family: PingFang SC;
			display: inline-block;

			.de_name {
				width: 100%;
				font-size: 40rpx;
				line-height: 60rpx;
			}

			.de_pin {
				line-height: 40rpx;
				width: 100%;
			}

			.de_info {
				line-height: 40rpx;
				width: 100%;
			}
		}
	}

	.tower-swiper .tower-item {
		transform: scale(calc(0.5 + var(--index) / 10));
		margin-left: calc(var(--left) * 100upx - 150upx);
		z-index: var(--index);
	}
</style>
