<template>
<view>
	<page-imges :show="showImage"></page-imges>
	<view class="form-item-list row">
		货物名称
		<input type="text" placeholder="输入包裹名称" v-model="goodName" />
	</view>
	<view class="form-item-list row column-r">
		货物类型
		<picker class="picker-box" :range="stdmodeArray" @change="stdmodeChange">
			{{goodType==""?"请选择":goodType}}
			<text class="iconfont icon--right-jian"></text>
		</picker>
	</view>
	<view class="form-item-list row column-r borderT">
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
		<view>
		体积填写<view class="red">（必填）</view></view>
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
	<view class="form-item-list borderT">
		货物备注
		<view class="note">物品照片帮助快递员判断是否符合快递规范以及选择合适运输工具,不会进行其他用途</view>
		<textarea placeholder="给小哥捎句话吧……" v-model="takeTxt" cursor-spacing="100" :show-confirm-bar="false"></textarea>
		<view class="take row column-r">
			<view>
				<text class="btn" :class="{ packActive: ispack === true }" @click="btnIsPack">带纸箱</text>
				<text class="btn" :class="{ packActive: isjd === true }" @click="btnIsjd">带胶带</text>
				<text class="btn" :class="{ packActive: islink === true }" @click="btnIslink">上门前联系</text>
			</view>
			<text class="red">注意：纸箱需额外收费</text>
		</view>
	</view>
	<button class="btn-default-css" @click="btnPreserve">确定</button>
</view>
</template>
<script>
export default {
	data() {
		return {
			goodName: "",
			stdmodeArray: ["仪器整机","仪器设备","试剂耗材","化玻设备","实验家具","其他"],
			goodType: "",
			txtnum: 1,
			txtweight: "",
			txtheight: "",
			txtWidth: "",
			txtLong: "",
			volume: "",
			takeTxt: "",
			ispack: false,
			isjd: false,
			islink: false,
		}
	},
	onLoad(){
		this.showImage = getApp().globalData.isDiscountPopup;
		let goodInfoData = this.$store.state.expressDeliveryInfo.goodInfo;
		if(JSON.stringify(goodInfoData) != "{}"){
			this.goodName = goodInfoData.goodName;
			this.goodType = goodInfoData.packType;
			this.txtnum = goodInfoData.goodNum;
			this.txtweight = goodInfoData.weigth;
			this.txtweight = goodInfoData.weigth;
			this.txtWidth = goodInfoData.width;
			this.txtheight = goodInfoData.height;
			this.txtLong = goodInfoData.long;
			this.volume = goodInfoData.cubic;
			this.takeTxt = goodInfoData.remark;
		}else{
			this.goodType = this.stdmodeArray[0]; //物品类型
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
	},
	methods: {
		//确定
		btnPreserve: function(){
			if(!this.Valid()) return false;
			let param = {
				goodName: this.goodName, //物品名称
				packType: this.goodType, //物品类型
				goodNum: this.txtnum, //寄件数量
				weigth: this.txtweight, //预估重量
				width: this.txtWidth, //体积填写宽
				height: this.txtheight, //体积填写高
				long: this.txtLong, //体积填写长
				cubic: this.volume, //总体积
				remark: this.takeTxt, //给快递员捎话
			}
			this.$store.state.expressDeliveryInfo.goodInfo = param;
			this.$util.navigateBack(this);
		},
		//物品类型
		stdmodeChange: function(e){
			this.goodType = this.stdmodeArray[e.detail.value];
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
		btnIsPack() {
			if (this.ispack) {
				this.takeTxt = this.takeTxt.replace("请带纸箱 ", "");
			} else {
				this.takeTxt += "请带纸箱 ";
			}
			this.ispack = !this.ispack;
		},
		btnIsjd() {
			if (this.isjd) {
				this.takeTxt = this.takeTxt.replace("请带胶带 ", "");
			} else {
				this.takeTxt += "请带胶带 ";
			}
			this.isjd = !this.isjd;
		},
		btnIslink() {
			if (this.islink) {
				this.takeTxt = this.takeTxt.replace("上门前联系 ", "");
			} else {
				this.takeTxt += "上门前联系 ";
			}
			this.islink = !this.islink;
		},
		Valid(){
			if(!this.$util.isNotEmpty(this.goodName)){
				this.$util.showToast("货物名称不能为空");
				return false;
			}
			if(!this.$util.isNotEmpty(this.txtweight)){
				this.$util.showToast("预估重量不能为空");
				return false;
			}
			if(!this.$util.isNotEmpty(this.volume)){
				this.$util.showToast("货物体积不能为空");
				return false;
			}
			return true;
		}
	}
}
</script>
<style scoped>
	@import url("../../common/css/index/goodsInfo.css");
</style>
