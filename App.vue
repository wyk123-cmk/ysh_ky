<script>
	export default {
		globalData: {
			discountPopUpImage: {}, //活动数据
			isDiscountPopup: 0, //是否显示活动弹框 0-大图显示;1-缩略图显示;2--都不显示
		},
		onLaunch: function() {
			// #ifdef H5
				let u = navigator.userAgent;
				let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
				if(isiOS){
					this.$util.config();
				}
			// #endif
			// #ifdef MP-WEIXIN
				this.versionUpdate();
				if(uni.getStorageSync('wxauthorize') != "" && uni.getStorageSync('wxauthorize') != undefined){
					this.authorize_mp_wx();
				}
			// #endif
		},
		onShow: function() {
			console.log('App Show')
			
		
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			isToken: function(type){
				const that = this;
				// #ifdef H5
				if(uni.getStorageSync("h5initlog") == "" || uni.getStorageSync("h5initlog") == undefined){
					if(that.isWechat()){
						
						uni.getStorage({
							key: 'token',
							fail: function(){
								that.authorize_H5();
							}
						});
					}else{
						if(that.$util.IsPC()){
							let host = (this.apiHost).replace("https://","http://");
							window.location.href = host + "/page/pc/ysdpc-template/";
						}else{
							//首页直接进入,不跳转登录页
							if(type == "首页") return false;
							
							uni.getStorage({
								key: 'token',
								fail: function(){
									window.location.href = "/pages/logs/logs?type="+type;
								}
							});
						}
					}
				}
				// #endif
			},
			//H5授权登录
			authorize_H5: function(){
				let that = this;
				var pages = getCurrentPages();
				var wx_h5_code = (pages[pages.length - 1]).$route.query.code;
				wx_h5_code = wx_h5_code == undefined?'' : wx_h5_code;
				var $route = window.location.href;
				var validCode = uni.getStorageSync("validCode");//防止重复刷新
				that.$util.isGoLogin = false;
				//如果拿到code，调用授权接口，没有拿到就跳转微信授权链接获取
				if(validCode != "1" || !that.$util.isNotEmpty(wx_h5_code) ){
					uni.setStorage({key: 'validCode', data: "1"});
					let _url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${that.wxappid}&redirect_uri=${encodeURIComponent(window.location.href)}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`
					window.location.href = _url;
				}else{
					that.$util._h5_login('logs', wx_h5_code);
				}
			},
			//小程序授权登录
			authorize_mp_wx: function(){
				let that = this;
				//判断用户是否授权
				wx.getSetting({
					success (res) {
						if(res.authSetting["scope.userInfo"] == true){
							//已授权
							console.log('已授权');
							that.$util._mp_wx_login("logs");
						}
						if(res.authSetting["scope.userInfo"] == false||res.authSetting["scope.userInfo"] == undefined){
							// 未授权
							console.log('未授权');
							console.log(that);
							that.$util.isGoLogin = false;
							uni.navigateTo({url: "/pages/logs/logs?state=false"});
						}
					}
				})
			},
			//小程序版本更新
			versionUpdate: function(){
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function (res) {
				  // 请求完新版本信息的回调
				  console.log("请求完新版本信息的回调:",res.hasUpdate);
				});
				updateManager.onUpdateReady(function (res) {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，是否重启应用？',
						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}
					});
				});
				updateManager.onUpdateFailed(function (res) {
				  // 新的版本下载失败
				  console.log("新的版本下载失败");
				});
			},
			//判断是否是微信登录
			isWechat: function() {
				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					return true;
				} else {
					return false;
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/css/iconfont.css';
	@import './common/css/style.css';
</style>
