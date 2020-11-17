<template>
	<view>
		<page-imges :show="showImage"></page-imges>
		<view class="way">
			{{infoData.amountText}}
			<text>{{infoData.amountSymbol}}</text>
		</view>
		<view class="detail-li"><text>类型</text>{{infoData.amountText}}</view>
		<view class="detail-li"><text>时间</text>{{infoData.logTime}}</view>
		<view class="detail-li"><text>交易单号</text>{{infoData.orderCode==null||infoData.orderCode==''?'':infoData.orderCode}}</view>
		<view class="detail-li"><text>钱包剩余</text>{{infoData.balance}}</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			infoData: []
		}
	},
	onLoad(options){
		let that = this;
		that.showImage = getApp().globalData.isDiscountPopup;
		uni.showLoading({ title: '加载中...' });
		that.$util.networkRequest({
			url: "/Wallet/GetLogDetail",
			data: { id: options.id},
			success: res => {
				if(res.amountType==1){
					res.amount = "+"+res.amount.toFixed(2);
				}else{
					res.amount = "-"+res.amount.toFixed(2);
				}
				res.logTime = that.$util.formatDate.format(res.logTime,"yyyy-MM-dd hh:mm")
				res.balance = res.balance.toFixed(2);
				that.infoData = res;
			}
		})
	}
}
</script>
<style scoped>
.way{
	padding: 30px 0px 20px;
	border-bottom: 1px solid #f7f7f7;
	margin: 0 14px 20px;
	font-size: 16px;
	display: flex;
	flex-direction: column;
	text-align: center;
}
.way text{
	font-size: 28px;
	font-weight: bold;
}
.detail-li{
	padding: 8px 15px;
	display: box;
	display: -webkit-box;
}
.detail-li text{
	display: block;
	width: 70px;
	color: #999;
}
</style>
