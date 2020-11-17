<template>
	<view class="main">
		<page-imges :show="showImage"></page-imges>
		<view class="title">反馈订单问题</view>
		<view class="note">反馈您遇到的问题,客服会为您尽快解决</view>
		<view class="small-title" v-if="typeAllList.length > 0">常见问题</view>
		<radio-group @change="radioChange" class="radio-list">
			<label class="radio" v-for="(item, index) in typeAllList" :key="index">
				<radio :value="item.typeCode" :checked="item.typeCode === current" />{{item.name}}
			</label>
		</radio-group>
		<view class="small-title">您的问题</view>
		<textarea class="textarea" v-model="remark" placeholder="在此输入您遇到的问题" maxlength="-1" cursor-spacing="150" :show-confirm-bar="false"/>
		<button class="btn-default-css submit" @click="submit">提交</button>
	</view>
</template>
<script>
export default {
	data() {
		return {
			mastCode: "",
			typeAllList: [],
			current: 0,
			remark: ""
		}
	},
	onLoad(options){
		const that = this;
		that.mastCode = options.mastCode;
		that.showImage = getApp().globalData.isDiscountPopup;
		that.$util.networkRequest({
			url: "/Express/GetProblemTypeAllList",
			success: function(res){
				that.typeAllList = res;
			}
		})
	},
	onShow() {
		this.current = 0;
		this.remark = "";
	},
	methods: {
		radioChange: function(evt) {
			this.typeAllList.forEach((item, i) =>{
				if(item.typeCode === evt.target.value){
					this.current = item.typeCode;
				}
			})
        },
		submit: function(){
			let that = this;
			let bool = true;
			if( that.remark =="" && that.current == 0 ) {
				that.$util.showToast("请输入您的问题");
				return false;
			}
			that.$util.networkRequest({
				url: "/Express/PostExpressProblem",
				method: "POST",
				data: {
					"typeCode": that.current,
					"mastCode": that.mastCode,
					"remark": that.remark
				},
				success: function (res) {
					uni.showModal({
					    title: '提示',
					    content: "问题反馈成功,请等待问题反馈结果",
						showCancel: false,
						success: function (res) {
							that.$util.navigateBack(that)
						}
					});
				}
			})
		}
	}
}
</script>
<style scoped>
.main{
	padding: 0 20px;
}
.title{
	font-size: 18px;
	font-weight: bold;
	text-align: center;
	margin-top: 20px;
	margin-bottom: 5px;
}
.note{
	font-size: 14px;
	color: #666666;
	text-align: center;
}
.small-title{
	margin-top: 30px;
	font-size: 16px;
}
.radio-list .radio{
	display: block;
	margin-top: 10px;
	display: flex;
	align-items: center;
}
.radio-list .radio radio{
	transform: scale(0.7);
}
.textarea{
	margin-top: 15px;
	line-height: 20px;
	border: 1px solid #EEEEEE;
	padding: 3px 5px;
	width: calc(100% - 10px);
	height: 120px;
	border-radius: 3px;
}
.submit{
	margin: 20px 0;
	border-radius: 40px;
}
</style>