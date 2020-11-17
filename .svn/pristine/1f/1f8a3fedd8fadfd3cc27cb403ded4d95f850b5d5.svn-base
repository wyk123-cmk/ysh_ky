<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<view class="wrap">
			<text class="title">请选择取消订单的原因</text>
			<text class="tip">告诉我们原因，我们将不段优化提升自己的服务</text>
			<radio-group @change="radioChange">
				<label class="list-cell" v-for="(item, index) in items" :key="index">
					{{item}}
					<radio :value="item" color="#FD9523" />
				</label>
				<label class="list-cell textarea" v-if="isRemark">
					<textarea maxlength="-1" v-model="otherRemark" cursor-spacing="130" :show-confirm-bar="false"></textarea>
				</label>
			</radio-group>
		</view>
		<button class="submit" @click="submit">提交</button>
	</view>
</template>
<script>
export default {
	data() {
		return {
			mastCode: "",
			type: "",
			remark: "",
			otherRemark: "",
			isRemark: false,
			items: ["快递员未按预约时间上门","上门时间/地点修改","联系不到快递员","已发货","我不需要寄件了","其他原因"]
		}
	},
	onLoad(options){
		this.showImage = getApp().globalData.isDiscountPopup;
		this.mastCode = options.mastCode;
		this.type = options.type == undefined?"":options.type;
	},
	methods: {
		submit: function(){
			let _remark = this.remark;
			if(_remark==""){
				this.$util.showToast("请选择取消原因");
				return false;
			}
			if(_remark=="其他原因"){
				if(this.otherRemark==""){
					this.$util.showToast("其他原因不能为空");
					return false;
				}
				_remark = this.otherRemark;
			}
			const that = this;
			that.$util.networkRequest({
				url: "/Express/Cancel",
				method: "POST",
				data: {
					mastCode: that.mastCode,
					reason: _remark
				},
				success: res => {
					if(that.type == 0){
						uni.switchTab({ url: '/pages/order/orderList' });
					}
					else if(that.type == 0){
						uni.navigateTo({ url: '/pages/vehicleMail/index' });
					}else{
						that.$util.navigateBack(that);
					}
				}
			})
		},
		radioChange: function(e){
			let _value = e.detail.value;
			this.otherRemark = "";
			if(_value == "其他原因") this.isRemark = true;
			else  this.isRemark = false;
			this.remark = _value;
		}
	}
}
</script>
<style scoped>
.wrap{
	background-color: #fff;
	margin: 10px;
}
.wrap .title{
	text-align: center;
	font-size: 18px;
	padding-top: 10px;
	display: block;
}
.wrap .tip{
	text-align: center;
	color: #F3A90A;
	font-size: 12px;
	padding-top: 5px;
	padding-bottom: 10px;
	display: block;
}
.list-cell{
	border-top: 1px solid #F0F0F0;
	display: flex;
	display: -webkit-flex;
	align-items: center;
	justify-content: space-between;
	padding-left: 15px;
	padding-right: 6px;
	line-height: 50px;
}
.list-cell radio{
	transform: scale(0.6);
}
.list-cell.textarea{
	border: 0;
	padding-right: 15px;
	padding-bottom: 20px;
}
.list-cell textarea{
	border: 1px solid #EEEEEE;
	height: 115px;
	font-size: 14px;
	line-height: 16px;
	width: 98%;
	padding: 5px 1%;
}
.submit{
	background-color: #FD9523;
	color: #FFFFFF;
	margin: 20px 10px 0;
	border-radius: 20px;
}
</style>