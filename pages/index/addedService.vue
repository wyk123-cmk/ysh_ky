<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<view class="mian">
			<view class="service-item" v-for="(item, i) in newData" :key="i" @click="open(i)"  v-if="item.serviceKey != 'TakeBill'">
				{{item.serviceTitle}}
				<view :style="item.sub.isDefault==1?'color:#999':'color:#333'">
					{{item.sub.remark}}
					<text class="iconfont icon--right-jian"></text>
				</view>
			</view>
		</view>
		<!-- 提货单 -->
		<view v-show="isTakeBill">
			<view class="service-item bill-title">
				提货单
				<view>
					<switch class="switch-btn" :checked="isSwitch" color="#4285F4" @change="switchChange" />
				</view>
			</view>
			<view class="take-bill-con" v-show="isSwitch">
				<text class="small-title">提货单信息</text>
				<textarea v-model="takeDeliveryRemark" placeholder="请在此处填写提货单信息" />
				<view class="img-list" v-if="uploadList.length>0">
					<view v-for="(u, k) in uploadList" :key="k" :style="'background-image:url('+u.url+')'">
						<text class="iconfont icon-guanbi" @click="delFile(k)"></text>
					</view>
				</view>
				<view class="btn">
					<!-- #ifdef H5 -->
					<view>
						<view ref="inputImage" class="input-view"></view>
						<text class="iconfont icon-tupian"></text>
					</view>
					<view>
						<view ref="inputFile" class="input-view"></view>
						<text class="iconfont icon-folder_icon"></text>
					</view>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<text class="iconfont icon-tupian" @click="uploadImage"></text>
					<text class="iconfont icon-folder_icon" @click="uploadFileWX"></text>
					<!-- #endif -->
				</view>
			</view>
		</view>
		<button class="btn-default-css" @click="btnConfirm">确认</button>
		<view class="min-popup" v-if="isShow" :class="[isShow?'min-show':'min-hide']">
			<view class="min-overlay" @click="close"></view>
			<view class="min-content">
				<text class="small-title">{{serviceList[index].serviceTitle}}</text>
				<view class="sub-list">
					<text v-bind:class="{'active': newData[index].sub.remark==sub.remark}" v-for="(sub, j) in serviceList[index].listDetail" :key="j" @click="btnSelTH(sub)">{{sub.remark}}</text>
				</view>
				<text class="note" v-bind:class="{'red':serviceList[index].serviceKey=='PayType'}">{{serviceList[index].remark}}</text>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			type: "",
			code: "",
			serviceList: [],
			isShow: false,
			newData: [],
			index: 0,
			takeBillIndex: 0,
			isTakeBill: false,
			isSwitch: false,
			token: "",
			takeDeliveryRemark: "",
			uploadList: []
		}
	},
	onLoad(options){
		this.type = options.type;
		this.code = options.code;
		this.token = uni.getStorageSync('token');
		this.showImage = getApp().globalData.isDiscountPopup;
		this.init();
	},
	mounted() {
		const that = this;
		// #ifdef H5
		this.$util.$refsFileHtml({
			formData: {
				FileName: "TakeDelivery",
				UploadType: 10,
				SuffixName: ""
			},
			$input: this.$refs.inputImage.$el
		}, function(data){
			that.callBack(data);
		});
		var input = document.createElement('input');//创建元素
		input.type = 'file'; //添加file类型
		input.accept = "application/pdf";
		input.onchange = (event) => {
			that.uploadFileH5(input, event);
		}
		this.$refs.inputFile.$el.appendChild(input);
		//#endif
	},
	methods: {
		init(){
			const that = this;
			if(JSON.stringify(that.$store.state.expressDeliveryInfo.service) != "{}"){
				that.newData = that.$store.state.expressDeliveryInfo.service;
			}
			if(this.type != 1){
				let takeBillInfo = that.$store.state.expressDeliveryInfo.takeBill;
				if(JSON.stringify(takeBillInfo) != "{}"){
					this.isSwitch = takeBillInfo.takeBill;
					this.takeDeliveryRemark = takeBillInfo.takeDeliveryRemark;
					this.uploadList = takeBillInfo.takeDeliveryAttachment;
				}
			}
			let _url = "/ExpressService/GetList";
			if(this.type == 2){
				_url = "/ExpressCar/GetExpressServiceList";
			}
			that.$util.networkRequest({
				url : _url,
				data: {companyCode: that.code},
				success : function(res){
					that.serviceList = res;
					if(that.type != 1){
						res.forEach(function(item, i) {
							if(item.serviceKey == "TakeBill"){
								that.isTakeBill = true; 
								that.takeBillIndex = i;
							}
						});
					}
					if(that.newData.length != 0) return false;
					let newData = [];
					res.forEach(function(item, i) {
						let _subData = item.listDetail[0];
						if(that.code == "db001" && item.serviceKey == "DeliveryType"){
							//若是德邦:提货方式默认“送货（不含上楼）”
							item.listDetail.forEach(sub => {
								if(sub.remark == "送货（不含上楼）"){
									_subData = sub;
								}
							});
						}
						if(item.serviceKey == "TakeBill" && that.type == 1){
							return false
						}
						if(item.serviceKey == "TakeBill"){
							that.isTakeBill = true;
							that.takeBillIndex = i;
						}
						newData.push({
							serviceTitle: item.serviceTitle,
							serviceKey: item.serviceKey,
							sub: {
								remark: _subData.remark,
								serviceKey: _subData.serviceKey,
								serviceValue: _subData.serviceValue,
								isDefault:_subData.isDefault
							}
						})
					})
					that.newData = newData;
				}
			});
		},
		switchChange: function(e){
			const that = this;
			const bool = e.detail.value;
			let key = bool?1:0;
			that.isSwitch = bool;
			let sub = that.serviceList[that.takeBillIndex];
			sub.listDetail.forEach(item => {
				if(key == item.serviceValue){
					that.newData[that.takeBillIndex]["sub"] = item;
				}
			})
		},
		//小程序上传图片
		uploadImage: function(){
			let that = this;
			that.$util.chooseImage({
				formData: {
					FileName: "TakeDelivery",
					UploadType: 10,
					SuffixName: ""
				}
			},function(data){
				that.callBack(data);
			});
		},
		//小程序上传文件
		uploadFileWX: function(){
			const that = this;
			wx.chooseMessageFile({
			  type: "file",
			  success (res) {
					let tempFlies = res.tempFiles;
					let bool = true;
					let fileTxt = "";
					tempFlies.forEach(function(item){
						let _split = item.name.split('.');
						let _suffix = _split[(_split.length-1)];
						if(_suffix == "pdf"){
							that.$util.ajaxUploadFile({
								formData: {
									FileName: "TakeDelivery",
									UploadType: 10,
									SuffixName: ("."+_suffix),
								},
								filePath: item.path,
								name: item.name
							},function(data){
								that.callBack(data);
							});
						}else{
							fileTxt += (fileTxt + item.name + "、");
							bool = false;
						}
					})
					if(!bool){
						fileTxt = fileTxt.substring(0, fileTxt.length - 1);
						uni.showModal({
						    title: '提示',
						    content: "目前文件支持xlsx、docx、doc、pdf上传,\n"+fileTxt+"上传失败!",
							showCancel: false,
						});
					}
				}
			})
		},
		callBack(data){
			let suffix = data.fileName.split('.')[1];
			let _url = data.data;
			if(suffix == "pdf"){
				_url = "../../static/images/pdf.png";
			}
			this.uploadList.push({
				"path": data.data,
				"suffix": suffix,
				"url": _url,
				"fileName": data.fileName
			});
		},
		//H5上传文件
		uploadFileH5: function(input, event){
			const that = this;
			let file = input.files[0];
			let _name = file.name;
			let _split = _name.split('.');
			let suffix = '.'+_split[(_split.length-1)];
			uni.uploadFile({
				url: that.apiUrl + '/Account/UploadFileWeb',
				header: { "token": that.token, "appId": that.appId },
				formData: {
					"FileName": "TakeDelivery",
					"UploadType": 10,
					"SuffixName": suffix
				},
				files: [
					{
						name: "update_file",
						file: file,
						uri: event.srcElement.value
					}
				],
				success: (res) => {
					let data = JSON.parse(res.data);
					if(data.errCode == 200){
						that.uploadList.push({
							"path": data.data,
							"suffix": suffix,
							"url": "../../static/images/pdf.png",
							"fileName": _name
						});
					}else{
						that.$util.showToast(data.message)
					}
				},
				fail: (err) => {
					console.log(err)
				}
			});
		},
		//删除图片
		delFile: function(key){
			this.uploadList = this.uploadList.filter(function(item, i){
				return i != key;
			});
		},
		btnConfirm: function(){
			this.$store.state.expressDeliveryInfo.service = this.newData;
			if(this.type != 1){
				if(this.isSwitch){
					if(this.takeDeliveryRemark == "" || this.uploadList.length == 0){
						this.$util.showToast("启用提货单后需提货单信息及要求!");
						return false;
					}
					this.$store.state.expressDeliveryInfo.takeBill = {
						"takeBill": this.isSwitch,
						"takeDeliveryRemark": this.takeDeliveryRemark,
						"takeDeliveryAttachment": this.uploadList
					}
				}else{
					this.$store.state.expressDeliveryInfo.takeBill = {};
				}
			}
			
			this.$util.navigateBack(this);
		},
		btnSelTH($data){
			this.newData[this.index].sub = {
				remark: $data.remark,
				serviceKey: $data.serviceKey,
				serviceValue: $data.serviceValue
			}
		},
		open(i){
			this.isShow = true;
			this.index = i;
		},
		close(){
			this.isShow = false;
			setTimeout(() => { this.$emit('close') }, 100)
		},
	}
}
</script>
<style scoped>
.mian{
	margin-top: 5px;
	padding: 0 15px;
	background-color: #FFFFFF;
}
.service-item{
	padding: 15px 0;
	border-top: 1px solid #F7F7F7;
	
}
.service-item > view{
	float: right;
	font-weight: bold;
}
.service-item > view text{
	color: #DBDBDB;
	padding-left: 5px;
	font-size: 14px;
	font-weight: normal;
}
.min-popup{
	position: fixed;
	top:0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
}
.min-hide .min-content{
	animation: hide .5s linear forwards;
}
.min-hide .min-overlay{
	opacity: 0;
}
.min-show .min-content{
	animation: show .5s linear forwards;
}
.min-show .min-overlay{
	opacity: 1;
}
.min-overlay{
	position: absolute;
	top:0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 200;
	transition: .3s;
}
.min-content{
	background: #fff;
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 300;
	overflow: hidden;
	padding: 25px 15px;
}

@keyframes hide {
	0% {
		transform: translateY(0);
	}
	100% {
		transform: translateY(100%);
	}
}
@keyframes show {
	0% {
		transform: translateY(100%);
	}
	100% {
		transform: translateY(0);
	}
}
.min-content .small-title{
	font-size: 15px;
	display: block;
}
.sub-list{
	display: flex;
	flex-flow: wrap;
	margin: 10px 0;
}
.sub-list text{
	display: block;
	margin-right: 10px;
	height: 30px;
	line-height: 30px;
	padding: 0 14px;
	background: #f7f7f7;
	margin-bottom: 10px;
}
.sub-list text.active{
	background-color: #d6ebff;
	background-image: url(../../static/images/icon-active.png);
	background-repeat: no-repeat;
	background-size: 18px;
	background-position: bottom right;
}
.note{
	display: block;
	font-size: 12px;
	color: #666;
}
.note.red{
	color: #FF0000;
}
.bill-title{
	background-color: #FFFFFF;
	margin: 10px 0;
	padding: 15px;
}
.take-bill-con{
	background-color: #FFFFFF;
	padding: 0 15px 15px;
}
.take-bill-con .small-title{
	display: block;
	padding: 15px 0;
}
.take-bill-con textarea{
	border: 1px solid #DBDBDB;
	display: block;
	width: calc(100% - 20px);
	height: 80px;
	padding: 5px 10px;
	border-radius: 3px;
}
.take-bill-con .img-list{
	padding-bottom: 10px;
	border-bottom: 1px solid #DBDBDB;
}
.take-bill-con .img-list > view{
	display: inline-block;
	width: 80px;
	height: 80px;
	overflow: hidden;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	margin-right: 8px;
	margin-top: 10px;
	border: 1px solid #eee;
}
.take-bill-con .img-list .icon-guanbi{
	float: right;
	color: #999;
	margin: 2px;
}
.take-bill-con .img-list image{
	width: 100%;
	height: 100%;
}
.take-bill-con .btn{
	display: flex;
	margin-top: 15px;
}
.take-bill-con .btn > view{
	position: relative;
	margin-right: 10px;
}
.take-bill-con .btn text{
	margin-right: 20px;
	font-size: 22px;
	color: #999999;
}
</style>
