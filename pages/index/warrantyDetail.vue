<template>
<view>
	<view class="insure-con">
		<view class="title">
			<view>
				<view @click="group">
					{{dataInfo.title==null?'平台保险':dataInfo.title}}
					<text class="iconfont" :class="isInsureInfo?'icon-group-copy':'icon-group'"></text>
				</view>
				<text class="iconfont icon-copy" @click="setClip"></text>
			</view>
			<view>
				<text class="money">保额 ¥{{dataInfo.insuranceValue}}</text>
				<!-- <text class="money">保费 ¥29.00</text> -->
			</view>
		</view>
		<view class="info">
			<view>
				<view class="label">
					<text>投保人</text>
					{{dataInfo.userName}}
				</view>
				<view class="label">
					<text>配送公司</text>
					{{dataInfo.companyName}}
				</view>
				<view class="label">
					<text>运输物品</text>
					{{dataInfo.goodName==null?"--":dataInfo.goodName}}
				</view>
				<view class="label">
					<text>始发地</text>
					{{dataInfo.fromAddress}}
				</view>
			</view>
			<view>
				<view class="label">
					<text>寄件时间</text>
					{{dataInfo.sendTime}}
				</view>
				<view class="label">
					<text>运单号</text>
					{{dataInfo.expressCode}}
				</view>
				<view class="label">
					<text>物品数量</text>
					{{dataInfo.goodCount}}
				</view>
				<view class="label">
					<text>目的地</text>
					{{dataInfo.toAddress}}
				</view>
			</view>
		</view>
		<view class="additional" v-if="isInsureInfo">
			<view>附加险(赠送)</view>
			<view><text class="iconfont icon-dui"></text>国内公路货物运输盗抢险</view>
			<view><text class="iconfont icon-dui"></text>货物运输罢工险</view>
			<view><text class="iconfont icon-dui"></text>货运险附加哄抢责任条款</view>
			<view><text class="iconfont icon-dui"></text>偷窃提货不着险</view>
		</view>
	</view>
	<view class="form-insure">
		<text>保单编号</text>
		<input type="text" placeholder="填写保单编号" v-model="number" />
	</view>
	<view class="form-insure">
		<text style="line-height: 65px;">上传凭证</text>
		<view class="pic-list">
			<!-- #ifdef H5 -->
			<view class="upload">
				<view ref="input" class="input-view"></view>
				<image src="../../static/images/upload.png" mode="aspectFill"></image>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="upload" @click="uploadPic()">
				<image src="../../static/images/upload.png" mode="aspectFill"></image>
			</view>
			<!-- #endif -->
			<view class="upload" v-for="(item, i) in picList" :key="i">
				<image :src="item" mode="aspectFill" @click="preview(i)"></image>
				<text class="iconfont icon-guanbi" @click="delFile(i)"></text>
			</view>
		</view>
	</view>
	<textarea class="textarea" placeholder="备注:" v-model="remark" />
	<view class="fixed-btn">
		<button class="btn-default-css" @click="submit">提交</button>
	</view>
</view>
</template>
<script>
export default {
	data() {
		return {
			code: "",
			dataInfo: [],
			isInsureInfo: false,
			picList: [],
			remark: "",
			number: "",
		}
	},
	onLoad(options){
		this.code = options.code;
		this.getInsureInfo();
	},
	mounted() {
		const that = this;
		// #ifdef H5
		this.$util.$refsFileHtml({
			formData: {
				FileName: "pinganInsurance",
				UploadType: 21,
				SuffixName: ""
			},
			$input: this.$refs.input.$el
		}, function(data) {
			that.picList.push(data.data);
		});
		//#endif
	},
	methods: {
		//提交
		submit: function(){
			let that = this;
			if(!that.$util.isNotEmpty(that.number)){
				that.$util.showToast("请填写保单编号!");
				return false;
			}
			if(that.picList.length == 0){
				that.$util.showToast("请上传凭证!");
				return false;
			}
			let param = {
				"code": that.code,
				"insuranceCode": that.number, //保单编号
				"filePath": that.picList, //附件
				"remark": that.remark, //备注
			}
			uni.showLoading({ title: "正在提交" });
			that.$util.networkRequest({
				url: "/InsuranceCompany/SubmitInsuranceInfo",
				method: "POST",
				data: param,
				success: res => {
					if(!res){
						uni.showModal({
						    title: "提示",
						    content: "保单提交失败,请稍后重试!",
							showCancel: false,
						});
					}else{
						that.$util.showToast("保单提交成功!");
					}
				}
			})
		},
		//获取信息
		getInsureInfo(){
			let that = this;
			that.$util.networkRequest({
				url: "/InsuranceCompany/GetExpressInfo",
				data: {code: that.code},
				success: res => {
					that.dataInfo = res;
					that.number = res.insuranceCode;
					that.picList = res.fileList;
					that.remark = res.remark;
				}
			})
		},
		group: function(){
			this.isInsureInfo = !this.isInsureInfo;
		},
		//微信上传凭证
		uploadPic: function(){
			let that = this;
			that.$util.chooseImage({
				formData: {
					FileName: "pinganInsurance",
					UploadType: 21,
					SuffixName: ""
				},
			},function(data){
				that.picList.push(data.data);
			});
		},
		//预览
		preview: function(index){
			uni.previewImage({
				current: index,
				urls: this.picList,
			});
		},
		//删除图片
		delFile: function(key){
			this.picList = this.picList.filter(function(item, i){
				return i != key;
			});
		},
		//复制
		setClip: function(){
			let data = this.dataInfo;
			let val = "投保人：" + data.userName +
					"\n运单号：" + data.expressCode +
					"\n始发地：" + data.fromAddress +
					"\n目的地：" + data.toAddress +
					"\n运输物品：" + data.goodName +
					"\n寄件时间：" + data.sendTime +
					"\n配送公司：" + data.companyName +
					"\n保额：" + data.insuranceValue;
			uni.setClipboardData({ data: val, success: () => {
				uni.showToast({ title: "内容已复制", icon: 'success' });
			}});
		},
	}
}
</script>
<style scoped>
.insure-con{
	border-top: 1px solid #F5F5F5;
	border-bottom: 10px solid #F5F5F5;
	padding: 15px;
	position: relative;
}
.insure-con .title{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.insure-con .title > view:first-child{
	font-size: 16px;
	font-weight: bold;
	display: flex;
	align-items: center;
}
.insure-con .title text.iconfont{
	font-size: 12px;
	color: #4285F4;
	padding-left: 5px;
}
.insure-con .title text{
	font-size: 14px;
	color: #777777;
}
.insure-con .title text.money{
	color: #FF0000;
	padding-left: 8px;
}
.insure-con .title text.icon-copy{
	font-size: 16px;
	color: #999999;
	margin-top: -1px;
	margin-left: 5px;
    display: block;
}
.insure-con .info{
	display: flex;
}
.insure-con .info > view{
	width: 50%;
	padding-right: 20px;
}
.insure-con .info .label{
	margin-top: 15px;
	min-height: 40px;
}
.insure-con .info .label text{
	display: block;
	color: #777777;
	font-size: 12px;
	padding-bottom: 3px;
}
.insure-con .additional{
	position: absolute;
	top: 50px;
	left: 0;
	right: 0;
	padding: 10px 25px;
	background-color: #FFFFFF;
	box-shadow: 0 10px 10px #ececec;
}
.insure-con .additional > view{
	color: #999999;
	margin-bottom: 8px;
}
.insure-con .additional text{
	color: #4285F4;
	font-size: 12px;
	font-weight: bold;
	padding-right: 8px;
}
.form-insure{
	display: flex;
	padding: 20px 15px 0;
}
.form-insure > text{
	line-height: 36px;
}
.form-insure input{
	width: calc(100% - 80px);
	height: 36px;
	line-height: 36px;
	padding: 0 5px;
}
.form-insure .pic-list{
	width: calc(100% - 80px);
}
.form-insure .upload{
	width: 63px;
	height: 63px;
	overflow: hidden;
	display: inline-block;
	margin-bottom: 5px;
	position: relative;
}
.form-insure .upload image{
	width: 100%;
	height: 100%;
}
.form-insure .upload .icon-guanbi{
	position: absolute;
	top: 0;
	right: 0;
	z-index: 9;
	color: #FF0000;
}
.form-insure input,
.form-insure .upload{
	margin-left: 10px;
	border: 1px solid #e6e6e6;
	border-radius: 3px;
	position: relative;
}
.textarea{
	margin: 10px 15px 40px;
	padding: 5px;
	background-color: #F7F7F7;
	width: calc(100% - 40px);
	height: 100px;
	border-radius: 5px;
	margin-bottom: 100px;
}
.fixed-btn{
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>
