<template>
	<view class="cash-apply">
		<view class="top">
			<image src="../../static/images/wcjb.png" mode="widthFix"></image>
			提现申请已提交
			<view class="tips">等待管理员审核，请耐心等待</view>
		</view>
		<view class="s-title">提现详情</view>
		<view class="c-a-l"><text>微信账号</text>{{userName}}</view>
		<view class="c-a-l"><text>提现金额</text>{{amount}}元</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			userName: "",
			amount: "0.00"
		}
	},
	onLoad(options){
		this.userName = options.nickName;
		this.amount = options.amount;
	}
}
</script>
<style scoped>
.cash-apply .top{
	text-align: center;
	padding-top: 40px;
	line-height: 24px;
}
.cash-apply image{
	width: 36px;
	height: 36px;
	display: block;
	margin: 0 auto 5px;
}
.cash-apply .tips{
	color: #999;
	font-size: 12px;
}
.cash-apply .s-title{
	border-bottom: 1px solid #f7f7f7;
	padding: 10px 15px;
	padding-top: 45px;
}
.cash-apply .c-a-l{
	display: flex;
	flex-flow: nowrap row;
	align-items: center;
	justify-content: space-between;
	padding: 10px 15px;
	font-size: 12px;
}
.cash-apply .c-a-l text{
	color: #999;
}
</style>
