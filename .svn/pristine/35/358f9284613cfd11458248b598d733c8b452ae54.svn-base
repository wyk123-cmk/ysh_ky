<template>
	<view class="wallet">
		<page-imges :show="showImage"></page-imges>
		<navigator url="/pages/me/myWalletDetail" class="head-right">钱包明细</navigator>
		<text class="iconfont icon-yue"></text>
		我的钱包
		<view class="amount">￥<text>{{amountInt}}</text>{{amountYushu}}</view>
		<view class="qbmx">
			<label>￥{{available}}<text>可用零钱</text></label>|
			<label>￥{{frozen}}<text>冻结资金</text></label>
		</view>
		<view class="wallet-btn">
			<button @click="btnWallet(1)">提现</button>
			<button @click="btnWallet(2)" class="cz_btn">充值</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			redirect: "",
			amountInt: 0,
			amountYushu: ".00",
			frozen: "",
			available: ""
		};
	},
	onLoad() {
		this.showImage = getApp().globalData.isDiscountPopup;
		this.getMyWalletAmount();
	},
	onBackPress(event) {
		console.log(event.from)
	},
	methods: {
		getMyWalletAmount() {
			const that = this;
			this.$util.networkRequest({
				url: "/Wallet/GetAmount",
				success: data => {
					if (data.amount > 0) {
						// that.$store.state.myAmount = data.available.toFixed(2);
						let amount = data.amount.toString().split('.');
						that.amountInt = amount[0];
						if (amount.length >= 2) {
							that.amountYushu = "." + amount[1];
						}
					}
					that.frozen = data.frozen.toFixed(2);
					that.available = data.available.toFixed(2);
				}
			})
		},
		btnWallet(val) {
			if (val == 1) {
				uni.navigateTo({url: "/pages/me/myCash?amount="+this.available});
			} else {
				uni.navigateTo({url: "/pages/me/myRefill"})
			}
		}
	}
}
</script>
<style scoped>
.wallet{
	margin-top: 30px;
	display: flex;
	flex-flow: column wrap;
	align-items: center;
}
.wallet .iconfont{
	color: #E8955D;
	font-size: 40px;
	display: block;
}
.wallet .amount{
	margin-top: 20px;
}
.wallet .amount text{
	font-size: 28px;
	font-weight: bold;
}
.qbmx {
	display: flex;
	flex-flow: row;
	align-items: center;
	line-height: 22px;
}
.qbmx label {
	display: flex;
	flex-flow: column;
	align-items: center;
	margin-top: 15px;
	padding: 0 15px;
}
.qbmx label text {
	font-size: 12px;
	color: #999;
}
.wallet-btn{
	padding: 0 15px;
	display: flex;
	flex-flow: nowrap row;
	justify-content: space-between;
	position: fixed;
	right: 0;
	left: 0;
	bottom: 20px;
}
.wallet-btn button{
	width: 45%;
	border-radius: 40px;
	height: 40px;
	line-height: 38px;
	display: block;
	text-align: center;
	border: 1px solid #4285F4;
	color: #4285F4;
	background-color: #FFFFFF;
}
.wallet-btn button.cz_btn{
	background-color: #4285f4;
	color: #FFFFFF;
}
</style>
