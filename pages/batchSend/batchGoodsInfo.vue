<template>
	<view class="page-bg" style="background-color: #FFFFFF;">
		<page-imges :show="showImage"></page-imges>
		<view class="form-item-list goods-title">
			物品信息
			<view>
				<text class="note">本次所寄物品信息都相同</text>
				<switch class="switch-btn" :checked="isWP" color="#4285F4" @change="switchWP" />
			</view>
		</view>
		<view class="form-item-list row">
			包裹名称
			<input type="text" placeholder="输入包裹名称" v-model="goodName" @input="goodNameInput" />
		</view>
		<view v-if="goodsNameList.length != 0">
			<view class="v-model"></view>
			<view class="good-name-list">
				<text v-for="(item, i) in goodsNameList" :key="i" @click="btnGetGoodName(item.goodsName)">{{item.goodsName}}</text>
			</view>
		</view>
		<view class="form-item-list row column-r">
			包裹类型
			<picker class="picker-box" :range="stdmodeArray" @change="stdmodeChange">
				{{goodType}}
				<text class="iconfont icon--right-jian"></text>
			</picker>
		</view>
		<view class="form-item-list row column-r">
			包裹材质
			<picker class="picker-box" :range="materialArray" @change="materialChange">
				{{materialTxt==""?"纸、纤、木箱等":materialTxt}}
				<text class="iconfont icon--right-jian"></text>
			</picker>
		</view>
		<view class="form-item-list goods-title">
			重量体积
			<view>
				<text class="note">本次所寄物品重量体积都相同</text>
				<switch class="switch-btn" :checked="isWeight" color="#4285F4" @change="switchWeight" />
			</view>
		</view>
		<view class="form-item-list row column-r">
			寄件数量
			<view class="compute row">
				<text class="subtract" @click="computeNum(0)">-</text>
				<input class="num" type="number" v-model="txtnum" />
				<text class="add" @click="computeNum(1)">+</text>
			</view>
		</view>
		<view class="form-item-list predict row column-r">
			<view>
				预估重量<text class="red">（必填）</text>
				<text class="note">最终重量以快递员核算为准</text>
			</view>
			<view class="compute row">
				<text @click="computeWeight(0)">-</text>
				<input class="num" type="number" v-model="txtweight" />kg
				<text class="add" @click="computeWeight(1)">+</text>
			</view>
		</view>
		<view class="form-item-list row column-r-t">
			体积填写
			<view>
				<view class="volume">
					<input type="number" placeholder="长" v-model="txtLong" />
					<text class="unit">cm</text>
					<text class="f-h">*</text>
					<input type="number" placeholder="宽" v-model="txtWidth" />
					<text class="unit">cm</text>
					<text class="f-h">*</text>
					<input type="number" placeholder="高" v-model="txtheight" />
					<text class="unit">cm</text>
				</view>
				<view class="volume total">
					总体积：
					<input type="digit" placeholder="0.000" v-model="volume" />
					<text class="unit">m³</text>
				</view>
			</view>
		</view>
		<view class="form-item-list goods-title">
			保价费用
			<view>
				<text class="note">本次所寄物品保价都相同</text>
				<switch class="switch-btn" :checked="isMoney" color="#4285F4" @change="switchMoney" />
			</view>
		</view>
		<view class="form-item-list row practical column-r">
			声明价值
			<view class="row money-num">
				<input type="text":placeholder="placeholder" @input="amountInput" v-model="amount" />
				<text>元</text>
			</view>
		</view>
		<view class="cost">预估费用：{{bjmoney}}元</view>
		<button class="btn-default-css" @click="btnSumit">确定</button>
	</view>
</template>
<script>
export default {
	data() {
		return {
			key: 0,
			upperAmount: 0,
			code: "",
			goodName: "",
			goodsNameList: [],
			stdmodeArray: ["仪器整机","文件","仪器设备","试剂耗材","化玻设备","实验家具","其他"],
			materialArray: ['纸', '纤', '木箱', '木架', '托膜', '托木'],
			goodType: "",
			materialTxt: "",
			txtheight: "",
			txtWidth: "",
			txtLong: "",
			txtnum: 1,
			txtweight: "",
			volume: "",
			amount: "",
			bjmoney: 0,
			placeholder: "1-500000整数",
			isWarning: false,
			isWP: false,
			isWeight: false,
			isMoney: false
		}
	},
	onLoad(options){
		this.showImage = getApp().globalData.isDiscountPopup;
		this.goodType = this.stdmodeArray[(this.stdmodeArray.length-1)]; //物品类型
		this.upperAmount = options.upperAmount;
		this.code = options.code;
		this.key = options.key;
		const data = this.$store.state.batchOrderInfo["list"][this.key].goodsInfo;
		if(JSON.stringify(data) != "{}"){
			this.isWP = data.isWP;
			this.isWeight = data.isWeight;
			this.isMoney = data.isMoney;
			if(data.info != undefined){
				this.goodName = data.info.goodName; //包裹名称
				this.goodType = data.info.goodType; //包裹类型
				this.materialTxt = data.info.materialTxt; //包裹材质
			}
			if(data.volume != undefined){
				this.txtnum = data.volume.txtnum; //寄件数量
				this.txtweight = data.volume.txtweight; //预估重量
				this.txtLong = data.volume.txtLong; //长
				this.txtWidth = data.volume.txtWidth; //宽
				this.txtheight = data.volume.txtheight; //高
				this.volume = data.volume.volume; //总体积
			}
			if(data.money != undefined){
				this.amount = data.money.amount; //声明价值
				this.bjmoney = data.money.bjmoney; //预估费用
			}
		}
	},
	computed: {
		txtCubic1: function() {
			try {
				let long = Number(this.txtLong);
				let height = Number(this.txtheight == "" ? 0 : this.txtheight);
				let width = Number(this.txtWidth == "" ? 0 : this.txtWidth);
				let cubicMeter = (long * height * width) / 1000000;
				return cubicMeter;
			} catch (e) {}
		}
	},
	watch: {
		txtCubic1(val){
			this.volume = val > 0 ? val : 0.01;
		},
		txtweight(val) {
			if (val !== "") {
				if (this.txtweight <= 0) {
					this.txtweight = 1;
				}
			}
		}
	},
	methods:{
		//保存物品信息
		btnSumit: function(){
			const that = this;
			if(!this.$util.isNotEmpty(this.goodName)){
				this.$util.showToast("物品名称不能为空");
				return false;
			}
			if(!this.$util.isNotEmpty(this.txtweight)){
				this.$util.showToast("预估重量不能为空");
				return false;
			}
			if(Number(this.txtweight) > 20){
				//大件 保费必填
				if(this.amount == ""){
					this.$util.showToast("预估重量大于20公斤,保费为必填");
					return false;
				}
			}
			let param = {
				isWP: this.isWP,
				isWeight: this.isWeight,
				isMoney: this.isMoney,
				info: {
					goodName: this.goodName, //包裹名称
					goodType: this.goodType, //包裹类型
					materialTxt: this.materialTxt, //包裹材质
				},
				volume: {
					txtnum: this.txtnum, //寄件数量
					txtweight: this.txtweight, //预估重量
					txtLong: this.txtLong, //长
					txtWidth: this.txtWidth, //宽
					txtheight: this.txtheight, //高
					volume: this.volume, //总体积
				},
				money: {
					amount: this.amount, //声明价值
					bjmoney: this.bjmoney //预估费用
				}
			}
			let newData = this.$store.state.batchOrderInfo["list"];
			//相同按钮开关
			if(this.$store.state.batchOrderInfo["list"].length > 0){
				newData.forEach(function(item, i){
					item.goodsInfo.isWP = param.isWP;
					item.goodsInfo.isWeight = param.isWeight;
					item.goodsInfo.isMoney = param.isMoney;
					if(that.isWP){
						item.goodsInfo["info"] = param.info;
					}
					if(that.isWeight){
						item.goodsInfo["volume"] = param.volume;
					}
					if(that.isMoney){
						item.goodsInfo["money"] = param.money;
					}
					if(that.key == i){
						item.goodsInfo = param;
					}
				})
			}
			that.$store.state.batchOrderInfo["list"] = newData;
			that.$util.navigateBack(that);
		},
		//关键字搜索物品名称
		goodNameInput: function(e){
			let val = e.detail.value;
			let that = this;
			if(val == ""){
				that.goodsNameList = [];
				return false;
			}
			that.$util.networkRequest({
				url : "/GoodsName/GetGoodsNameList",
				data: {goodsName: val},
				success : function(res){
					that.goodsNameList = res;
				}
			})
		},
		//物品名称
		btnGetGoodName: function(val){
			this.goodName = val;
			this.goodsNameList = [];
		},
		//物品类型
		stdmodeChange: function(e){
			this.goodType = this.stdmodeArray[e.detail.value];
		},
		//包装材质
		materialChange: function(e){
			this.materialTxt = this.materialArray[e.detail.value];
		},
		//寄件数量
		computeNum(key){
			if(key == 0){
				if(this.txtnum <= 1) return false;
				this.txtnum --;
			}else{
				this.txtnum ++;
			}
		},
		//预估重量
		computeWeight(key){
			if(key == 0){
				if(this.txtweight <= 1) return false;
				this.txtweight --;
			}else{
				this.txtweight ++;
			}
		},
		//保费
		amountInput: function(e){
			let val = e.detail.value;
			if(val != ""){
				if(parseFloat(val)>this.upperAmount){
				}else{
					if(this.txtweight == ""){
						this.$util.showToast("请输入预估重量");
						this.amount = "0";
						return false;
					}
					this.setPrice(val);
				}
			}else{
				this.bjmoney = 0;
			}
		},
		setPrice: function(val){
			const that = this;
			var _type = "big";
			if(Number(this.txtweight) <= 20){
				_type = "small";
			}
			that.$util.networkRequest({
				url : "/Price/InsurancePrice",
				method: "POST",
				data:{
					Amount: val,
					CompanyCode: that.code,
					ExpressType: _type
				},
				success : function(res){
					that.bjmoney = res;
				}
			});
		},
		switchWP: function(e){
			this.isWP = e.target.value;
		},
		switchWeight: function(e){
			this.isWeight = e.target.value;
		},
		switchMoney: function(e){
			this.isMoney = e.target.value;
		},
		
	}
}
</script>
<style scoped>
	@import url("../../common/css/index/goodsInfo.css");
	.switch-btn{
		float: right;
	}
	.good-name-list,
	.v-model{
		top: 124px;
	}
	/* #ifdef H5 */
	.good-name-list,
	.v-model{
		top: 166px;
	}
	/* #endif */
</style>