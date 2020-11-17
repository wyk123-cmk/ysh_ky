<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<view class="u-li">
			<switch class="switch-btn" :checked="isWarning" color="#e06f42" @change="switchChange" />余额不足提醒
		</view>
		<view v-if="isWarning">
			<view class="u-li">
				设置可用余额预警
				<view class="input-amount">￥<input type="digit" placeholder="200.00" v-model="warningAmount"></view>
				<text class="tips">当余额低于该值时，将通过微信提醒企业管理员</text>
			</view>
			<button class="btn-default-css" @click="submit">保存</button>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			isWarning: false,
			warningAmount: "200.00"
		}
	},
	created(){
		this.getCmpyWarningInfo();
		this.showImage = getApp().globalData.isDiscountPopup;
	},
	methods: {
		submit: function(){
			const that = this;
			let _isWarning = that.isWarning?1:0;
			uni.showLoading({title: "正在设置...",mask: true});
			that.$util.networkRequest({
				url: "/Company/SetWarningAmount",
				method: "POST",
				data: {
					warningAmount: that.warningAmount,
					isWarning: _isWarning,
				},
				success: function(res){
					uni.showModal({
					    title: '提示',
					    content: '余额预警设置成功',
						showCancel: false,
						success: function () {
							that.$util.navigateBack(that)
						}
					});
				}
			})
		},
		switchChange: function (e) {
			this.isWarning = e.target.value;
        },
		getCmpyWarningInfo(){
			const that = this;
			that.$util.networkRequest({
				url: "/Company/GetCmpyWarningInfo",
				success: function(res){
					that.isWarning = res.isWarning == 1?true:false; //是否预警1-是 0 - 否
					that.warningAmount = String(res.warningAmount); //预警金额
				}
			})
		}
	}
}
</script>
<style scoped>
.u-li{
	background-color: #FFFFFF;
	padding: 15px;
	margin-top: 10px;
	position: relative;
}
.switch-btn{
	position: absolute;
	top: 10px;
	right: 8px;
}
.input-amount{
	border-bottom: 1px solid #F7F7F7;
	margin-top: 12px;
	margin-bottom: 12px;
	font-size: 18px;
	padding-bottom: 6px;
	display: box;
	display: -webkit-box;
}
.input-amount input{
	width: calc(100% - 22px);
	width: -webkit-calc(100% - 22px);
	font-size: 18px;
}
.tips{
	color: #7B7B7B;
}
</style>
