<style scoped>
	@import "../../common/css/me/userInfo.css";
</style>
<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<image class="bg" src="../../static/images/userbg.png" mode="widthFix"></image>
		<view class="user-box">
			<view class="user-heard" v-if="!isLogin" @click="goLogin">
				<view class="pic">
					<image src="../../static/images/user.jpg" mode="widthFix"></image>
				</view>
				<text class="txt">登录/注册</text>
			</view>
			<!-- 上传头像 -->
			<view v-else class="user-heard">
				<!-- #ifdef H5 -->
				<view class="pic">
					<view ref="input" class="input-view"></view>
					<image :src="userInfo.logo" mode="aspectFill"></image>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="pic" @click="uploadUserPic()">
					<image :src="userInfo.logo" mode="aspectFill"></image>
				</view>
				<!-- #endif -->
				<text class="txt" @click="UpdeteUseInfo()">{{userInfo.userName==null?"点击完善":userInfo.userName}}</text>
			</view>
			<view class="item-list">
				<view @click="goOrderList(1)">
					<text class="num">{{countData.sendCount==undefined?0:countData.sendCount}}</text>
					<text>我的寄件</text>
				</view>
				<view @click="goOrderList(2)">
					<text class="num">{{countData.receiveCount==undefined?0:countData.receiveCount}}</text>
					<text>我的收件</text>
				</view>
				<view @click="goPage('coupon?type=indi')">
					<text class="num">{{countData.couponCount==undefined?0:countData.couponCount}}</text>
					<text>优惠券</text>
				</view>
			</view>
		</view>
		<view class="item-list">
			<view @click="goCompanyPage('myCompany')">
				<image mode="widthFix" src="../../static/images/user-icon1.png" style="margin-top: 1px; margin-bottom: 12px;"></image>
				<text>我的企业</text>
			</view>
			<view @click="goPage('addressList')">
				<image mode="widthFix" src="../../static/images/user-icon2.png"></image>
				<text>地址簿</text>
			</view>
			<view @click="goPage('myWallet')">
				<image mode="widthFix" src="../../static/images/user-icon3.png"></image>
				<text>钱包</text>
			</view>
			<view @click="goPage('bounty')">
				<image mode="widthFix" src="../../static/images/user-icon4.png"></image>
				<text>奖励金</text>
			</view>
		</view>
		<view class="bgF cumulative">
			<view class="">
				<text>累计已省(元)</text>
				<text :style="$util.GetAmount(userInfo.saveMoney)=='--'?'color:#999':''">{{$util.GetAmount(userInfo.saveMoney)}}</text>
			</view>
			<view class="">
				<text>累计发货(元)</text>
				<text :style="$util.GetAmount(userInfo.takeDeliveryMoney)=='--'?'color:#999':''">{{$util.GetAmount(userInfo.takeDeliveryMoney)}}</text>
			</view>
			<view class="">
				<text>累计市场价(元)</text>
				<text :style="$util.GetAmount(userInfo.marketMoney)=='--'?'color:#999':''">{{$util.GetAmount(userInfo.marketMoney)}}</text>
			</view>
		</view>
		<view class="bgF">
			<view class="samll-title">企业服务</view>
			<view class="item-list paddingB">
				<view @click="goCompanyPage('companyExpress')">
					<image mode="widthFix" src="../../static/images/q01.png"></image>
					<text>企业快递</text>
				</view>
				<view v-show="companyInfo.isMaster" @click="goCompanyPage('companyRecharge')">
					<image mode="widthFix" src="../../static/images/q02.png"></image>
					<text>企业充值</text>
				</view>
				<view v-show="companyInfo.isMaster" @click="goCompanyPage('companyInvoice')">
					<image mode="widthFix" src="../../static/images/q03.png"></image>
					<text>企业发票</text>
				</view>
				<view v-show="companyInfo.isMaster" @click="goCompanyPage('memberList')">
					<image mode="widthFix" style="width: 21px;" src="../../static/images/q04.png"></image>
					<text>成员管理</text>
				</view>
			</view>
		</view>
		<view class="bgF">
			<view class="samll-title">我的工具</view>
			<view class="item-list paddingB">
				<view @click="goPage('invoice')">
					<image mode="aspectFit" src="../../static/images/user-icon9.png"></image>
					<text>个人发票</text>
				</view>
				<view @click="phoneCall()">
					<image mode="aspectFit" src="../../static/images/user-icon10.png"></image>
					<text>联系客服</text>
				</view>
				<view @click="goPage('feedback')">
					<image mode="aspectFit" src="../../static/images/user-icon11.png"></image>
					<text>问题反馈</text>
				</view>
			</view>
		</view>
		<button class="exit bgF" v-if="isLogin" @click="btnExit">解绑</button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				tel: "010-51285752",
				showImage: false,
				isLogin: false,
				userInfo: [],
				countData: [],
				companyInfo: [],
				token: "",
				SumFH: "0",
				SumYS: "3432",
				SumMarket: "645"
			}
		},
		onShow() {
			let _token = uni.getStorageSync("token");
			let app = getApp();
			app.isToken();
			this.showImage = app.globalData.isDiscountPopup;
			if (_token == "" || _token == undefined) {
				this.isLogin = false;
			} else {
				this.isLogin = true;
				this.token = _token;
				this.getUserInfo();
				this.getComIsMaster();
			}
		},
		mounted() {
			const that = this;
			// #ifdef H5
			if(!this.isLogin) return false;
			this.$util.$refsFileHtml({
				url: "/Account/ChangeLogo",
				formData: {
					SuffixName: ""
				},
				$input: this.$refs.input.$el
			}, function(data) {
				that.userInfo.logo = data.data;
			});
			//#endif
		},
		methods: {
			//获取寄件、收件、优惠数量
			getCount() {
				const that = this;
				that.$util.networkRequest({
					url: "/Account/GetStaticsCountModel",
					success: function(res) {
						that.countData = res;
					}
				});
			},
			getUserInfo: function() {
				const that = this;
				that.$util.networkRequest({
					url: "/Account/Get",
					success: function(res) {
						that.userInfo = res;
						that.getCount();
					}
				});
			},
			goOrderList(type) {
				if (this.goLogin() != false) return false;
				this.$store.state.orderType = type;
				uni.switchTab({
					url: '/pages/order/orderList'
				});
			},
			UpdeteUseInfo() {
				uni.navigateTo({
					url: "/pages/logs/peopleInfo?type=1"
				})
			},
			//上传头像
			uploadUserPic() {
				let that = this;
				that.$util.chooseImage({
					url: "/Account/ChangeLogo",
					formData: {
						SuffixName: ""
					},
				}, function(data) {
					that.userInfo.logo = data.data;
				});
			},
			//退出登录
			btnExit() {
				let that = this;
				let _recordType = 1; //1:公众号;2:小程序;3:pc
				// #ifdef H5
				// #endif
				// #ifdef MP-WEIXIN
				_recordType = 2
				// #endif
				that.$util.networkRequest({
					url: "/Account/Logout",
					method: "POST",
					data: {
						value: _recordType
					},
					success: res => {
						uni.removeStorageSync('token');
						uni.navigateTo({
							url: "/pages/logs/logs?openid="+res
						});
					}
				});
			},
			goPage(_url) {
				if (this.goLogin() != false) return false;
				if(_url == "bounty"){
					uni.navigateTo({
						url: "/pages/activityCenter/tz-activity"
					});
					return false;
				}
				uni.navigateTo({
					url: '/pages/me/' + _url
				})
			},
			getComIsMaster() {
				const that = this;
				that.$util.networkRequest({
					url: "/Company/Info",
					success: function(res) {
						that.companyInfo = res;
					},
				});
			},
			//企业服务
			goCompanyPage(_url) {
				if (this.goLogin() != false) return false;
				const that = this;
				uni.showLoading({
					title: '正在跳转...'
				});
				that.$util.networkRequest({
					url: "/Company/Info",
					success: function(res) {
						that.companyInfo = res;
						uni.navigateTo({
							url: '/pages/me/' + _url
						});
					},
					error: data => {
						switch (data.errCode) {
							case 2101: //未认领
								uni.navigateTo({
									url: "/pages/me/claim"
								});
								break;
							case 2102: //审核中
								uni.navigateTo({
									url: "/pages/me/claimStatus?status=0"
								});
								break;
							case 2103: //认领失败
								uni.navigateTo({
									url: "/pages/me/claimStatus?status=1"
								});
								break;
							default:
								uni.showModal({
									title: '提示',
									content: '认领失败，联系系统管理员',
									showCancel: false
								});
								break;
						}
					},
				});
			},
			goLogin() {
				if (this.isLogin) return false;
				uni.navigateTo({
					url: "/pages/logs/logs"
				});
			},
			//拨打电话
			phoneCall() {
				uni.makePhoneCall({
					phoneNumber: this.tel //仅为示例
				});
			}
		}
	}
</script>
