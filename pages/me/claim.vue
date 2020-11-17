<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<text class="tips">用户提交的申请信息，只作为审核使用，不会公开展示</text>
		<view class="label-list">
			企业名称<input type="text" placeholder="请输入企业名称" @input="nameInput" v-model="companyName" />
			<view class="company-name-list" v-if="companyNameList.length != 0">
				<text v-for="(item, index) in companyNameList" :key="index" @click="clickName(item.companyName)">{{item.companyName}}</text>
			</view>
		</view>
		<view class="label-list">
			企业身份
			<picker mode="selector" @change="bindPickerChange" :value="typeIndex" :range="typeData">
				{{typeData[typeIndex]}}
			</picker>
			<text class="iconfont icon--right-jian"></text>
		</view>
		<view class="upload-box">
			上传图片
			<view class="pic-list">
				<!-- #ifdef H5 -->
				<view>
					<view ref="attachmentInput1" class="input-view"></view>
					<image class="img" mode="widthFix" :src="attachment1==''?'../../static/images/yy.png':attachment1"></image>
					营业执照
				</view>
				<view>
					<view ref="attachmentInput2" class="input-view"></view>
					<image class="img" mode="widthFix" :src="attachment2==''?'../../static/images/sq-book.png':attachment2"></image>
					授权说明书
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
					<view @click="uploadPic(0)">
						<image class="img" mode="widthFix" :src="attachment1==''?'../../static/images/yy.png':attachment1"></image>
						营业执照
					</view>
					<view @click="uploadPic(1)">
						<image class="img" mode="widthFix" :src="attachment2==''?'../../static/images/sq-book.png':attachment2"></image>
						授权说明书
					</view>
				<!-- #endif -->
			</view>
			<view class="doc">
				<!-- #ifdef H5 -->
				<a :href="filePath"><text>下载授权书模板</text></a>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<text @click="download">下载授权书模板</text>
				<!-- #endif -->
				填写信息盖章拍照上传
			</view>
			<text class="note">注：ios需要在Safari浏览器中打开文件进行下载</text>
		</view>
		<radio-group @change="radioChange" class="agree">
			<radio color="#4385f5" :checked="isChecked" />
			我已阅读并同意<text @click="isAgree=true">《仪商汇平台认领服务协议》</text>
		</radio-group>
		<button class="btn-default-css" @click="btnSubmit">立即认证</button>
		<view v-if="isAgree" @click="isAgree=false">
		  <view class="v-model"></view>
		  <view class="notice-popup" v-html="YSHclainAgree"></view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			YSHclainAgree: "",
			filePath: "http://express.1718china.cn/docs/yshsqsms.docx",
			token: "",
			typeData: ['请选择', '生产商', '代理商', '采购商'],
			typeIndex: 0,
			isChecked: false,
			isAgree: false,
			companyName: "",
			attachment1: "",
			attachment2: "",
			companyNameList: []
		}
	},
	onLoad(){
		const that = this;
		that.YSHclainAgree = this.agreeContent;
		that.token = uni.getStorageSync('token');
		that.showImage = getApp().globalData.isDiscountPopup;
		that.$util.networkRequest({
			url : "/Account/GetIsFinish",
			data: {token: that.token},
			success: function(res){
				if(res) return false;
				uni.showModal({
				    title: '提示',
				    content: '认领企业需完善个人信息，立即完善',
					showCancel: false,
					success: function () {
						uni.navigateTo({url:'/pages/logs/peopleInfo?type=1'});
					}
				});
			},
		});
	},
	mounted() {
		const that = this;
		// #ifdef H5
		that.$util.$refsFileHtml({
			formData: {
				FileName: "Company",
				UploadType: 2,
				SuffixName: ""
			},
			$input: this.$refs.attachmentInput1.$el
		}, function(data){
			that.attachment1 = data.data;
		});
		that.$util.$refsFileHtml({
			formData: {
				FileName: "Company",
				UploadType: 3,
				SuffixName: ""
			},
			$input: this.$refs.attachmentInput2.$el
		}, function(data){
			that.attachment2 = data.data;
		});
		//#endif
	},
	methods: {
		btnSubmit: function(){
			const that = this;
			if(!that.Valid()) return false;
			uni.showLoading({mask: true, title: "加载中..."});
			that.$util.networkRequest({
				url : "/Company/Register",
				method: "POST",
				data: {
					cmpyName: that.companyName,
					attachment1: that.attachment1,
					attachment2: that.attachment2,
					cmpyType: that.typeIndex
				},
				success: function(res){
					if(res){
						uni.redirectTo({url: "/pages/me/claimStatus?status=0"});
					}
				},
			});
			
		},
		nameInput: function(e){
			this.companyName = e.detail.value;
			this.getCompanyName(e.detail.value);
		},
		bindPickerChange: function(e){
			this.typeIndex = e.target.value;
		},
		uploadPic: function(key){
			let that = this;
			let _uploadType = key == 0 ? 2: 3;
			that.$util.chooseImage({
				formData: {
				FileName: "Company",
				UploadType: _uploadType,
				SuffixName: ""
			},
			},function(data){
				if(key == 0){
					that.attachment1 = data.data;
				}
				if(key == 1){
					that.attachment2 = data.data;
				}
			});
		},
		clickName: function(_txt){
			this.companyName = _txt;
			this.companyNameList = [];
		},
		radioChange: function(){
			this.isChecked = !this.isChecked;
		},
		//下载
		download: function(){
			const that = this;
			uni.showLoading({title:"下载文件"});
			that.$util.downloadFile(this.filePath);
		},
		getCompanyName: function(_val){
			const that = this;
			that.$util.networkRequest({
				url : "/Account/GetCompanyName",
				data: {keyWord: _val},
				success: function(res){
					that.companyNameList = res;
				},
			});
		},
		Valid() {
			if(!this.$util.isNotEmpty(this.companyName)){
				this.$util.showToast("认领企业名称不能为空");
				return false;
			}
			if(this.typeIndex == 0){
				this.$util.showToast("请选择企业身份");
				return false;
			}
			if(!this.$util.isNotEmpty(this.attachment1)){
				this.$util.showToast("请上传营业执照");
				return false;
			}
			if(!this.$util.isNotEmpty(this.attachment2)){
				this.$util.showToast("请上传授权委托书");
				return false;
			}
			if(!this.isChecked){
				this.$util.showToast("请仔细阅读《仪企查认证服务协议》并同意");
				return false;
			}
			return true;
		}
	}
}
</script>
<style scoped>
.tips{
	color: #999999;
	font-size: 12px;
	padding: 10px 15px;
	display: block;
}
.label-list{
	background-color: #FFFFFF;
	padding: 0 15px;
	line-height: 44px;
	display: box;
	display: -webkit-box;
	border-bottom: 1px solid #F7F7F7;
	position: relative;
}
.label-list picker,
.label-list input{
	line-height: 44px;
	height: 44px;
	width: 77%;
	margin-left: 10px;
}
.label-list .iconfont{
	position: absolute;
	right: 10px;
	color: #DBDBDB;
}
.company-name-list{
	position: absolute;
	left: 0;
	right: 0;
	top: 44px;
	z-index: 2;
	padding: 0 15px;
	background-color: #FFFFFF;
	border: 1px solid #F7F7F7;
}
.company-name-list text{
	display: block;
	line-height: 36px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.upload-box{
	background-color: #FFFFFF;
	margin-top: 10px;
	padding: 15px;
}
.upload-box .pic-list{
	display: flex;
	display: -webkit-flex;
	margin-top: 15px;
}
.upload-box .pic-list > view{
	width: 50%;
	text-align: center;
	color: #666;
	font-size: 12px;
	position: relative;
}
.upload-box .pic-list .img{
	width: 100%;
	display: block;
	margin-bottom: 5px;
}
.upload-box .doc{
	margin-top: 10px;
}
.upload-box .doc text{
	color: #FF0000;
}
.upload-box .note{
	font-size: 12px;
	color: #999;
}
.agree{
	display: flex;
	display: -webkit-flex;
	align-items: center;
	margin: 10px 12px;
}
.agree radio{
	transform: scale(0.7);
}
.agree text{
	color: #4285f4;
}
.notice-popup{
	top: 20px;
	position: fixed;
	background: #fff;
	left: 10px;
	right: 10px;
	bottom: 20px;
	overflow-y: auto;
	font-size: 15px;
	z-index: 1000;
}
/* #ifdef H5 */
.notice-popup{
	top: 60px;
}
/* #endif */
</style>