<template>
	<view>
		<view class="head-con">
			<text class="iconfont icon-weixin"></text>
			提现到微信 <!-- {{userName}} -->
		</view>
		<view class="con">
			<text class="small-title">提现金额</text>
			<view class="label-input">
				￥<input type="text" v-model="amount" disabled />
			</view>
			<view class="note">当前账户奖励金{{amount}}元,含手续费<text>{{processAmount}}</text>元</view>
			<button class="bounty" @click="btnCash">立即提现</button>
		</view>
		<view class="activity-explain" v-if="type==1">
			<text class="title">可提现金额及申请提现说明：</text>
			<text>(1) 提现方式：提现到微信(推广时绑定的个人微信)。</text>
			<text>(2) 奖励金额满1元可提现。</text>
			<text>(3) 一个月可提现一次，全部提现。</text>
			<text>(4) 提现审核：1-3个工作日内，最快一个工作日之内审核完毕。</text>
			<text>(5) 邀请好友发货金额累计仅计算运费。</text>
			<text>(6) 手续费结算规则：累计提现100元以下无手续费，累计提现100元（含100元）及以上，提现按千分之六收取手续费，产生的手续费从提现金额中扣除。</text>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			type: "",
			amount: '0.00',
			userName: "",
			processAmount: 0
		}
	},
	onLoad(options){
		if(options.type != undefined) this.type = options.type;
		this.getReferralInfo();
		//判断是否授权
		// #ifdef H5
			this.h5_userInfo();
		// #endif
	},
	methods: {
		getReferralInfo: function(){
			const that = this;
			that.$util.networkRequest({
				url: "/Referral/GetCashInfo",
				success: data => {
					console.log("data:",data)
					that.userName = data.nickName;
					that.amount = Number(data.amount).toFixed(2);
					that.processAmount = (data.processAmount).toFixed(2);
				},
			});
		},
		btnCash: function(){
			const that = this;
			uni.showLoading({ title: "请稍后...", mask: true });
			if(that.amount == "0.00" || that.amount == 0){
				that.$util.showToast("您目前提现金额为0.00元");
				return false;
			}
			that.$util.networkRequest({
				url: "/Referral/Cash",
				method: "POST",
				data: {value: that.amount},
				success: data => {
					if(data){
						uni.redirectTo({url:'/pages/me/cashApply?nickName='+that.userName+"&amount="+that.amount});
					}
				},
				error: data => {
					if(data.errCode == 2201){
						uni.showModal({
						    title: '提示',
						    content: '请先完善您的个人信息',
							showCancel: false,
							success: function () {
								uni.navigateTo({url:'/pages/logs/peopleInfo?type=1'});
							}
						});
					}
				}
			});
		},
		h5_userInfo: function(){
			let that = this;
			that.$util.networkRequest({
				url: "/Account/GetUserWxInfo",
				success: data => {
					if(data.UnAuthorized){
						uni.showModal({
							title: '提示',
							content: '请先关注“仪商汇”微信公众号',
							showCancel: false,
							success: function () {
								that.$util.navigateBack(that)
							}
						});
					}
				},
			});
		}
	}
}
</script>
<style scoped>
@import '../../common/css/me/wallet.css';
.note{
	color: #999999;
}
.note text{
	color: #333333;
}
</style>

