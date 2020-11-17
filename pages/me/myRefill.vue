<template>
	<view>
		<view v-if="isShow==true">
			<navigator url="/pages/me/explain?type=1" class="head-right">充值说明</navigator>
			<view class="head-con">
				<text class="iconfont icon-weixin"></text>微信充值
			</view>
			<view class="con">
				<text class="small-title">充值金额</text>
				<view class="label-input">
					￥<input type="digit" v-model="money" />
				</view>
				<view class="all-amount right">
					可用余额<text class="num red">{{available}}</text>元</text>
				</view>
				<button @click="payment">充值</button>
			</view>
		</view>
		<view v-if="isShow==false" class="guide">
			<view class="title">请在微信端完成此操作</view>
			<view class="explain">请扫描下方二维码,关注 “仪商汇” 公众号,点击菜单栏【物流快运】,进入 “仪商汇快运” 平台,完成此操作。</view>
			<view class="pic">
				<image mode="widthFix" src="../../static/images/qrcode.jpg"></image>
				<text>仪商汇公众号</text>
			</view>
			<button @click="goBack" class="btn-default-css">返回</button>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			money: "",
			available: "",
			type: "",
			isShow: "-1"
		};
	},
	onLoad(options){
		let that = this;
		that.type = options.type;
		let prohibit = true;
		if(this.$util.IsPC()) {
			uni.setNavigationBarTitle({ title: "" });
			this.isShow = false;
			return false;
		}
		this.isShow = true;
		that.$util.networkRequest({
			url: "/Wallet/GetAmount",
			success: data => {
				that.available = data.available.toFixed(2);
			}
		});
	},
	methods: {
		payment: function(){
			if (parseFloat(this.money) <= 0 || this.money == ""){
				this.$util.showToast("充值金额不正确！");
				return false;
			}
			// #ifdef H5
				this.h5_Pay();
			// #endif
			// #ifdef MP-WEIXIN
				this.wx_Pay();
			// #endif
		},
		h5_Pay: function(){
			var data = {"wxpay": this.money, "type": this.type};
			uni.setStorage({key: "wxpay", data: JSON.stringify(data)});
			// let url='http://' + window.location.host + '/pages/wx/wxpay?money='+this.money;
			let url =
				"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
				this.wxappid +
				"&redirect_uri=" +
				encodeURIComponent('http://' + window.location.host + '/pages/wx/wxpay?money='+this.money) +
				"&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect";
			window.location.href = url;
		},
		wx_Pay: function(){
			let that = this;
			uni.showLoading({ title: "正在支付", mask: true });
			uni.login({
				provider: 'weixin',
				success: res => {
					that.$util.networkRequest({
						url: '/Wallet/Refill',
						method: 'POST',
						data: {
							"code": res.code,
							"refillType": 1,
							"amount": that.money
						},
						success(data) {
							wx.requestPayment({
								'appId': that.appId,
								'timeStamp': data.timestamp, //时间戳
								'nonceStr': data.nonceStr, //随机字符串
								'package': "prepay_id=" + data.prepay_id, //统一下单接口返回的 prepay_id 参数
								'signType': 'MD5',
								'paySign': data.paySign, //签名
								'success': function(res) {
									that.$util.showToast('支付成功');
									that.$util.navigateBack(that);
									// uni.switchTab({url: "/pages/index/index"});
								},
								'fail': function(res) {}
							});
						}
					});
				},
			});
		},
		goBack: function(){
			this.$util.navigateBack(this)
		}
	}
}
</script>
<style scoped>
@import '../../common/css/me/wallet.css';
</style>