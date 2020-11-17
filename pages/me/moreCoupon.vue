<style scoped>
	@import '../../common/css/me/coupon.css';
</style>
<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<navigator url="/pages/me/explain?type=3" class="head-right orange">说明</navigator>
		<view class="nav-tab">
			<text :class="[userType=='indi'?'active':'']" @click="btnNavTab('indi')">个人</text>
			<text :class="[userType=='comp'?'active':'']" @click="btnNavTab('comp')">企业</text>
		</view>
		<view class="tab-con">
			<view v-if="couponData.length == 0  " class="none-data-list">
				<image src="../../static/images/none.svg"></image>暂无内容
			</view>
			<view v-else v-for="(item, index) in couponData" :key="index" class="coupon-list" :class="[item.isget=='1'&&item.status=='2'?'none':'']">
				<view class="amount">
					<view v-if="item.couponType==2">
						¥
						<text>{{item.amount}}</text></view>
					<view v-if="item.couponType==1">

						<text>{{item.amount}}</text>折</view>
					优惠券
				</view>
				<view class="info">
					<text class="order-num">{{item.status=='2' || item.status=='3'?item.orderNumDetail:''}}</text>
					<text>{{item.fullReducAmount}}</text>
					<text>{{item.validity}}</text>
				</view>
				<text class="btn" v-if="(item.status=='2' && item.isget.indexOf('_')<0)|| ( item.isget=='0'&& item.status=='3') || (item.isget=='0'&& item.status=='1') || (item.isget=='0'&& item.status=='4')"
				 @click="postCoupon(item.id,item.isget)">立即领取</text>
				<!-- #ifdef H5 -->
				<text class="btn share" v-if="item.status=='3'&& item.isget=='1'" @click="sharePost(item.id,item.amount)">分享助力</text>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<button class="btn share" v-if="item.status=='3'&& item.isget=='1'" v-bind:id="index" open-type="share">分享助力</button>
				<!-- #endif -->
				<text class="iconfont icon-yl" v-if="item.isget.indexOf('_')>-1"></text>
			</view>
		</view>
		<view class="my_conpou">
			<span class="iconfont yjt" @click="MyCoupn(userType)">{{coupon}}优惠券</span>
		</view>
		<view v-if="showSend" @click="showSend=false">
			<view class="v-model"></view>
			<view class="share-popup">
				<image src="../../static/images/share.png" alt="请点击右上角的分享按钮分享"></image>
			</view>
		</view>

	</view>
</template>
<script>
	export default {
		data() {
			return {
				userType: 'indi',
				showSend: false,
				couponData: [],
				coupon: "我的",
				isShowQY: false,
				isShareWX: true
			}
		},
		onLoad() {
			let app = getApp();
			app.isToken();
			this.showImage = app.globalData.isDiscountPopup;
		},
		onShow() {
			let that = this;
			if (!this.isShareWX) {
				this.isShareWX = true;
				return false;
			}
			that.getCoupon();
			that.IsRegister();
		},
		//小程序分享
		onShareAppMessage(res) {
			if (res.from == "button") {
				this.isShareWX = false;
				let that = this;
				let item = that.couponData[res.target.id];
				let _id = item.id;
				let _amount = item.amount;
				return {
					title: "我在领" + _amount + "元物流大额券点击助力一下呗", //分享内容的标题
					path: "/pages/me/shareImage?id=" + _id + "&type=" + that.userType, //跳转链接
					desc: "助力成功您将获得一份尊享礼包", //分享描述
					imageUrl: "../../static/images/coupon" + _amount + ".png" //图片地址
				}
			}
		},
		methods: {
			//立即领取
			postCoupon: function(id, isget) {
				if (isget == "1") return false;
				const that = this;
				that.$util.networkRequest({
					url: "/Coupon/PostVoucherCoupon",
					method: "POST",
					data: {
						userType: that.userType,
						couponId: id
					},
					success: res => {
						if (res !== "") {
							that.$util.showToast("领取成功");
							that.couponData.forEach(item => {
								if (item.id == id) {
									item.isget = "_"
								}
							});
							that.getCoupon();
						}

					}
				});
			},
			MyCoupn(coupon) {
				console.log(coupon);
				if (coupon == "comp" && this.isShowQY == false) {
					this.$util.showToast("尚未加入企业");
					return false;
				} else {
					uni.navigateTo({
						url: "/pages/me/coupon?type=" + coupon
					})
				}

			},
			IsRegister() {
				//是否有企业
				const that = this;
				that.$util.networkRequest({
					url: "/Company/IsRegister",
					method: "GET",
					data: {},
					success: res => {
						if (!res) {
							that.isShowQY = false;
						} else {
							that.isShowQY = true;
						}

					}
				});
			},
			//H5分享
			sharePost: function(_id, _amount) {
				this.showSend = true;
				this.$util.wxshare({
					title: "我在领" + _amount + "元物流大额券点击助力一下呗", // 分享标题
					desc: "助力成功您将获得一份尊享礼包", // 分享描述
					link: "http://" + window.location.host + "/pages/me/shareImage?id=" + _id + "&type=" + this.userType, // 分享链接
					imgUrl: "http://" + window.location.host + "/static/images/coupon" + _amount + ".png" //图片地址
				})
			},
			btnNavTab: function(key) {
				const that = this;
				if(that.userType == key) return false;
				this.getCoupon(key, function(){
					that.coupon = key == "comp" ? '企业' : '我的';
					that.userType = key;
				});
			},
			getCoupon: function(_type, callback) {
				const that = this;
				let type = _type == undefined?that.userType:_type;
				uni.showLoading({
					title: '加载中...'
				});
				that.$util.networkRequest({
					url: "/Coupon/GetList",
					data: {
						userType: type
					},
					success: res => {
						if (res == null) return false;
						that.couponData = res.list;
						if(callback) callback();
					},
					complete: res => {
						// console.log(res);
						if (!res.data) {
							that.couponData = [];
						}
					}
				});
			},
		}
	}
</script>
