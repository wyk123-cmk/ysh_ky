<template>
	<view style="text-align: center;margin-top: 20%;">
		正在授权登录跳转,请稍后...
		<navigator url="/pages/index/index" open-type="switchTab" class="btn">去首页</navigator>
	</view>
</template>
<script>
export default {
	data() {
		return {
			accountCode: "",
			appKey: "",
			sign: "",
			timestamp: "",
			phone: ""
		}
	},
	onLoad(options) {
		const that = this;
		uni.request({
			url: that.apiUrl + "/OpenService/AccountLoginFlag",
			method: "POST",
			header: {
				APPKEY: options.appKey,
				SIGN: options.sign,
				TIMESTAMP: options.timestamp,
				APPID: that.appId,
			},
			data: {phone: options.phone},
			success: res => {
				let data = res.data;
				if(data.errCode == 200){
					if(data.data.code == 200){
						uni.setStorage({key: 'token', data: data.data.data});
						uni.switchTab({ url: "/pages/index/index" });
					}else{
						uni.showModal({
							title: '提示',
							content: data.data.message,
							showCancel: false
						});
					}
				}else{
					uni.showModal({
						title: '提示',
						content: data.message,
						showCancel: false
					});
				}
			},
			fail: (err) => {
			}
		})
	}
}
</script>
<style scoped>
.btn{
	background-color: #4285F4;
	color: #FFFFFF;
	width: 100px;
	padding: 8px 0;
	border-radius: 20px;
	margin: 100px auto 0;
}
</style>