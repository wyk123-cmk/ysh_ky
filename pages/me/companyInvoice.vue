<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<navigator url="/pages/me/cmpHistoricalInvoice" class="head-right">历史开票</navigator>
		<view v-if="total==0" class="none-data-list"><image src="../../static/images/none.svg"></image>暂无内容</view>
		<view v-else>
			<text class="tips">温馨提示：申请开具增值税专用发票开票金额需满1000元，如开票金额不足可累计进行开票！</text>
			<scroll-view class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
				<view class="list-call" v-for="(item, i) in invoiceData" :key="i">
					<checkbox-group class="checkbox-radio" @change="checkboxChange($event, item.amount, item.id)">
						<checkbox :value="String(item.id)" :checked="item.checked" />
					</checkbox-group>
					<view class="recharge">账户充值<text class="time">{{item.createTime}}</text></view>
					<text class="money">￥{{item.amount}}</text>
				</view>
			</scroll-view>
			<view class="invoice-footer">
				<checkbox-group class="checkbox-radio" @change="checkAllChange">
					<checkbox :checked="isCheckAll" />
					<text>全选</text>
				</checkbox-group>
				<button class="next-step" @click="nextStep()">下一步</button>
				<view class="amount">合计：<text>{{totalSum==0?'--':totalSum}}</text></view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			page: 1,
			limit: 10,
			total: 0,
			totalSum: 0,
			invoiceData: [],
			checkData: [],
			isCheckAll: false
		}
	},
	onShow(){
		this.showImage = getApp().globalData.isDiscountPopup;
		this.page = 1;
		this.invoiceData = [];
		this.checkData = [];
		this.total = 0;
		this.totalSum = 0;
		this.isCheckAll = false;
		this.getInvoice();
	},
	methods: {
		nextStep: function(){
			if(this.checkData.length == 0){
				uni.showToast({ title: "请选择需要开的发票订单", icon: 'none' });
				return false;
			}
			this.$store.state.cmpInvoiceData = {
				mastCode: this.checkData,
				totalSum: this.totalSum
			}
			uni.navigateTo({ url: '/pages/me/cmpInvoiceSubmit' });
		},
		checkboxChange: function(e, _price, _code){
			this.invoiceData.filter(item => {
				if(item.id == _code){
					item.checked = item.checked == undefined?true: false;
				}
			});
			if(e.detail.value.length > 0){
				this.checkData.push(_code)
				this.totalSum = this.moneyFormat(parseFloat(_price)+parseFloat(this.totalSum));
			}else{
				this.totalSum = this.moneyFormat(parseFloat(this.totalSum) - parseFloat(_price));
				this.checkData = this.checkData.filter(el => {
					return el != _code;
				});
			}
			if(this.checkData.length == this.invoiceData.length) this.isCheckAll = true;
			else this.isCheckAll = false;
		},
		checkAllChange: function(e){
			const that = this;
			that.isCheckAll = !that.isCheckAll;
			that.totalSum = 0;
			that.checkData = [];
			that.invoiceData.filter(item => {
				if(that.isCheckAll){
					that.$set(item,'checked',true);
					that.totalSum = that.moneyFormat(parseFloat(item.amount)+parseFloat(that.totalSum));
					that.checkData.push(item.id)
				}else{
					that.$set(item,'checked',false);
					that.checkData = [];
				}
			});
		},
		scrolltolower:  function() {
			if(Math.ceil(this.total / this.limit) >= this.page){
				this.getInvoice();
			}
		},
		getInvoice(){
			const that = this;
			uni.showLoading({ title: '加载中...' });
			that.$util.networkRequest({
				url: "/CompanyInvoice/GetRechargeForInvoiceList",
				data: {
					page: that.page,
					limit: that.limit
				},
				success: function(res){
					let total = res.total;
					if(total == 0 || res.list.length == 0) return false;
					res.list.filter(item => {
						if(item.createTime != null && item.createTime != ""){
							item.createTime = that.$util.formatDate.format(item.createTime,"MM-dd hh:mm");
						}
						item.amount = item.amount.toFixed(2);
					});
					that.page++;
					that.total = total;
					that.invoiceData = that.invoiceData.concat(res.list);
				}
			})
		},
		moneyFormat(val){
			if(!this.$util.isNotEmpty(val)){
				return "0.00";
			}
			var value=Math.round(parseFloat(val)*100)/100;
			var xsd=value.toString().split(".");
			if(xsd.length == 1){
				value=value.toString()+".00";
				return value;
			}
			if(xsd.length>1){
				if(xsd[1].length<2) value=value.toString()+"0";
				return value;
			}
		}
	}
}
</script>
<style scoped>
/* #ifdef MP-WEIXIN */
.head-right{
	top: 25px;
}
/* #endif */
.tips{
	font-size: 12px;
	color: #999;
	padding: 4px 15px;
	display: block;
	line-height: 16px;
}
.list-call{
	background-color: #FFFFFF;
	display: box;
	display: -webkit-box;
	padding: 10px 0;
	border-bottom: 1px solid #EEEEEE;
	position: relative;
}
.list-call .recharge text{
	display: block;
	color: #999;
	font-size: 12px;
	margin-top: 3px;
}
.list-call .money{
	position: absolute;
	top: 18px;
	right: 15px;
	color: #4285f4;
	font-size: 18px;
	font-weight: bold;
}
.checkbox-radio{
	color: #999999;
	padding: 10px;
	line-height: 14px;
	display: flex;
	display: -webkit-flex;
	align-items: center;
}
.scroll-wrapper{
	position: absolute;
	top: 40px;
	left: 0;
	right: 0;
	bottom: 60px;
}
.invoice-footer{
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #FFFFFF;
	height: 60px;
	line-height: 60px;
}
.invoice-footer .checkbox-radio{
	color: #333333;
	float: left;
	border: 0;
	margin-top: 8px;
	font-size: 14px;
}
.amount{
	float: right;
	padding-right: 30px;
}
.amount text{
	color: #FF0004;
}
.next-step{
	float: right;
	background-color: #4285F4;
	color: #FFFFFF;
	border-radius: 0;
	padding: 0 20px;
	line-height: 60px;
}
</style>
