<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<view class="details">
			<view class="title">
				{{info.title}}
				<text>{{info.createDate}}</text>
			</view>
			<view class="con" v-html="info.noticesContent"></view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			code: "",
			info: []
		}
	},
	onLoad(options){
		const that = this;
		that.code = options.code;
		that.showImage = getApp().globalData.isDiscountPopup;
		that.$util.networkRequest({
			url: "/Notices/GetInfo",
			data: {
				code: that.code
			},
			success: function(res){
				if(res == null) return false;
				res.createDate = that.$util.formatDate.format(res.createDate,"MM-dd");
				that.info = res;
			}
		});
	},
	methods: {
		
	}
}
</script>
<style scoped>
.details{
	background-color: #FFFFFF;
	margin: 15px;
	padding: 14px;
}
.details .title{
	font-weight: bold;
	padding-top: 4px;
	display: block;
}
.details .title text{
	font-weight: normal;
	color: #989898;
	padding-left: 15px;
	float: right;
}
.details .con{
	font-size: 12px;
	color: #999999;
	padding-top: 7px;
	line-height: 22px;
}
</style>