<template>
	<view class="page_box">
		<!-- 空白页 -->
		<app-empty v-if="!hasTemplate" :emptyData="emptyData"></app-empty>
		<view v-else class="page_box app-selector">
			<!-- 导航栏 -->
			<view class="head_box active" :style="{ background: bgcolor }">
				<cu-custom :isBack="true" v-if="info && info.name">
					<block slot="content">
						<text class="nav-title app-selector-rect text-black">{{ info.name || '主页' }}</text>
					</block>
				</cu-custom>
			</view>
			<view class="content_box" style="margin-top: -4rpx;overflow: hidden;">
				<scroll-view class="scroll-box" scroll-y scroll-with-animation enable-back-to-top>
					<block v-if="template" v-for="(item, index) in template" :key="index">
						<!-- 轮播 -->
						<!-- <video controls :poster="videoImg" object-fit="fill" class="swiper-image app-selector-rect" src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4"></video> -->
						<sh-banner v-if="item.type === 'banner'" :detail="item.content"></sh-banner>
						<!-- 二级广告 -->
						<sh-spread v-if="item.type === 'spread'" :detail="item.content"></sh-spread>
						<!-- 推荐商品 -->
						<sh-hot-goods v-if="item.type === 'goods-list' || item.type === 'goods-group'" :detail="item.content"></sh-hot-goods>
						<!-- 功能标题 -->
						<sh-title-card v-if="item.type === 'title-block'" :detail="item.content"></sh-title-card>
					</block>
				</scroll-view>
			</view>
			<view class="foot_box"></view>
			<!-- 骨架屏 -->
			<app-skeleton :showSkeleton="!template"></app-skeleton>
			<!-- 登录提示 -->
			<app-login-modal></app-login-modal>
			<!-- 自定义底部导航 -->
			<!-- <app-tabbar></app-tabbar> -->
			<!-- 关注弹窗 -->
			<app-float-btn></app-float-btn>
			<!-- 连续弹窗提醒 -->
			<app-notice-modal v-if="!showPrivacy && showNoticeModal"></app-notice-modal>
			<!-- 隐私协议 -->
			<!-- #ifdef APP-PLUS -->
			<view class="modal-wrap">
				<app-modal v-model="showPrivacy">
					<block slot="modalContent">
						<view class="service-contract-wrap">
							<image class="service-head-img" src="/static/imgs/modal/servece_head.png" mode="widthFix"></image>
							<view class="service-title">用户隐私协议概况</view>
							<view class="service-content ">
								感谢您使用，我们非常重视您的个人信息和隐私保护，在您使用服务前，请仔细阅读
								<text style="color: #EAB866;" @tap="jump('/pages/public/richtext', { id: 2 })">《隐私协议》</text>
								，我们将会严格按照经您同意的各项条款使用您的个人信息，以便为您提供更好的服务。
							</view>
							<view class="service-tip ">如您同意此条款，请点击“同意”并开始使用我们的产品和服务，我们将尽全力保护您的个人信息安全。</view>
							<view class="btn-box x-c"><button class="cu-btn agree-btn" @tap="Agree">知道了</button></view>
						</view>
					</block>
				</app-modal>
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>
<script>
import shBanner from './components/sh-banner.vue';
import shSpread from './components/sh-spread.vue';
import shNav from './components/sh-nav.vue';
import shHotGoods from './components/sh-hot-goods.vue';
import shTitleCard from './components/sh-title-card.vue';
import appNoticeModal from '@/components/app-notice-modal/app-notice-modal.vue';
import appSkeletons from '@/components/app-skeletons/app-skeletons.vue';
// #ifdef MP-WEIXIN
import { HAS_LIVE } from '@/env';
import shLive from './components/sh-live.vue';
// #endif
import { mapMutations, mapActions, mapState } from 'vuex';
// #ifdef H5
import html2canvas from '@/common/utils/sdk/html2canvas.js';
let listenMove = document.body; //禁止手机h5下拉刷新带动整个页面。
let handle = function(e) {
	e.preventDefault();
};
// #endif

export default {
	components: {
		shBanner,
		shSpread,
		shHotGoods,
		shNav,
		shTitleCard,
		appNoticeModal,
		appSkeletons,
		// #ifdef MP-WEIXIN
		shLive
		// #endif
	},
	data() {
		return {
			videoImg: 'http://139.159.136.187:50080/uploadFiles/image/d02494f7a0c24790f2d10b4d5fc4b613.jpg',
			bgcolor: 'white',
			// #ifdef MP-WEIXIN
			HAS_LIVE: HAS_LIVE,
			// #endif
			mode: '',
			showPrivacy: false,
			showNoticeModal: false,
			triggered: false, //下拉刷新
			_freshing: false, //下拉刷新状态
			emptyData: {
				img: '/static/imgs/empty/template_empty.png',
				tip: '暂未找到模板，赶快去装修吧~'
			}
		};
	},
	computed: {
		...mapState({
			initData: state => state.init.initData,
			city: state => state.init.city,
			template: state => state.init.templateData?.home,
			hasTemplate: state => state.init.hasTemplate,
			/* cartNum: state => state.cart.cartNum, */
			forceOauth: state => state.user.forceOauth
		}),
		popupIndex() {
			if (this.initData.popup) {
				return this.initData.popup.content.index;
			}
		},
		info() {
			if (this.initData.info) {
				return this.initData.info;
			}
		}
	},
	onPullDownRefresh() {
		this.init();
	},
	onLoad(options) {
		// #ifdef APP-VUE
		console.log('是否同意隐私协议', plus.runtime.isAgreePrivacy());
		if (!plus.runtime.isAgreePrivacy()) {
			this.showPrivacy = true;
			this.showNoticeModal = false;
		}
		// #endif
		/* this.getUserBalance() */
	},
	mounted() {
		console.log(this.template)
		
	},
	onShow() {
		/* this.$store.commit('CART_NUM', this.cartNum); */
		// #ifndef MP-WEIXIN
		/* if (this.info && this.info.name) {
			uni.setNavigationBarTitle({
				title: this.info.name
			});
		} */
		// #endif
		
	},
	methods: {
		/* ...mapMutations(['CART_NUM']), */
		...mapActions(['getAppInit', 'getTemplate', 'getUserBalance']),
		// 初始化
		init() {
			return Promise.all([this.getAppInit(), this.getTemplate(), this.getUserBalance()]).then(() => {
				uni.stopPullDownRefresh();
			});
		},
		// 获取轮播背景色
		getbgcolor(e) {
			this.bgcolor = e;
		},
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// #ifdef APP-PLUS
		// 同意协议
		Agree() {
			plus.runtime.agreePrivacy();
			this.showPrivacy = false;
		},
		// #endif
	}
};
</script>

<style lang="scss">
// 标题搜索栏
.active {
	// 动画时间跟随轮播组件动画时间
	transition: all linear 0.5s;
}
// 服务协议
.modal-wrap {
	/deep/ .cu-modal {
		z-index: 99999;
	}
}
.service-contract-wrap {
	background-color: #fff;
	position: relative;
	left: 50%;
	transform: translateX(-50%);
	width: 610rpx;
	min-height: 850rpx;
	border-radius: 20rpx;
	.service-title {
		font-size: 35rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(255, 255, 255, 1);
		line-height: 42rpx;
		background: linear-gradient(180deg, rgba(62, 48, 25, 1) 0%, rgba(109, 80, 40, 1) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-bottom: 30rpx;
	}
	.service-content {
		text-align: left;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 50rpx;
		padding: 0 40rpx;
	}
	.service-tip {
		text-align: left;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(154, 154, 154, 1);
		line-height: 50rpx;
		padding: 0 40rpx;
	}
	.btn-box {
		padding: 40rpx;
		.cancel-btn {
			width: 248rpx;
			height: 70rpx;
			border: 1rpx solid rgba(234, 182, 99, 1);
			border-radius: 35rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(234, 182, 99, 1);
			background-color: #fff;
		}
		.agree-btn {
			width: 300rpx;
			height: 70rpx;
			background: linear-gradient(90deg, rgba(233, 181, 97, 1), rgba(238, 204, 138, 1));
			border-radius: 35rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
		}
	}
	.ic-hide {
		position: absolute;
		font-size: 50rpx;
		bottom: -100rpx;
		z-index: 11;
		color: #fff;
		left: 50%;
		transform: translateX(-50%);
	}
}

.head_box {
	width: 750rpx;
	// background: #fff;
	transition: all linear 0.3s;
	/deep/.cuIcon-back {
		display: none;
	}
	.nav-title {
		font-size: 38rpx;
		font-family: PingFang SC;
		font-weight: 500;
	}
}
</style>
