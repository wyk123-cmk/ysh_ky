<template>
	<view>
		<view class="head-con">
			<text class="iconfont icon-weixin"></text>
			微信
			<text class="tips">1~2个工作日到账</text>
		</view>
		<view class="con">
			<text class="small-title">提现金额</text>
			<view class="label-input">
				￥<input type="digit" v-model="cashMoney" @input="moneyInput" />
			</view>
			<view class="all-amount">
				当前账户可用余额<text class="num">{{amount}}</text>元，<text class="all" @click="btnCashAll">全部提现</text>
			</view>
			<text class="note">（注：当日累计金额超过5000，到账时间会适当延迟）</text>
			<button @click="btnCash">提现</button>
		</view>
		<view v-if="isTips">
			<view class="v-model"></view>
			<view class="popup-tips">
				<view class="con">
					<text>为了您的资金安全,请输入短信验证码校验！</text>
					<input type="number" v-model="code" placeholder="请输入验证码" />
				</view>
				<view class="btn">
					<button @click="confirm">确定</button>
					<button @click="isTips=false">取消</button>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			amount: "0.00",
			cashMoney: "",
			code: "",
			isTips: false
		};
	},
	onLoad(options){
		this.amount = options.amount;
	},
	methods: {
		btnCashAll() {
			if (parseFloat(this.amount) > 5000) {
				this.cashMoney = 5000;
			}else{
				this.cashMoney = parseFloat(this.amount) == 0?'':this.amount;
			}
		},
		moneyInput(e){
			let val = e.detail.value;
			if(parseFloat(val) > 5000){
				this.cashMoney = 5000;
				this.$util.showToast("单次提现不超过5000！");
			}else{
				this.cashMoney = val;
			}
		},
		btnCash(){
			const that = this;
			if(parseFloat(this.cashMoney).toFixed(2) <= 0 || !this.$util.isNotEmpty(this.cashMoney)){
				that.$util.showToast("提现金额不正确！");
				return false;
			}
			uni.showLoading({ title: "请稍后...", mask: true });
			var parm = {
				"cash": that.cashMoney,
				"verityCode": that.code
			}
			that.$util.networkRequest({
				url: "/Wallet/Cash",
				method: "POST",
				data: parm,
				success: data => {
					that.code = "";
					if(data){
						uni.showModal({
							title: '提示',
							content: '您的提现已提交审核',
							showCancel: false,
							success: function () {
								that.$util.navigateBack(that)
							}
						});
					}
				},
				error: data => {
					that.code = "";
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
					else if(data.errCode == 2006){
						that.isTips = true;
					}
				}
			})
		},
		confirm: function(){
			const that = this;
			if(!that.$util.isNotEmpty(that.code)){
				that.$util.showToast("请输入验证码！");
				return false;
			}
			that.btnCash();
		}
	}
}
</script>
<style scoped>
@import '../../common/css/me/wallet.css';
</style>
