<template>
	<view class="bg_bod">
		<image src="../../static/images/lq.png" class="img_lp"></image>
		
		<button @click="immediatelyget()" class="btn_lq">{{btntext}}</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fromCode: "", //登录时提交邀请人
				userSource:"",
				btntext: "立即领取",
				couponlist:[],
				isInit: false
			}
		},
		onLoad(options) {
			if (options.fromCode != undefined) {
				this.fromCode = options.fromCode;
			}
			if (options.userSource != undefined) {
				this.userSource = options.userSource;
			}
			if(uni.getStorageSync("token") !="" && uni.getStorageSync('token')!=undefined  && uni.getStorageSync('token')!=null){
				this.isInit = true;
				this.getCouponList();
			}
		},
		methods: {
			immediatelyget(){
				console.log(uni.getStorageSync('token'));
				if(uni.getStorageSync("token")=="" || uni.getStorageSync('token')==undefined  || uni.getStorageSync('token')==null){
					// #ifdef H5
						this.isToken('tz');
					// #endif
					// #ifdef MP-WEIXIN
					   this.authorize_mp_wx();
					// #endif
				}
				else{
					if(!this.isInit) {
						this.getCouponList();
					}
					this.getCoupon();
				}
			},
			getCouponList(){
				const that = this;
				that.$util.networkRequest({
					url: "/Coupon/GetList",
					data: {userType: 'indi'},
					success: res => {
						if(res == null) {
							that.$util.showToast('暂无可领取的优惠券')
							return false;
						}
						that.couponlist=res.list;
						var list=res.list;
						var lyList=[];
						for(var i=0;i<list.length;i++){
							var item=list[i];
							if(item.isget=="" || item.isget==null || item.isget.indexOf('_')>-1){
								lyList.push(item);
							}
						}
						if(lyList.length==list.length){
							that.btntext="已领取"
						}
					}
				});
			},
			getCoupon: function(){
				const that = this;
				that.$util.networkRequest({
					url: "/Coupon/GetList",
					data: {userType: 'indi'},
					success: res => {
						if(res == null) {
							that.$util.showToast('暂无可领取的优惠券')
							return false;
						}
						that.couponlist=res.list;
						var list=res.list;
						var lyList=[];
						for(var i=0;i<list.length;i++){
							var item=list[i];
							if(item.isget=="0"){
								that.postCoupon(item.id,item.isget,i)
							}
						}
						
					}
					
				});
			},
			postCoupon: function(id, isget,i){
				if (isget == "1") return false;
				const that = this;
				that.$util.networkRequest({
					url: "/Coupon/PostVoucherCoupon",
					method: "POST",
					data: {userType: "indi", couponId: id},
					success: res => {
						
						if (res !== "" && i==(that.couponlist.length-1) ) {
						
							that.$util.showToast("领取成功");
							uni.reLaunch({
								url:"/pages/index/index?types=tz"
							})
						}
						
					}
				});
			},
			isToken(type){
				const that = this;
				window.location.href = "/pages/logs/logs?userSource="+that.userSource+"&fromCode="+that.fromCode+"&type="+type;
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
							that.$util._mp_wx_login("logs",'tz',function(res){
								if(res.status==1){
									uni.reLaunch({
										url:"/pages/index/index?types=tz"
									})
								}
							});
						}
						if(res.authSetting["scope.userInfo"] == false||res.authSetting["scope.userInfo"] == undefined){
							// 未授权
							console.log('未授权');
							
							that.$util.isGoLogin = false;
							var jumpurl="/pages/logs/logs";
							uni.navigateTo({url: "/pages/logs/logs?state=false&mptype=tz&userSource="+that.userSource+"&fromCode="+that.fromCode+""});
						}
					}
				})
			},
		}
	}
</script>
<style>
	page{
		background-color: #101748 ;
	}
</style>
<style scoped>

	
	uni-page-body{
		width: 100%;
		height: 100%;
		overflow-y: scroll;
		 background: #101748;
		    background: -moz-linear-gradient(top, #6161e5 0%, #101748 100%);
		    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#000000), color-stop(100%,#101748));
		    background: -webkit-linear-gradient(top, #6161e5 0%,#101748 100%);
		    background: -o-linear-gradient(top, #6161e5 0%,#101748 100%);
		    background: -ms-linear-gradient(top, #6161e5 0%,#101748 100%);
		    background: linear-gradient(to bottom, #6161e5 0%,#101748 100%);
		    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#101748',GradientType=0 );
	}
.bg_bod{
	width:100%;
	background-repeat: no-repeat;
	position: relative;
background-size: auto 100%;
	z-index: 10;

}
.img_lp{
	width: 100%;
	height: 680px;
}
.btn_lq{
	z-index: 30;
	position: absolute;
	bottom: 60px;
	left:25%;
	width: 50%;
	height: 40px;
	line-height: 40px;
	color: #FFFFFF;
	/* border-width: 2px;
	  border-style: solid; */
	  border-radius: 20px;
	  background-color: rgb(244, 108, 26);
	  box-shadow: inset 1.452px 5.822px 9px 0px rgba(231, 52, 5, 0.73);
}
@media screen and (max-height: 600px)  and (max-width:340px) { /*当屏幕尺寸小于600px时，应用下面的CSS样式*/
.img_lp{
	width: 100%;
	height: 540px;
}
.bg_bod{
	width:100%;
	background-repeat: no-repeat;
	position: relative;
background-size: auto 100%;
	z-index: 10;

}
.btn_lq{
	z-index: 30;
	position: absolute;
	bottom: 51px;
	left:25%;
	width: 50%;
	height: 40px;
	line-height: 40px;
	color: #FFFFFF;
	/* border-width: 2px;
	  border-style: solid; */
	  border-radius: 20px;
	  background-color: rgb(244, 108, 26);
	  box-shadow: inset 1.452px 5.822px 9px 0px rgba(231, 52, 5, 0.73);
}
}

</style>
