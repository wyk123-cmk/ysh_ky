<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<navigator url="/pages/me/historicalInvoice" class="head-right">历史开票</navigator>
		<view v-if="total==0" class="none-data-list"><image src="../../static/images/none.svg"></image>暂无内容</view>
		<view v-else>
			<scroll-view class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
				<view class="invoice-item-list" v-for="(item, i) in invoiceData" :key="i">
					<checkbox-group class="checkbox-radio" @change="checkboxChange($event, item.price, item.mastCode)">
						<checkbox :value="item.mastCode" :checked="item.checked" />
						<text>运单号：{{item.expressCode}}</text>
					</checkbox-group>
					<view class="transport-o" @click="nextStep(i)">
						<view class="express">
							<text class="city">{{item.expressFrom.areaInfo.city}}</text>
							<text>{{item.expressFrom.name}}</text>
						</view>
						<view class="status">
							<image mode="widthFix" src="../../static/images/cjt.svg"></image>
						</view>
						<view class="express">
							<text class="city">{{item.expressTo.areaInfo.city}}</text>
							<text>{{item.expressTo.name}}</text>
						</view>
						<view class="price">￥{{item.price}}</view>
					</view>
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
			limit: 5,
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
		nextStep: function(key){
			let _mastCode = [];
			let _totalSum = 0;
			if(key == undefined){
				if(this.checkData.length == 0){
					uni.showToast({ title: "请选择需要开的发票订单", icon: 'none' });
					return false;
				}
				_mastCode = this.checkData;
				_totalSum = this.totalSum;
			}else{
				_mastCode = [this.invoiceData[key].mastCode]
				_totalSum = this.invoiceData[key].price
			}
			this.$store.state.invoiceInfo = {
				mastCode: _mastCode,
				totalSum: _totalSum
			}
			uni.navigateTo({ url: '/pages/me/invoiceSubmit' });
		},
		checkboxChange: function(e, _price, _code){
			this.invoiceData.filter(item => {
				if(item.mastCode == _code){
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
			this.isCheckAll = !this.isCheckAll;
			this.totalSum = 0;
			this.checkData = [];
			for (var i = 0, lenI = this.invoiceData.length; i < lenI; ++i) {
				const item = this.invoiceData[i];
				if(this.isCheckAll){
					this.$set(item,'checked',true);
					this.totalSum = this.moneyFormat(parseFloat(item.price)+parseFloat(this.totalSum));
					this.checkData.push(item.mastCode)
				}else{
					item.checked = false;
				}
			}
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
				url: "/Invoice/GetExpressList",
				data: {
					page: that.page,
					limit: that.limit
				},
				success: function(res){
					let total = res.total;
					if(total == 0 || res.list.length == 0) return false;
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
.invoice-item-list{
	background-color: #FFFFFF;
	margin-top: 8px;
}
.checkbox-radio{
	color: #999999;
	border-bottom: 1px solid #EEEEEE;
	padding: 10px;
	line-height: 14px;
	display: flex;
	display: -webkit-flex;
	align-items: center;
}
.invoice-item-list .transport-o{
	align-items: center;
}
.invoice-item-list .transport-o .price{
	color: #4285f4;
	font-size: 22px;
	border-left: 1px dashed #EEEEEE;
	padding: 0 15px;
}
.scroll-wrapper{
	position: absolute;
	top: 40px;
	left: 0;
	right: 0;
	bottom: 60px;
	padding-bottom: 10px;
}
/* #ifdef H5 */
.scroll-wrapper{
	top: 0;
}
/* #endif */
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
