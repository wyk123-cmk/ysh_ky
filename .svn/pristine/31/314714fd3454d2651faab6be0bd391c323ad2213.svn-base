<template>
	<view class="content">
		<view class="login-model" v-if="isShow">
			<view class="v-modal"></view>
			<view class="box">
				<text class="title">授权登录</text>
				<text class="txt">申请获取以下权限</text>
				<text class="txt note">获得你的公开信息(昵称，头像等)</text>
				<button type="primary" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">授权登录</button>
			</view>
		</view>
		<view class="main">
			<image class="logo-img" src="../../static/images/logo-img.png"></image>
			<text class="title">手机号快捷登录</text>
			<text class="note">未注册用户登录默认成为平台用户</text>
			<form class="form">
				<view class="input-column">
					<input type="number" v-model="phone" maxlength="11" placeholder="请输入手机号" />
				</view>
				<view class="input-column">
					<input class="code" v-model="code" type="number" placeholder="请输入验证码" />
					<view class="code-btn">
						<text v-if="!isGetCode" @click="sendCode">获取验证码</text>
						<text v-else>{{codeTime}} s</text>
					</view>
				</view>
				<button @click="btnLogin">登录</button>
			</form>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				isShow: false,
				openId: "",
				phone: "",
				code: "",
				codeTime: 60,
				isGetCode: false,
				jumpUrl: "", //指定登录返回路径
				type: "", //是否从第三方进来的
				fromCode: "", //登录时提交邀请人
				mptype: "",//是否从第三方进来的小程序（h5传参type="tz"小程序传参mptype="tz"来标识是领取折扣券活动为  登录跳转首页）
				userSource: ""//用户来源
			}
		},
		onLoad(options) {
			if (options.mptype != undefined) this.mptype = options.mptype;
			if (options.openid != undefined) this.openId = options.openid;
			if (options.url != undefined) this.jumpUrl = options.url;
			if (options.type != undefined) this.type = options.type;
			if (options.fromCode != undefined) {
				this.fromCode = options.fromCode;
			}
			if (options.userSource != undefined) {
				this.userSource = options.userSource;
			}
			// #ifdef  MP-WEIXIN
			if (options.state == "false") this.isShow = true;
			// if(uni.getStorageSync('wxauthorize') == "" || uni.getStorageSync('wxauthorize') == undefined){
			// 	this.isShow = true
			//}
			// #endif
		},
		onShow() {
			let that = this;
			this.code = "";
		},
		//监听页面卸载
		onUnload() {
			this.$util.isGoLogin = true;
		},
		methods: {
			//获取验证码
			sendCode: function() {
				const that = this;
				if (!that.valid(false)) return false;
				uni.showLoading({
					mask: true,
					title: '加载中...'
				});
				that.$util.networkRequest({
					url: "/Account/SendCode",
					method: "POST",
					data: {
						phone: that.phone
					},
					success: res => {
						if (res) {
							that.isGetCode = true;
							var getCodeInval = setInterval(() => {
								that.codeTime--;
								if (that.codeTime <= 0) {
									that.isGetCode = false;
									that.codeTime = 60;
									clearInterval(getCodeInval);
								}
							}, 1000);
						}
					}
				})
			},
			//登录
			btnLogin: function() {
				if (!this.valid(true)) return false;
				const that = this;
				uni.showLoading({
					mask: true,
					title: '登录中...'
				});
				let param = {
					phone: that.phone,
					code: that.code,
					fromCode: that.fromCode,
					userSource: that.userSource
				}
				// #ifdef  H5
				param["openId"] = that.openId
				// #endif
				// #ifdef  MP-WEIXIN
				param["appOpenId"] = that.openId
				// #endif
				that.$util.networkRequest({
					url: "/Account/Login",
					method: "POST",
					data: param,
					success: res => {
						uni.setStorage({
							key: 'token',
							data: res
						});
						// h5传参type="tz"小程序传参mptype="tz"来标识是领取折扣券
						if(that.type=="tz" || that.mptype=="tz"){
							// #ifdef H5
							window.location.href = "/pages/index/index?types=" + that.type;
							return false;
							// #endif
							// #ifdef MP-WEIXIN
							uni.reLaunch({
								url: "/pages/index/index?types=" + that.mptype
							})
							return false;
							// #endif
						}
						that.getIsFinish(res);
					}
				});
			},
			//是否完善用户信息
			getIsFinish: function(_token) {
				const that = this;
				that.$util.networkRequest({
					url: "/Account/GetIsFinish",
					header: {
						appId: that.appId,
						token: _token
					},
					data: {
						token: _token
					},
					success: res => {
						if (res) {
							if (that.jumpUrl != "") {
								if (that.type == 1) {
									window.location.href = that.jumpUrl;
								} else {
									uni.redirectTo({
										url: that.jumpUrl
									});
								}
							} else {
								// #ifdef  H5
								// h5传参type="tz"小程序传参mptype="tz"来标识是领取折扣券
								window.location.href = "/pages/index/index"
								return false;
								// #endif
								
								that.$util.navigateBack(that);
							}
						} else {
							
							uni.navigateTo({
								url: "/pages/logs/peopleInfo?type=0"
							});


						}
					}
				});
			},
			//验证
			valid(bool) {
				if (!this.$util.isNotEmpty(this.phone)) {
					this.$util.showToast("请输入手机号");
					return false;
				}
				if (!this.$util.isPhoneNumber(this.phone)) {
					this.$util.showToast("手机格式有误，请输入有效的手机号");
					return false;
				}
				if (bool && !this.$util.isNotEmpty(this.code)) {
					this.$util.showToast("请输入短信验证码");
					return false;
				}
				return true;
			},
			//微信小程序授权
			bindGetUserInfo: function(res) {
				let that = this;
				if (res.detail.userInfo) {
					uni.showLoading({
						title: '正在授权...',
						mask: true
					});
					uni.setStorage({
						key: 'wxauthorize',
						data: "true"
					});
					that.$util._mp_wx_login(null, that.mptype, function(res) {
						console.log("res" + res);
						that.isShow = false;
						if (res.status == 1) {
							uni.showModal({
								title: '提示',
								content: "授权登录成功!",
								showCancel: false,
								success: res => {
									if (that.mptype == "tz") {
										uni.reLaunch({
											url: "/pages/index/index?types=" + that.mptype
										})
										return false;
									}
									if (that.jumpUrl != "") {
										uni.redirectTo({
											url: that.jumpUrl
										});
									} else {
										uni.navigateBack({
											delta: 1
										});
									}
								}
							})
						}
						if (res.status == 2) {
							that.openId = res.openId;
						}
					})
				} else {
					uni.showModal({
						title: '提示',
						content: "拒绝授权后,功能将不能使用!",
						showCancel: false
					})
				}
			}
		}
	}
</script>
<style scoped>
	.content {
		padding: 0 25px;
	}

	.main .logo-img {
		width: 50px;
		height: 50px;
		display: block;
		padding-top: 45px;
	}

	/* #ifdef H5 */
	.main .logo-img {
		padding-top: 80px;
	}

	/* #endif */
	.main text {
		display: block;
	}

	.main .title {
		font-size: 22px;
		margin-top: 25px;
		font-weight: bold;
		letter-spacing: 2px;
	}

	.main .note {
		color: #999;
		font-size: 12px;
	}

	.main .form {
		margin-top: 40px;
		display: block;
	}

	.main .form .input-column {
		border-bottom: 1px solid #EEEEEE;
		display: flex;
		display: -webkit-flex;
		margin-top: 22px;
		height: 26px;
		line-height: 26px;
		justify-content: space-between;
	}

	.main .form .input-column input {
		line-height: 26px;
		width: 70%;
	}

	.main .form .input-column .code-btn {
		text-align: right;
		color: #4285F4;
	}

	.main .form button {
		background-color: #4285F4;
		color: #FFFFFF;
		width: 100%;
		margin-top: 30px;
	}

	.login-model {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 98;
	}

	.v-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		z-index: 99;
	}

	.login-model .box {
		background: #fff;
		border-radius: 5px;
		position: absolute;
		top: 50%;
		margin-top: -105px;
		left: 25px;
		right: 25px;
		z-index: 100;
	}

	.login-model .box text {
		display: block;
		font-size: 15px;
	}

	.login-model .title {
		text-align: center;
		font-size: 16px;
		height: 44px;
		line-height: 44px;
		border-bottom: 1px solid #ddd;
		margin-bottom: 10px;
	}

	.login-model .box text.icon-weixin {
		text-align: center;
		color: #46bb36;
		font-size: 40px;
	}

	.login-model .box text.txt {
		padding: 10px 15px 0;
	}

	.login-model .box text.note {
		color: #888888;
	}

	.login-model .box button {
		margin: 25px 15px;
		border-radius: 25px;
		font-size: 15px;
	}
</style>
