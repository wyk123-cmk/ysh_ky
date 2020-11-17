<template>
	<view>
		<page-imges :show="showImage"></page-imges>
		<view class="logo">
			<image mode="widthFix" src="../../static/images/logo-img.png"></image>
			<text>仪商汇快运</text>
			<view class="news" @click="goPage('news/newList')">
				<text class="iconfont icon-xiaoxicopy"></text>
				<text class="num" v-if="newTotal != 0">{{newTotal}}</text>
			</view>
		</view>
		<swiper class="swiper" :circular="true" :indicator-dots="false" :autoplay="true" :interval="2300">
			<swiper-item v-for="(item, i) in dataInfo.slides" :key="i" @click="ImgRous(item.link)">
				<video v-if="item.isMp4" style="width: 100%; height:198px;" :src="item.image" :show-fullscreen-btn="true"
				 :enable-danmu="false" :danmu-btn="false"></video>
				<image v-else mode="widthFix" :src="item.image" style="width:100%;height:198px;"></image>
			</swiper-item>
		</swiper>
		<view class="notice-box" @click="goPage('index/noticeList')">
			<text class="small-title">公告</text>
			<swiper class="notice-swiper" :indicator-dots="false" :autoplay="true" :interval="2300" :vertical="true" :circular="true">
				<swiper-item v-for="(n, k) in dataInfo.notice" :key="k">
					<view class="notice-item">
						<text class="info">{{n}}</text>
						<text class="iconfont icon--right-jian"></text>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="menu-con">
			<view class="item-list" @click="goPage('index/expressDelivery?type=big')">
				<image mode="widthFix" src="../../static/images/jj1.png"></image>
				<view>寄大件<text>仪器仪表整机设备</text></view>
			</view>
			<view class="item-list" @click="goPage('index/expressDelivery?type=small')">
				<image mode="widthFix" src="../../static/images/jj2.png"></image>
				<view>
					寄快递
					<image mode="aspectFit" class="discount" src="../../static/images/9zhe.svg"></image>
					<text>一小时取件</text>
				</view>
			</view>
			<view class="item-list" @click="goPage('batchSend/index')">
				<image mode="widthFix" src="../../static/images/jj3.png"></image>
				<view>批量寄<text>方便快捷</text></view>
			</view>
			<view class="item-list" @click="goPage('vehicleMail/index')">
				<image mode="widthFix" src="../../static/images/jj6.png"></image>
				<view>整车寄件<text>快捷安全高效</text></view>
			</view>
			<view class="item-list" @click="goPage(2)">
				<image mode="widthFix" src="../../static/images/jj5.png"></image>
				<view>电子面单<text>自助打印面单</text></view>
			</view>
			<view class="item-list" @click="goPage('welfare/index')">
				<image mode="widthFix" src="../../static/images/jj7.png"></image>
				<!-- <view>快运福利<text>超多福利等你来</text></view> -->
				<view>
					<image mode="widthFix" style="width: 60px;" src="../../static/images/fuli.png"></image><text>超多福利等你来</text>
				</view>
			</view>
			<view class="item-list" @click="goPage('me/moreCoupon')">
				<image mode="widthFix" src="../../static/images/jj4.png"></image>
				<view>领券中心<text :style="isCoupon?'color:red':'color:#999'">{{isCoupon?"您有未领取的优惠券":"领取更多优惠券"}}</text></view>
			</view>
			<view style="clear: both;"></view>
		</view>
		<view v-show="isShowZkq">
			<view class="v-model-zkq" style="opacity: 0.7;" @click="isShowZkq=false">
				<view class="bar-code">
					<image src="../../static/images/zkq.png" mode="widthFix" style="width: 40px;"></image>
					<text>领取成功</text>
				</view>

			</view>

		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				isShowZkq: false,
				isCoupon: false,
				dataInfo: [],
				showImage: false,
				types: "",
				newTotal: 0,
				pid: "",
				couponlist:[]
			}
		},
		onLoad(options) {
			uni.removeStorageSync("errormsg");
			//点击电子面单跳转pc端电子面单，从pc端再次返回的参数type=pc_md;
			this.types = options.types;
			if (this.types == "tz") {
				console.log("从躺赚过来");
				this.getCoupon()

				// this.$util.showToast('领取成功')
			}
			// #ifdef MP-WEIXIN
			if (this.pid != undefined) {
				this.pid = options.pid;
				this.browseHistory();
			}
			// #endif
		},
		onShow() {
			let app = getApp();
			app.isToken('首页');
			this.showImage = app.globalData.isDiscountPopup;
			this.isNewCoupon();
			this.getInfo();
			//清空寄快递信息
			uni.removeStorageSync('insuredPrice');
			this.$store.state.expressDeliveryInfo = {
				type: "",
				companyCode: "",
				sendAddress: {},
				expectTime: "",
				repAddress: {},
				goodInfo: {},
				insuredPrice: {},
				service: {},
				takeBill: {},
				carType: {}
			}
			this.$store.state.batchOrderInfo = {
				list: [],
				companyCode: "",
				sendAddress: {}
			}
		},
		methods: {
			isNewCoupon() {
				const that = this;
				that.$util.networkRequest({
					url: "/Coupon/IsNewCoupon",
					method: "POST",
					success: res => {
						that.isCoupon = res;
					}
				})
			},
			getCoupon: function() {
				const that = this;
				that.$util.networkRequest({
					url: "/Coupon/GetList",
					data: {
						userType: 'indi'
					},
					success: res => {
						if (res == null) {
							that.$util.showToast('暂无可领取的优惠券')
							return false;
						}
						that.couponlist = res.list;
						console.log(res);
						var list = res.list;
						var lyList = [];
						for (var i = 0; i < list.length; i++) {
							var item = list[i];
							if(item.isget=="0"){

							that.postCoupon(item.id, item.isget, i)
							}
							if(item.isget=="" || item.isget==null || item.isget.indexOf('_')>-1){
								lyList.push(item);
							}
						}
						if (lyList.length == list.length) {
							that.$util.showToast('您已领取过优惠券')
						}
					}

				});
			},
			postCoupon: function(id, isget, i) {
				if (isget == "1") return false;
				const that = this;
				that.$util.networkRequest({
					url: "/Coupon/PostVoucherCoupon",
					method: "POST",
					data: {
						userType: "indi",
						couponId: id
					},
					success: res => {
						if (res !== "" && i == (that.couponlist.length - 1)) {
							that.isShowZkq = true;
							setTimeout(function() {
								that.isShowZkq = false;
							}, 3000)

						}

					}
				});
			},
			getInfo() {
				const that = this;
				that.$util.networkRequest({
					url: "/SysInfo/GetNoticeAndSlideShow",
					success: res => {
						res.slides.filter(item => {
							if (item.image != null && item.image != "") {
								item.image = item.image.replace(/\s*/g, "");
								if (item.image.indexOf('http') == -1) {
									item.image = that.apiHost + item.image;
								}
							}
						});
						that.dataInfo = res;
					}
				});
				that.$util.networkRequest({
					url: "/SysInfo/GetNoReadMessageCount",
					success: function(res) {
						that.newTotal = res;
					}
				})
			},
			ImgRous(url) {
				let currentHref = this.apiHost + '/pages';
				if (url.indexOf(currentHref) != -1) {
					let src = url.replace(this.apiHost, '');
					uni.navigateTo({ url: src });
					return false;
				}
				if(url.indexOf("http") == -1){
					uni.navigateTo({ url: url });
					return false;
				}
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: "/pages/web-view/index?url=" + url
				});
				// #endif
				// #ifdef H5
				window.location.href = url;
				// #endif
			},
			goPage(_url) {
				if (uni.getStorageSync("token") == "" || uni.getStorageSync("token") == undefined) {
					let userSource = "";
					if (this.pid != "") userSource = "?userSource=" + this.pid;
					uni.navigateTo({
						url: "/pages/logs/logs" + userSource
					});
				} else {
					if (_url == 2) {
						//打印面单
						if (this.$util.IsPC() == true) {
							window.location.href = "/page/pc-md"
							return false;
						} else {
							uni.showModal({
								title: '提示',
								content: '打印面单功能，手机端暂时无法使用，请登录电脑后访问http://express.1718china.cn使用',
								showCancel: false,
							});
						}
					}
					uni.navigateTo({
						url: '/pages/' + _url
					})
				}
			},
			//用户浏览记录接口（分析用户来源，活动营销效果）
			browseHistory: function(pid) {
				const that = this;
				wx.getSystemInfo({
					success(res) {
						var pages = getCurrentPages();
						let param = {
							"pid": that.pid, //来源
							"path": (pages[pages.length - 1]).route, //浏览页面 
							"brand": res.brand, //设备品牌
							"model": res.model, //设备型号
							"version": res.version, //微信版本号
							"system": res.system, //操作系统及版本
							"platform": res.platform //客户端平台
						}
						that.$util.networkRequest({
							url: "/SysInfo/BrowseHistory",
							method: "POST",
							data: param,
							success: res => {}
						})
					}
				})
			},
		}
	}
</script>
<style scoped>
	.bar-code {
		position: absolute;
		top: 20%;
		left: 10px;
		right: 10px;
		/* padding: 40px 0; */
		/* background-color: #FFFFFF; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 5px;
		z-index: 1001;
	}

	.bar-code text {
		color: #FFFFFF;
		font-size: 16px;
		padding-top: 10px;
	}

	.logo {
		display: flex;
		align-items: center;
		padding: 10px 15px 15px;
		font-size: 22px;
		font-weight: bold;
		color: #4285F4;
		position: relative;
	}

	.v-model-zkq {
		position: fixed;
		left: 10%;
		top: 39%;
		bottom: 0;
		opacity: 0.7;
		background: #000;
		z-index: 999;
		width: 80%;
		height: 130px;
		border-radius: 8px;
	}

	.logo image {
		width: 50px;
		height: 50px;
		margin-right: 10px;
	}

	.news {
		position: absolute;
		right: 15px;
	}

	.news .num {
		font-size: 8px;
		color: #fff;
		background-color: #f00;
		width: 15px;
		height: 15px;
		line-height: 16px;
		text-align: center;
		display: block;
		border-radius: 50%;
		position: absolute;
		right: -8px;
		top: -6px;
		font-weight: normal;
	}

	.swiper {
		height: 198px;
		width: 100%;
	}

	.swiper image {
		width: 100%;
		height: auto;
	}

	.menu-con {
		border-radius: 4px;
		box-shadow: 0 0 10px rgba(0, 0, 0, .1);
		margin: 15px;
	}

	.item-list {
		width: calc(50% - 26px);
		padding: 25px 10px 25px 15px;
		float: left;
		border-right: 1px solid #f7f7f7;
		border-bottom: 1px solid #f7f7f7;
		font-size: 15px;
		display: flex;
		display: -webkit-flex;
		align-items: center;
		height: 38px;
	}

	.item-list>image {
		width: 30px;
		height: 30px;
		margin-right: 10px;
	}

	.item-list text {
		display: block;
		font-size: 12px;
		color: #999;
	}

	.item-list .discount {
		width: 46px;
		height: 17px;
		float: right;
	}

	.notice-box {
		display: flex;
		display: -webkit-flex;
		align-items: center;
		padding: 15px 15px 5px;
	}

	.notice-box .small-title {
		background-color: #FFF5E9;
		color: #FD9523;
		font-size: 13px;
		padding: 2px 5px;
	}

	.notice-box .icon--right-jian {
		font-size: 13px;
	}

	.notice-box .notice-swiper {
		width: calc(100% - 50px);
		margin-left: 10px;
		height: 20px;
	}

	.notice-box .notice-swiper .notice-item {
		display: flex;
		display: -webkit-flex;
		align-items: center;
		color: #666;
	}

	.notice-box .notice-swiper .notice-item .info {
		display: block;
		width: 95%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
