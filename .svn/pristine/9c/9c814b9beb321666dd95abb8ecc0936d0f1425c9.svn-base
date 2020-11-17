<template>
	<view class="status">
		<page-imges :show="showImage"></page-imges>
		<view v-if="status==0">
			<image src="../../static/images/shz.svg"></image>
			<view class="title">资料审核中！</view>
			<text>您的资料已提交上传审核，请耐心等待</text>
			<navigator open-type="switchTab" url="/pages/me/userInfo"><button>返回首页</button></navigator>
		</view>
		<view v-if="status==1">
			<image src="../../static/images/shsb.svg"></image>
			<view class="title">企业认领失败！</view>
			<navigator open-type="redirect" url="/pages/me/claim"><button>重新提交</button></navigator>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			status: 0
		}
	},
	onLoad(options) {
		this.status = options.status;
		let _title = options.status == 0?"资料审核中":"认领失败";
		uni.setNavigationBarTitle({ title: _title });
		this.showImage = getApp().globalData.isDiscountPopup;
	}
}
</script>
<style scoped>
.status{
	text-align: center;
	padding-top: 74px;
	color: #999;
}
.status image{
	width: 116px;
	height: 116px;
}
.status .title{
	font-size: 16px;
	font-weight: bold;
	padding: 20px 0;
}
.status  button{
	width: 160px;
	height: 44px;
	line-height: 44px;
	border-radius: 44px;
	color: #fff;
	background: #4285F4;
	margin-top: 20px;
}
</style>
