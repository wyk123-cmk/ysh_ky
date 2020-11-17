<template>
	<view>
		<page-imges :show="showImage"></page-imges>
		<view class="content">
			<view class="title_bj">请输入物品实际价值</view>
			<view class="price">
				<label>声明价值</label>
				<label><input type="number" :placeholder="placeholder" @input="amountInput" v-model="amount" />元</label>
			</view>
			<text class="note" v-if="note">注:保费不能超过{{upperAmount}}元</text>
			<view class="money">预估费用：<label class="lab_yg">¥{{bjmoney}}</label></view>
			<view class="explain">
				<text>说明</text>
				<view style="color: #999999;" v-html="contents"></view>
			</view>
			<view class="xiye">
				<checkbox class="orange" :checked="checkedAgree" @click="checkedAgree=!checkedAgree">我已阅读并同意保险条款</checkbox>
			</view>
		</view>
		<view class="btn">
			<text @click="btnNoPrice" v-if="isPrice">不保价</text>
			<text class="confirm" @click="btnOkPrice" v-bind:class="{ width: !isPrice}">确认保价</text>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				type: "",
				code: "",
				mark: "", //标示1--整车寄件
				amount: "",
				bjmoney: "0.00",
				upperAmount: 0,
				contents: "",
				isPrice: false,
				note: false,
				checkedAgree: false,
				placeholder: "输入您的保价金额",
			}
		},
		onLoad(options) {
			const that = this;
			that.showImage = getApp().globalData.isDiscountPopup;
			that.type = options.type;
			that.code = options.code;
			that.mark = options.mark;
			that.upperAmount = options.upperAmount;
			// that.placeholder = "1-"+that.upperAmount+"整数";
			that.isPrice = that.type == "small" ? true : false;
			//获取说明
			let _url = "/Price/GetInsuranceAgree";
			let param = {
					companyCode: that.code,
					expressType: that.type
				}
			if(that.mark == 1){
				_url = "/ExpressCar/GetInsuranceAgree";
				param = {companyCode: that.code}
			}
			that.$util.networkRequest({
				url: _url,
				data: param,
				success: function(res) {
					that.contents = res;
				}
			});
			let data = this.$store.state.expressDeliveryInfo.insuredPrice;
			if (JSON.stringify(data) != "{}") {
				that.amount = data.amount;
				that.bjmoney = data.price.toFixed(2);
			}
		},
		methods: {
			//不保价
			btnNoPrice: function() {
				this.$store.state.expressDeliveryInfo.insuredPrice = {
					price: 0,
					amount: "不保价"
				}
				this.$util.navigateBack(this);
			},
			//确认保价
			btnOkPrice: function() {
				if (!this.$util.isNotEmpty(this.amount)) {
					this.$util.showToast("请填写保价金额");
					return false;
				}
				if(this.type == "big" && Number(this.amount) == 0){
					this.$util.showToast("请填写保价金额");
					return false;
				}
				if (parseFloat(this.amount) > parseFloat(this.upperAmount)) {
					this.$util.showToast("保费不能超过￥" + this.upperAmount);
					return false;
				}
				if (!this.checkedAgree) {
					this.$util.showToast("请勾选同意保险条款");
					return false;
				}
				this.$store.state.expressDeliveryInfo.insuredPrice = {
					price: this.bjmoney,
					amount: this.amount
				}
				this.$util.navigateBack(this);
			},
			amountInput: function(e) {
				let val = e.detail.value;
				if (val != "") {
					if (parseFloat(val) > this.upperAmount) {
						this.note = true;
					} else {
						this.note = false;
						this.setPrice(val);
					}
				} else {
					this.note = false;
					this.bjmoney = 0.00;
				}
			},
			setPrice: function(val) {
				const that = this;
				let _url = "/Price/InsurancePrice";
				let _param = {
					Amount: val,
					CompanyCode: that.code,
					ExpressType: that.type
				}
				if(that.mark == 1){
					_url = "/ExpressCar/InsurancePrice";
					_param = {
						companyCode: that.code,
						amount: val
					}
				}
				that.$util.networkRequest({
					url: _url,
					method: "POST",
					data: _param,
					success: function(res) {
						that.bjmoney = res.toFixed(2);
					}
				});
			}
		}
	}
</script>
<style scoped>
	.content {
		padding: 15px;
		border-top: 1px solid #EEEEEE;
		overflow-y: scroll;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 60px;
	}

	.price {
		display: flex;
		line-height: 40px;
	}
	
	.price label:last-child{
		border: 1px solid #EEEEEE;
		display: box;
		display: -webkit-box;
		margin-left: 20px;
		width: calc(100% - 80px);
		width: -webkit-calc(100% - 80px);
		width: -moz-calc(100% - 80px);
	}

	.price label input {
		height: 40px;
		line-height: 40px;
		margin-right: 5px;
		padding-left: 10px;
		width: calc(100% - 35px);
	}

	.money,
	.note {
		display: block;
		text-align: right;
	}

	.note {
		padding-top: 3px;
		font-size: 12px;
		color: #FF0000;
	}

	.money {
		padding: 12px 4px;
	}

	.btn {
		height: 60px;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		display: -webkit-flex;
		align-items: center;
		justify-content: center;
	}

	.title_bj {
		width: 100%;
		height: 35px;
		line-height: 35px;
		text-align: center;
		color: #333;
		padding: 5px 0px 15px 0px;
		font-weight: bold;
		font-size: 17px;
	}

	.btn text {
		color: #4285F4;
		border: 1px solid #4285F4;
		width: 30%;
		text-align: center;
		display: block;
		border-radius: 20px;
		line-height: 38px;
		margin: 0 5%;
	}

	.lab_yg {
		color: #FF0000;
		font-size: 15px;
		font-weight: bold;
	}

	.btn text.confirm {
		background-color: #4285F4;
		color: #FFFFFF;
	}

	.orange {
		color: orange;

	}

	.btn text.width {
		width: 90%;
	}

	.ds {}
</style>