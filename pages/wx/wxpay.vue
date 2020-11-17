<template>
	<view>
		<text>正在支付</text>
	</view>
</template>
<script>
export default {
	data() {
		return {
			money: "",
			code: "",
			type: ""
		}
	},
	onLoad(options) {
		let data = JSON.parse(uni.getStorageSync('wxpay'));
		this.money = data.wxpay;
		this.type = data.type==undefined?'':data.type;
		// this.money = options.wxpay;
		// this.type = options.type==undefined?"":options.type;
		if(options.code != undefined) {
			this.code = options.code;
			this.payment();
		}else{
			this.$util.showToast("获取支付信息失败，请重试");
			setTimeout(() => {
				this.$util.navigateBack(this);
			}, 500);
		}
	},
	methods: {
		payment() {
			let _this = this;
			let params = { amount: _this.money, code: _this.code };
			_this.$util.networkRequest({
				url: '/Wallet/Refill',
				method: 'POST',
				data: { 
					amount: _this.money, 
					code: _this.code,
					refillType: 0,
				},
				success(data) {
					_this.$util._H5_chooseWXPay({
						timestamp: data.timestamp, // 支付签名时间戳
						nonceStr: data.nonceStr, // 支付签名随机串，不长于32 位
						package: "prepay_id=" + data.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
						signType: "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						paySign: data.paySign, // 支付签名
						success: function(res) {
							//支付成功
							let _url = "";
							if(_this.type == "big"){
								_url = "/pages/index/expressDelivery?type=big";
							} else if(_this.type == "small"){
								_url = "/pages/index/expressDelivery?type=small";
							} else if(_this.type == "batch"){
								_url = "/pages/batchSend/index";
							} else if(_this.type.indexOf('car') != -1){
								let mastCode = _this.type.replace('car','');
								_url = "/pages/vehicleMail/details?mastCode="+mastCode;
							}
							else{
								_url =  "/pages/me/userInfo";
								// uni.switchTab({url: "/pages/me/userInfo"});
								// return false;
							}
							window.location.href = _url;
							// uni.redirectTo({ url: _url });
						},
						cancel: function(res) {
							_this.$util.navigateBack(_this);
						}
					});
				}
			})
			
		}
	}
}
</script>
<style scoped>
text{
	font-size: 16px;
	display: block;
	text-align: center;
	margin-top: 20px;
}
</style>
