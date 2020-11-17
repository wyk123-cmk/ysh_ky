<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<text class="tips">设置密码前需要验证您的身份信息</text>
		<form class="pay-form">
			<label>
				<view class="code-btn">
					<text v-if="!isGetCode" @click="sendCode">获取验证码</text>
					<text v-else>{{codeTime}} s</text>
				</view>
				<input type="number" placeholder="请输入验证码" v-model="code" />
			</label>
			<label>
				<input type="password" placeholder="请输入支付密码" v-model="userPass" />
			</label>
			<button class="btn-default-css" @click="btnSubmit">确定</button>
		</form>
	</view>
</template>
<script>
export default {
	data() {
		return {
			code: "",
			userPass: "",
			codeTime: 60,
			isGetCode: false
		}
	},
	onLoad(){
		this.showImage = getApp().globalData.isDiscountPopup;
	},
	methods: {
		sendCode: function(){
			const that = this;
			that.$util.networkRequest({
				url: "/Company/SendCode",
				method: "POST",
				success: res => {
					if(res){
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
		btnSubmit: function(){
			const that = this;
			if (!this.$util.isNotEmpty(that.code)) {
				that.$util.showToast("验证码不能为空");
				return false;
			}
			if (!this.$util.isNotEmpty(that.userPass)) {
				that.$util.showToast("密码不能为空");
				return false;
			}
			let params = {
				payPassWord: this.userPass,
				verificationCode: this.code
			};
			that.$util.networkRequest({
				url: "/Company/SetPassword",
				method: "POST",
				data: params,
				success: res => {
					if(res){
						uni.showModal({
						    title: '提示',
						    content: '支付密码设置成功!',
							showCancel: false,
							success: function () {
								that.$util.navigateBack(that)
							}
						});
					}
				}
			})
		},
	}
}
</script>
<style scoped>
.tips{
	color: #999999;
	font-size: 12px;
	padding: 10px 15px;
	display: block;
}
.pay-form label{
	background-color: #FFFFFF;
	display: block;
	padding: 12px 15px;
	line-height: 22px;
}
.pay-form label + label{
    border-top: 1px solid #f7f7f7;
}
.pay-form label input{
	width: 70%;
}
.pay-form .code-btn {
	float: right;
	color: #666;
}
</style>
