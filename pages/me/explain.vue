<template>
	<view class="main">
		<view v-if="type=='1'">
			<view class="title">充值说明:</view>
			<text  style="font-size: 13px; color: #666;">
				1、因在估价时重量可能不准确，寄大件还会产生包装费、送货费等，所以在寄件时余额需大于预估金额。\n 2、余额可随时提现。
			</text>
			<view style="color: #333333;margin-top: 10px;">如有疑问，请添加客服微信（13811418661）。</view>
		</view>
		<view v-if="type=='2'">
			<view class="title">提现时间说明：</view>
			<view v-html="html"></view>
		</view>
		<view v-if="type=='3'">
			<view v-html="html"></view>
		</view>
		<view v-if="type=='4'">
			<image style="width: 100%;" mode="widthFix" :src="imgUrl"></image>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			type: '1',
			html: "",
			imgUrl: "",
		}
	},
	onLoad(options){
		let _title = "说明";
		this.type = options.type;
		switch(options.type){
			case "1":
				_title = "充值说明";
				break;
			case "2":
				this.getCashPrompt();
				_title = "提现说明";
				break;
			case "3":
				this.getCouponRemark();
				_title = "优惠券说明";
				break;
			case "4":
				_title = "奖励金说明";
				// this.imgUrl = this.apiHost + "/upload/jlj/referralRule.png";
				this.imgUrl = "http://express.1718china.cn/upload/jlj/referralRule.png";
				break;
		}
		uni.setNavigationBarTitle({ title: _title });
		
	},
	methods: {
		getCashPrompt: function(){
			const that = this;
			that.$util.networkRequest({
				url: "/Referral/GetCashPrompt",
				success: data => {
					that.html = data;
				},
			});
		},
		getCouponRemark: function(){
			const that = this;
			that.$util.networkRequest({
				url: "/Coupon/GetCouponRemark",
				success: res => {
					that.html = res;
				}
			});
		}
	}
}
</script>
<style scoped>
.main{
	padding: 20px 15px;
	border-top: 1px solid #eee;
	line-height: 24px;
}
.title{
	padding-bottom: 10px;
}
</style>