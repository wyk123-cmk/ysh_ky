<template>
	<view>
		<view v-show="isBigImg">
			<view class="v-model"></view>
			<view class="image-popup">
				<image :src="imageData.url" mode="widthFix"></image>
				<view class="close" @click="bigClose">
					<text class="iconfont icon-quxiao"></text>
				</view>
				<button class="view-details" @click="goPage">查看详情</button>
			</view>
		</view>
		<view class="lessen" v-show="isSmallImg&&imageData.braturl!=''">
			<image  @click="goPage" :src="imageData.braturl" mode="widthFix"></image>
			<view class="close" @click="smallClose(1)">
				<text class="iconfont icon-quxiao"></text>
			</view>
		</view>
	</view>
</template>
<script>
/*
 * 初始进入直接显示弹框; 获取不到URL: 则弹框不存在
 * braturl=="": 右下角不显示缩略图;点击弹框关闭按钮,直接关闭弹框
 * braturl!="": 右下角显示缩略图, 点击弹框关闭按钮,显示缩略图;点击缩略图的按钮,才会直接关闭弹框
 * 
 * <page-imges :show="showImage"></page-imges>
 * this.showImage = getApp().globalData.isDiscountPopup;
*/
export default {
	name: "pageImges",
	props: {
		show: {type: Number, default: ''},
	},
	data() {
		return {
			imageData: {},
			isBigImg: false,
			isSmallImg: false,
			isDiscountPopup: "", //是否显示活动弹框 0-大图显示;1-缩略图显示;2--都不显示
		}
	},
	created() {
		this.isDiscountPopup = getApp().globalData.isDiscountPopup;
		if(this.isDiscountPopup==0 && uni.getStorageSync("isDiscountPopup") == 1){
			this.isDiscountPopup = 1
		}
		let data = getApp().globalData.discountPopUpImage;
		if(JSON.stringify(data) == "{}"){
			this.getPopUpImage();
		}else{
			this.setData(data);
		}
	},
	watch: {
		show() {
			this.isDiscountPopup = this.show;
			this.judgeIsShow();
		}
	},
	methods: {
		//判断是否显示
		judgeIsShow(){
			if(this.isDiscountPopup == 0){
				this.isBigImg = true;
				this.isSmallImg = false;
			}
			else if(this.isDiscountPopup == 1){
				this.isBigImg = false;
				this.isSmallImg = true;
			}
			else{
				this.isBigImg = false;
				this.isSmallImg = false;
			}
		},
		//关闭大图
		bigClose: function(){
			this.isBigImg = false;
			this.isSmallImg = true;
			getApp().globalData.isDiscountPopup = 1;
			uni.setStorage({key: "isDiscountPopup", data: 1});
		},
		//关闭缩略图
		smallClose: function(type){
			if(type == 0){
				this.isBigImg = true;
				this.isSmallImg = false;
				// getApp().globalData.isDiscountPopup = 0;
			}
			else{
				this.isSmallImg = false;
				getApp().globalData.isDiscountPopup = 2;
			}
		},
		//查看详情
		goPage: function(){
			let _url = this.imageData.path;
			this.bigClose();
			if (uni.getStorageSync("token") == "" || uni.getStorageSync("token") == undefined) {
				uni.navigateTo({ url: "/pages/logs/logs?url=" + _url });
				return false;
			}
			if (_url.indexOf('http') > -1) {
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: "/pages/web-view/index?url=" + _url
				});
				// #endif
				// #ifdef H5
				window.location.href = _url;
				// #endif
				return false;
			}
			uni.navigateTo({ url: _url });
		},
		//获取图片
		getPopUpImage: function(){
			var that = this;
			that.$util.networkRequest({
				url: "/SysInfo/GetPopularizePhotoConfigInfo",
				method: "Get",
				success: function(data) {
					getApp().globalData.discountPopUpImage = data;
					that.setData(data);
				}
			});
		},
		setData(data){
			if(data == null) {
				uni.removeStorageSync("isDiscountPopup");
				return false;
			}
			if(data.url == ""){
				uni.removeStorageSync("isDiscountPopup");
				return false;
			}
			this.imageData = data;
			this.judgeIsShow();
		},
	}
}
</script>
<style scoped>
.image-popup{
	position: fixed;
	top: 50%;
	left: 50%;
	z-index: 2000;
	transform: translate3d(-50%, -50%, 0);
}
.image-popup .close{
	position: absolute;
	top: -20px;
	right: -10px;
	width: 30px;
	height: 30px;
	background-color: #fa424c;
	border-radius: 50%;
	border: 1px solid #fdd4a1;
	text-align: center;
	line-height: 30px;
}
.image-popup .icon-quxiao{
	color: #FFFFFF;
	font-size: 18px;
	color: #fdd4a1;
}
.image-popup .view-details{
	width: 190px;
	height: 50px;
	font-size: 15px;
	line-height: 50px;
	color: #FFFFFF;
	border-radius: 30px;
	margin-top: 20px;
	background: -webkit-linear-gradient(left, #a63cff 30%, #595bfe);
	background: -moz-linear-gradient(left, #a63cff 30%, #595bfe);
	background: linear-gradient(left, #a63cff 30%, #595bfe);
}
.lessen{
	position: fixed;
	width: 100px;
	min-height: 100px;
	right: 30px;
	bottom: 10%;
	z-index: 999;
}
.lessen image{
	width: 100%;
}
.lessen .close{
	position: absolute;
	top: -15px;
	right: -15px;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	border: 1px solid #999999;
	background-color: #FFFFFF;
	text-align: center;
	line-height: 20px;
}
.lessen .icon-quxiao{
	color: #999999;
	font-size: 14px;
}
</style>
