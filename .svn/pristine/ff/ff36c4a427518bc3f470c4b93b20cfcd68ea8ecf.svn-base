<template>
<view>
	<page-imges :show="showImage"></page-imges>
	<view class="cost">
		<text>声明价值</text>
		<input type="number" placeholder="输入物品实际价值" v-model="amount" @input="inputAmount" />
	</view>
	<view class="type-con">
		<text>产品类型</text>
		<view class="type-item-list" @click="goChecke(i, item)" :class="actvieIndex==i?'active':''" v-for="(item, i) in platformList" :key="i">
			<view class="company">
				<view>{{item.companyName}}<text>费率 {{item.insuranceText}}</text></view>
				<view v-if="code!=item.companyCode" class="note">会收取承运公司最低保费,预估费用不含该保费</view>
			</view>
			<view class="price">
				<text class="error" v-if="item.isError">(已达上线,无法投保) ¥--</text>
				<text v-else>¥{{item.money}}</text>
				<text class="no-line" v-if="item.money!=item.markAmount">市场价 ¥{{item.markAmount}}</text>
			</view>
		</view>
	</view>
	<view class="explain" v-if="actvieIndex!='-1'">
		<text>保价说明</text>
		<view v-html="platformList[actvieIndex].insuranceMemo"></view>
	</view>
	<view class="footer">
		<view>
			预估: ¥<text>{{checkeMoney}}</text>
		</view>
		<button @click="btnOkPrice">我要投保</button>
		<button @click="btnNoPrice" class="no" v-if="isPrice">不报价</button>
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
				isPrice: false,
				amount: "",
				checkeMoney: "0.00",
				platformList: [],
				actvieIndex: "-1",
				explainHtml: "",
				compayData: []
			}
		},
		onLoad(options) {
			const that = this;
			that.type = options.type;
			that.code = options.code;
			that.mark = options.mark;
			that.isPrice = that.type == "small" ? true : false;
			that.showImage = getApp().globalData.isDiscountPopup;
			let companyTxt = "";
			if(that.code == "db001") companyTxt = "德邦保价";
			else if(that.code == "sf001") companyTxt = "顺丰保价";
			else if(that.code == "ky001") companyTxt = "跨越保价";
			let _companyPrice = JSON.parse(uni.getStorageSync("companyPrice"));
			that.compayData = [
				{
					companyCode: that.code,
					companyName: companyTxt,
					insuranceUpper: _companyPrice.upperAmount,
					insuranceMemo: "",
					markAmount: "--",
					money: "--",
					insuranceText: _companyPrice.insuranceText,
					isError: false
				}
			]
			if(that.code != "sf001"){
				that.platformList = that.compayData;
			}
			that.getList();
		},
		methods: {
			//不保价
			btnNoPrice: function(){
				this.$store.state.expressDeliveryInfo.insuredPrice = {
					price: 0,
					amount: "不保价",
					code: "",
					agreementContent: ""
				}
				this.$util.navigateBack(this);
				uni.removeStorageSync('insuredPrice');
			},
			//确认保价
			btnOkPrice: function(){
				let i = this.actvieIndex;
				if( i == "-1"){
					this.$util.showToast("请选择产品类型");
					return false;
				}
				let param = {
					amount: this.amount,
					price: this.checkeMoney,
					code: this.platformList[i].companyCode
				}
				if (!this.$util.isNotEmpty(param.amount)) {
					this.$util.showToast("请填写保价金额");
					return false;
				}
				//保额最低1000元，最低收费3元，费率为3‰
				if(param.code!=this.code && param.amount < 1000){
					this.$util.showToast("第三方保险最低金额限制1000元,最低收费3元,费率为3‰");
					return false;
				}
				uni.setStorage({key: 'insuredPrice', data: JSON.stringify(param)});
				this.$store.state.expressDeliveryInfo.insuredPrice = param;
				this.$util.navigateBack(this);
			},
			goChecke: function(i, item){
				if(this.amount > item.insuranceUpper) {
					return false;
				}
				this.actvieIndex = i;
				this.checkeMoney = item.money;
			},
			//输入金额
			inputAmount: function(e){
				let val = e.detail.value;
				let companyCodeList = [];
				this.amount = val;
				(this.platformList).forEach(item => {
					if(val > item.insuranceUpper){
						item.isError = true;
						this.actvieIndex = "-1";
						this.checkeMoney = "0.00";
					}else{
						companyCodeList.push(item.companyCode)
						item.isError = false;
					}
				})
				if(companyCodeList.length != 0){
					this.setPrice(companyCodeList);
				}
			},
			//设置预估费用
			setPrice: function(arr){
				let that = this;
				that.$util.networkRequest({
					url: "/Price/InsuranceNewPrice",
					method: "POST",
					data: {
						companyCodeList: arr, //保价价值
						amount: that.amount, //物流公司编码
						expressType: that.type
					},
					success: function(res) {
						if(res == null) return false;
						for(var i = 0; i < res.length; i++){
							(that.platformList).forEach(item => {
								if(item.companyCode == res[i].companyCode){
									item.money = res[i].ratioAmount; //折扣价
									item.markAmount = res[i].markAmount; //市场价 
								}
							})
						}
					}
				});
			},
			getList: function(){
				let that = this;
				uni.showLoading({
					title: "数据加载..."
				})
				that.$util.networkRequest({
					url: "/InsuranceCompany/GetList",
					success: function(res) {
						if(res.length == 0) return false;
						res.forEach(item => {
							item["markAmount"] = "--";
							item["money"] = "--";
							item["isError"] = false;
						});
						that.platformList = that.platformList.concat(res);
						if(that.code == "sf001"){
							that.platformList = that.platformList.concat(that.compayData);
						}
						let storage = uni.getStorageSync("insuredPrice");
						if(storage != "" && storage != undefined){
							let index = 0;
							let companyCodeList = [];
							storage = JSON.parse(storage);
							that.amount = storage.amount;
							(that.platformList).forEach((item, i) => {
								if(storage.code == item.companyCode){
									index = i
								}
								companyCodeList.push(item.companyCode)
							});
							that.setPrice(companyCodeList);
							that.actvieIndex = index;
							that.checkeMoney = storage.price;
						}
						that.getInsuranceAgree();
					}
				});
			},
			getInsuranceAgree(){
				let that = this;
				that.$util.networkRequest({
					url: "/Price/GetInsuranceAgree",
					data: {
						companyCode: that.code,
						expressType: that.type
					},
					success: function(res) {
						(that.platformList).forEach(item => {
							if(that.code==item.companyCode){
								item.insuranceMemo = res;
							}
							
						});
					}
				});
			}
		}
	}
</script>
<style scoped>
.cost{
	margin: 20px 15px;
	display: flex;
	align-items: center;
	line-height: 35px;
}
.cost input{
	width: calc(100% - 90px);
	height: 35px;
	border-radius: 3px;
	margin-left: 10px;
	padding: 0 10px;
	border: 1px solid #F1F1F1;
}
.type-con{
	margin: 0 15px;
}
.type-item-list {
	border: 1px solid #eee;
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 40px;
	padding: 13px 15px;
	border-radius: 4px;
	margin: 10px 0;
	position: relative;
}
.type-item-list.active{
	background: url(../../static/images/icon-active.png) no-repeat bottom right;
	background-size: 28px;
	border: 1px solid #0f84f3;
}
.type-item-list .company{
	width: 68%;
	line-height: 20px;
}
.type-item-list .company text{
	color: #999999;
	font-size: 13px;
	margin-left: 10px;
}
.type-item-list .note{
	font-size: 12px;
	color: #F09759;
	line-height: 16px;
	margin-top: 10px;
}
.type-item-list .price{
	position: absolute;
	top: 50%;
	right: 15px;
	transform: translate3d(0, -50%, 0);
}
.type-item-list .price text{
	display: block;
	font-size: 20px;
	color: #FF0000;
	text-align: right;
	margin-bottom: 8px;
	height: 20px;
}
.type-item-list .price text.error{
	font-size: 13px;
}
.type-item-list .price text.no-line{
	font-size: 12px;
	color: #999;
	text-decoration: line-through;
}
.explain{
	margin: 20px 15px;
	padding-bottom: 80px;
}
.explain > view{
	padding: 10px;
	background-color: #F7F9FF;
	border-radius: 4px;
	margin-top: 10px;
}
.footer{
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #FFFFFF;
}
.footer{
	border-top: 1px solid #F5F5F5;
	padding: 15px;
}
.footer view{
	float: left;
	color: #FF0000;
	height: 40px;
	line-height: 40px;
}
.footer view text{
	font-size: 22px;
	padding-left: 3px;
}
.footer button{
	float: right;
	background-color: #4285F4;
	border: 1px solid #4285F4;
	width: 90px;
	line-height: 40px;
	color: #FFFFFF;
	border-radius: 3px;
	margin-left: 10px;
}
.footer button.no{
	background-color: #FFFFFF;
	color: #4285F4;
}
</style>

