<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<view style="background-color: #FFFFFF;">
			<view class="top_user">
				<view class="left_top">
					<image src="../../static/images/gly.png"></image>
					<view style="font-size: 16px;">管理员</view>
				</view>	
				<view class="rigt_top">
					<text class="name_ri">{{companyInfo.adminName}}</text>
						<text @click="phoneCall(companyInfo.phone)">{{companyInfo.phone}}</text>
				</view>
			</view>
			<view class="account">
				<text class="cmpy-name">{{companyInfo.cmpyName}}</text>
				<text class="amount-title">账户余额(元)</text>
				<view class="cz" v-show="companyInfo.isMaster" @click="goJump('companyRecharge')">充值</view>
				<view class="amount">
					{{companyInfo.amount}}
					<view>冻结<text class="num">{{companyInfo.frozenAmount}}</text>元</view>
				</view>
				<view class="leiji">
					<view class="ljys">
						<label>累计已省(元)</label>
						<text>{{$util.GetAmount(companyInfo.saveMoney)}}</text>
					</view>
					<view class="bordr_s"></view>
					<view class="ljys">
						<label>累计发货(元)</label>
						<text>{{$util.GetAmount(companyInfo.takeDeliveryMoney)}}</text>
					</view>
					<view class="bordr_s"></view>
					<view class="ljys">
						<label>累计市场价(元)</label>
						<text>{{$util.GetAmount(companyInfo.marketMoney)}}</text>
					</view>
				</view>
			</view>
			<view class="qy_blo">
				<view class="qy_one" @click="goJump('companyExpress')">
					<image src="../../static/images/qy-01.png" mode="widthFix"></image>
					<text>企业快递</text>
				</view>
				<view class="qy_one" v-show="companyInfo.isMaster" @click="goJump('coupon?type=comp')">
					<image src="../../static/images/qy-02.png" mode="aspectFit"></image>
					<text>企业优惠券</text>
				</view>
				<view class="qy_one" v-show="companyInfo.isMaster" @click="goJump('moneyDetail')">
					<image src="../../static/images/qy-03.png" mode="aspectFit"></image>
					<text>资金明细</text>
				</view>
				<view class="qy_one" v-show="companyInfo.isMaster" @click="goJump('companyInvoice')">
					<image src="../../static/images/qy-04.png" mode="aspectFit"></image>
					<text>企业发票</text>
				</view>
			</view>
			<view class="bot_view" v-show="companyInfo.isMaster">
				<view class="qy_one" @click="goJump('balanceAlert')">
					<image src="../../static/images/qy-05.png" mode="aspectFit"></image>
					<text>余额预警</text>
				</view>
				<view class="qy_one" @click="goJump('setPayPassword')">
					<image src="../../static/images/qy-06.png" mode="aspectFit"></image>
					<text>支付密码</text>
				</view>
				<view class="qy_one" @click="goJump('exportbill')">
					<image src="../../static/images/qy-07.png" mode="aspectFit"></image>
					<text>导出账单</text>
				</view>
				<view class="qy_one" @click="goJump('companyLog')">
					<image src="../../static/images/qy-08.png" mode="aspectFit"></image>
					<text>企业日志</text>
				</view>
				<view class="qy_one" @click="goJump('memberList')">
					<image src="../../static/images/qy-09.png" mode="aspectFit"></image>
					<text>全部成员</text>
				</view>
				<view class="qy_one" @click="goJump('permissionSet')">
					<image src="../../static/images/qy-10.png" mode="aspectFit"></image>
					<text>权限设置</text>
				</view>
				<view class="qy_one" @click="goJump('月度')">
					<image src="../../static/images/qy-11.png" mode="aspectFit"></image>
					<text>月度报表</text>
				</view>
			</view>
		</view>
		<button class="exit" @click="exitClick()" v-show="!companyInfo.isMaster">退出企业</button>
	</view>
</template>
<script>
export default {
	data() {
		return {
			companyInfo: {
				phone:"",
				adminName: "--",
				amount: "0.00",
				cmpyName: "",
				frozenAmount: "0.00",
				isMaster: false
			}
		}
	},
	onShow() {
		const that = this;
		that.showImage = getApp().globalData.isDiscountPopup;
		uni.showLoading({ title: '加载中...' });
		that.$util.networkRequest({
			url : "/Company/Info",
			success: function(res){
				res.amount = res.amount.toFixed(2);
				res.frozenAmount = res.frozenAmount.toFixed(2);
				res.phone = res.mtCode / ((res.id % 9) + 31);
				that.companyInfo = res;
				if(!res.isPassWord && res.isMaster){
					uni.showModal({
						title: '提示',
						content: '您还没有设置支付密码，请去前往设置',
						showCancel: false,
						success: function () {
							uni.navigateTo({url: "/pages/me/setPayPassword"});
						}
					});
				}
			},
			error: data => {
				switch (data.errCode) {
				    case 2101: //未认领
						uni.redirectTo({url: "/pages/me/claim"});
						break;
					case 2102: //审核中
						uni.redirectTo({url: "/pages/me/claimStatus?status=0"});
						break;
					case 2103: //认领失败
						uni.redirectTo({url: "/pages/me/claimStatus?status=1"});
						break;
					default:
						uni.showModal({
						    title: '提示',
						    content: '认领失败，联系系统管理员',
							showCancel: false,
							success: function () {
								that.$util.navigateBack(that)
							}
						});
						break;
				}
			}
		});
	},
	methods: {
		goJump: function(_url){
			let _token = uni.getStorageSync("token");
			if(_token == "" || _token == undefined){
				uni.navigateTo({url: "/pages/logs/logs"});
			}else{
				if(_url == "月度"){
					let host = "";
					// #ifdef MP-WEIXIN
					// host = "http://192.168.0.109:8080/";//本地
					host = this.apiHost; //服务器
					// #endif
					uni.navigateTo({
						url: '/pages/web-view/index?url=' + encodeURIComponent(host + '/hybrid/html/reportForms.html?token='+_token+"&host="+this.apiUrl)
					})
					return false;
				}
				uni.navigateTo({ url:'/pages/me/' + _url });
			}
		},
		//退出企业
		exitClick: function(){
			const that = this;
			uni.showModal({
			    title: '提示',
			    content: '确定要退出吗',
				success: function (res) {
					if(res.confirm){
						that.$util.networkRequest({
							url : "/CompanyUser/Quit",
							method: "POST",
							success: function(res){
								uni.showModal({
								    title: '提示',
								    content: '退出成功',
									showCancel: false,
									success: function () {
										uni.switchTab({
											url: '/pages/index/index'
										});
									}
								});
							}
						})
					}
				}
			});
		},
		//拨打电话
		phoneCall(phone){
			uni.makePhoneCall({
				phoneNumber: String(phone) //仅为示例
			});
		}
	}
}
</script>
<style scoped>
.top_user{
	padding:10px 15px;
	display: flex;
	width:calc(100%-30px);
	text-align: center;
	height:40px;
	line-height: 40px;
	color: #000000;
	font-weight: bold;
}
.name_ri{
	margin-right: 8px;
}
.left_top image{
	width:35px;
	height:35px;
	margin-right: 5px;
	vertical-align: middle;
}
.left_top{
	align-self:flex-start;
	text-align: center;
	margin-right:auto;
	display: flex;
	line-height: 40px;
	font-size: 16px;
}
.rigt_top{
	font-size: 16px;
	align-self: flex-end;
}
.account{
	margin:10px 15px;
	width:calc(100%-30px);
	background: #4385f5;
	border-radius: 12px;
	padding: 15px;
	position: relative;
	background-image: linear-gradient(to bottom, #428bf4, #3ccafc);
}
.cz{
	background-color: #FFFFFF;
	padding: 2px 12px;
	border:1px solid #FFFFFF;
	border-radius: 3px;
	color: #E7501E;
	position: absolute;
	right:15px;
	top:50px;
}

.bot_view,
.qy_blo{
	display: flex;
	padding: 15px 15px 0;
	flex-wrap: wrap;
}
.qy_one{
	width:25%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	padding-bottom: 15px;
	height:60px;
}
.qy_one image{
	width:30px;
	height:25px;
	margin-bottom: 6px;
}
.account .cmpy-name{
	font-size: 16px;
	padding: 5px 0 20px;
	color: #FFFFFF;
	display: block;
}
.account .amount-title{
	font-size: 13px;
	color: #eee;
	padding-bottom: 15px;
	display: block;
}
.account .amount{
	font-size: 36px;
	font-weight: bold;
	color: #fff;
	padding-bottom: 10px;
}
.account .amount > view{
	font-size: 12px;
	font-weight: normal;
	color: #fff;
	background: rgba(0, 0, 0, 0.1);
	padding: 3px 10px;
	margin-left: 10px;
	border-radius: 20px;
	display: inline;
	vertical-align: middle;
}
.account .amount > view .num{
	color: #ff822e;
	font-size: 14px;
}
.me-comp{
	background-color: #FFFFFF;
	position: relative;
	line-height: 40px;
}
.me-comp .pattern{
	font-size: 22px;
	position: absolute;
	left: 15px;
}
.me-comp .words{
	border-bottom: 1px solid #F7F7F7;
	margin-left: 45px;
}
.me-comp .pattern.blue{
	color: #4385f5;
}
.me-comp .pattern.orange{
	color: #ff822e;
}
.me-comp .pattern.red{
	color: #ff4544;
}
.me-comp .icon--right-jian{
	float: right;
	padding-right: 13px;
	font-size: 14px;
	color: #999;
}
.icon--right-jian:before{
	float: right;
	padding-left: 5px;
}
.exit{
	background-color: #FFFFFF;
	margin-top: 10px;
	line-height: 44px;
	color: #FF0000;
}
.marginT{
	margin-top: 10px;
}
.leiji{
	display: flex;
	align-items: center;
	justify-content: space-around;
	text-align: center;
}
.ljys{
	display: flex;
	flex-direction: column;
}
.ljys label{
	font-size: 12px;
	line-height: 20px;
	color: #FFFFFF;
}
.ljys text{
	font-size: 16px;
	color: #FFFFFF;
	font-weight: bold;
}
.bordr_s{
	width: 1px;
	height: 32px;
	background: #eee;
}
</style>
