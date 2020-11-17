<template>
	<view>
		<page-imges :show="showImage"></page-imges>
		<view style="padding-bottom: 80px;">
			<view class="label-input-item">
				<input type="text" placeholder="姓名" v-model="addressInfo.name" />
			</view>
			<view class="label-input-item">
				<input type="text" placeholder="手机号" v-model="addressInfo.phone" />
			</view>
			<view class="label-input-item">
				<address-picker class="address" @change="cityPickerChange" :defaultValue="areaCode" :disabled="false">
					<text class="txt" v-bind:class="[city==''?'no-checked':'']">{{city==''?'省市区':city}}</text>
				</address-picker>
			</view>
			<view class="label-input-item">
				<input type="text" placeholder="详细地址（精确到门牌号）" v-model="addressInfo.address" />
			</view>
			<view class="label-input-item">
				<input type="text" placeholder="公司名称（选填)"  v-model="addressInfo.companyName" />
			</view>
			<view class="label-input-item">
				<text class="clean" @click="cleanInfo">清空当前信息</text>
				<checkbox-group @change="checkboxChange">
					<checkbox class="orange" :checked="addressInfo.isDefault"></checkbox>
					<text>设为默认地址</text>
				</checkbox-group>
			</view>
			<view class="label-input-item textarea">
				<view>
					<textarea v-show="!isRecognition" maxlength="-1" v-model="txtContent" @confirm="btnCopyOk" @input="textareaInput" @focus="getFous()" class="tear" placeholder="粘贴地址信息,例:姓名,手机号,地址" cursor-spacing="150" :show-confirm-bar="false"></textarea>
					<view class="bottom" v-if="isCopyShow">
						<text class="tips">地址智能识别存在误差,请核实后在提交信息</text>
						<text class="text-btn" @click="btnCopyOk">确定</text>
					</view>
					<view class="bottom voice" v-if="!isCopyShow && isTalkBtn" @click="openTalk">
						<image src="../../static/images/voice.png"></image>语音识别
					</view>
				</view>
			</view>
			<view class="label-input-item switch" v-if="isCompany">
				<text>共享该地址</text>
				<switch class="switch-btn" :checked="isWarning" color="#4285F4" @change="switchChange" />
			</view>
		</view>
		<view class="btn">
			<button @click="btnSubmit">确定</button>
		</view>
		<view v-if="isRecognition">
			<view class="v-model" @click="cancelTalk"></view>
			<view class="talk">
				<view class="title">语音识别</view>
				<view class="quan">
					<view class="quan-1" v-if="talkEnd">
						<view class="quan-2">
							<view class="quan-3"></view>
						</view>
					</view>
					<view class="img"></view>
				</view>
				<text class="btn-default-css" v-if="!talkEnd" @click="streamRecord">点击说话</text>
				<button v-else class="btn-default-css" @click="endStreamRecord">说完了</button>
			</view>
		</view>
	</view>
</template>
<script>
import addressPicker from "../../components/address-picker/address-picker.vue"
// #ifdef MP-WEIXIN
var plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager();
//#endif
export default {
	data() {
		return {
			code: "",
			type: "",
			city: "",
			areaCode: "",
			isCopyShow: false,
			txtContent: "",
			addressInfo: {
				name: "",
				companyName:  "",
				phone:  "",
				address:  "",
				isDefault: false
			},
			url: "/AddressBook/Post",
			isWarning: false,
			isTalkBtn: true,
			isCompany: false,
			isRecognition: false,
			talkEnd: false
		}
	},
	components: {
		addressPicker
	},
	onBackPress(event){
		if(event.from=="backbutton"){
			// uni.navigateTo({
			// 	url:"/pages/me/addressList"
			// })
		}
	},
	onLoad(options) {
		const that = this;
		that.code = options.addresscode==undefined?'':options.addresscode;
		that.isTalkBtn = true;
		that.showImage = getApp().globalData.isDiscountPopup;
		if(that.code != '') {
			that.getAddressInfo();
			that.url = "/AddressBook/Change";
			uni.setNavigationBarTitle({ title: "编辑地址" });
		}
		if(that.$util.IsPC()){
			that.isTalkBtn = false;
		}
		//判断是否加入企业
		that.$util.networkRequest({
			url : "/Company/IsRegister",
			success : function(res){
				if(res){
					that.isCompany = true;
				}
			},
		})
		if(options.type != undefined) that.type = options.type;
		// #ifdef MP-WEIXIN
		// 识别结束事件
		manager.onStop = (res) => {
			let text = res.result;
			console.log('识别结束事件',res)
			uni.hideLoading();
			// 用户没有说话，可以做一下提示处理...
			if(text == '') {
				that.talkEnd = false;
				that.$util.showToast("未识别到语音,请重试!");
				return
			}
			that.txtContent = text;
			that.isRecognition = false;
			that.isCopyShow = true;
			that.talkEnd = false;
		}
		manager.onError = function (res) {
			uni.hideLoading();
			that.$util.showToast("未识别到语音,请重试!");
			that.talkEnd = false;
			console.log("onError:",res)
		}
		//#endif
	},
	
	methods: {
		btnSubmit: function(){
			const that = this;
			if (!that.Valid()) return false;
			let param = {
				contactsCode: that.code,
				name: that.addressInfo.name,
				phone: that.addressInfo.phone,
				companyName: that.addressInfo.companyName,
				areaCode: that.areaCode,
				address: that.addressInfo.address,
				isDefault: that.addressInfo.isDefault,
				isShare: that.isWarning
			}
			uni.showLoading({title:"更新中...",mask: true});
			that.$util.networkRequest({
				url: that.url,
				method: "POST",
				data: param,
				success: function(res){
					that.setAddressEdit(res);
					let msg = "添加成功";
					if(that.code != ""){ msg = "更新成功"; }
					uni.showModal({
					    title: "提示",
					    content: msg,
						showCancel: false,
					    success: function (res) {
					        if (res.confirm) {
								that.$util.navigateBack(that);
					        }
					    }
					});
				}
			})
		},
		getFous(){
			uni.createSelectorQuery().select(".tear").boundingClientRect(data=>{//目标节点
				uni.pageScrollTo({
					duration:0,//过渡时间必须为0，uniapp bug，否则运行到手机会报错
					scrollTop: data.top,//滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离
				})
			}).exec()
		},
		setAddressEdit: function(data){
			if(this.type == "") return false;
			let newData = {
				name: data.name,
				contactsCode: data.contactsCode,
				address: data.areaInfo.province+data.areaInfo.city+data.areaInfo.area+data.address,
				ad: data.address,
				areaCode: data.areaInfo.areaCode,
				phone: data.phone
			};
			if(this.type == "send"){
				if(data.contactsCode == this.$store.state.expressDeliveryInfo["repAddress"].contactsCode){
					return false;
				}
				this.$store.state.expressDeliveryInfo["sendAddress"] = newData;
			}
			if(this.type == "rep"){
				if(data.contactsCode == this.$store.state.expressDeliveryInfo["sendAddress"].contactsCode){
					return false;
				}
				this.$store.state.expressDeliveryInfo["repAddress"] = newData;
			}
		},
		switchChange: function (e) {
			this.isWarning = e.target.value;
		},
		//清空信息
		cleanInfo(){
			this.addressInfo.name = "";
			this.addressInfo.phone = "";
			this.addressInfo.companyName = "";
			this.addressInfo.address = "";
			this.addressInfo.isDefault = false;
			this.city = "";
			this.areaCode = "";
			this.txtContent = "";
			this.isCopyShow = false;
		},
		textareaInput: function(e){
			let _val = e.detail.value;
			if(_val == "") this.isCopyShow = false;
			else this.isCopyShow = true;
		},
		//复制信息
		btnCopyOk: function(){
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			});
			let that = this;
			let addText = that.$util.stripAddress(that.txtContent);
			uni.showLoading({title:"智能识别中..."});
			that.$util.networkRequest({
				url: "/AddressBook/GetAddressAutoInfo",
				data: {addressText: addText},
				success: function(res){
					that.addressInfo.name = res.name;
					that.addressInfo.phone = res.phone;
					that.addressInfo.address = res.detail;
					that.areaCode = res.areaCode;
					if(!that.$util.isNotEmpty(res.province) && !that.$util.isNotEmpty(res.city) && !that.$util.isNotEmpty(res.area)){
						that.$util.showToast("自动识别失败,请手动选择省市区");
						return false;
					}
					that.city = res.province+"-"+res.city+"-"+res.area;
				}
			})
		},
		Valid(){
			if(!this.$util.isNotEmpty(this.addressInfo.name)){
				this.$util.showToast("姓名不能为空");
				return false;
			}
			if(!this.$util.isNotEmpty(this.addressInfo.phone)){
				this.$util.showToast("手机号不能为空");
				return false;
			}else{
				if (this.addressInfo.phone.indexOf("*") < 0) {
					/**
					 * 限制电话号码
					 * input文本框中不能输入中文和英文
					 * */
					let reg = /^[A-Za-z|\u4e00-\u9fa5]/;
					if(/[A-Za-z]/.test(this.addressInfo.phone)) {
						this.$util.showToast("联系电话格式不正确");
						return false;
					}else if(/[\u4e00-\u9fa5]/.test(this.addressInfo.phone)) {
						this.$util.showToast("联系电话格式不正确");
						return false;
					}
				}
			}
			if(!this.$util.isNotEmpty(this.areaCode)){
				this.$util.showToast("请选择省市区");
				return false;
			}
			if(!this.$util.isNotEmpty(this.addressInfo.address)){
				this.$util.showToast("详细地址不能为空");
				return false;
			}
			return true;
		},
		checkboxChange(){
			this.addressInfo.isDefault = !this.addressInfo.isDefault;
		},
		cityPickerChange(e){
			this.city = e.detail.value[0]+'-'+e.detail.value[1]+'-'+e.detail.value[2];
			this.areaCode = e.detail.code[2];
		},
		getAddressInfo(){
			const that = this;
			uni.showLoading({mask: true, title: '加载中...'});
			that.$util.networkRequest({
				url: "/AddressBook/Get",
				data: {contactsCode: that.code},
				success: function(res){
					that.addressInfo = res;
					that.isWarning = res.isShare;
					that.city = res.areaInfo.province+'-'+res.areaInfo.city+'-'+res.areaInfo.area;
					that.areaCode = res.areaInfo.areaCode;
				}
			})
		},
		//打开语音
		openTalk: function(){
			const that = this;
			// #ifdef H5
			that.isRecognition = true;
			//#endif
			// #ifdef MP-WEIXIN
			wx.authorize({
				scope: 'scope.record',
				success() {
					that.isRecognition = true;
				},
				fail(){
					wx.showModal({
						title: '提示',
						content: '您未授权录音，功能将无法使用',
						showCancel: true,
						confirmText: "授权",
						success: function (res) {
							if (res.confirm) {
								wx.openSetting({
									success: (res) => {
										if (!res.authSetting['scope.record']) {
											//未设置录音授权
											console.log("未设置录音授权");
										}else{
											//第二次才成功授权
											that.$util.showToast("设置录音授权成功");
										}
									}
								})
							}
						},
					})
				}
			})
			//#endif
		},
		//取消说话
		cancelTalk: function(){
			this.isRecognition = false;
			this.talkEnd = false;
			// #ifdef H5
			this.$util._H5_stopRecord(0)
			// #endif
			// #ifdef MP-WEIXIN
			manager.stop();
			//#endif
		},
		//按住按钮开始语音识别
		streamRecord: function(){
			let that = this;
			// #ifdef H5
			that.$util._H5_startRecord(function(){
				that.talkEnd = true;
			});
			//#endif
			// #ifdef MP-WEIXIN
			that.talkEnd = true;
			manager.start({ duration: 60000, lang: 'zh_CN' });
			//#endif
		},
		//松开按钮结束语音识别
		endStreamRecord: function(e){
			let that = this;
			// #ifdef H5
			if(uni.getSystemInfoSync().platform == "android"){
				uni.showLoading({
					mask: true,
					title: "正在识别……"
				});
			}
			that.$util._H5_stopRecord(1,function(res){
				uni.hideLoading();
				that.txtContent = res.translateResult;
				that.isRecognition = false;
				that.isCopyShow = true;
				that.talkEnd = false;
			});
			//#endif
			// #ifdef MP-WEIXIN
			uni.showLoading({
				mask: true,
				title: "正在识别……"
			})
			//有新的识别内容返回，则会调用此事件
			manager.onRecognize = (res) => {
				console.log("有新的识别内容返回，则会调用此事件",res);
				manager.stop();
			}
			//#endif
		}
	}
}
</script>
<style>
page {
	background-color: #F7F7F7;
}
</style>
<style scoped>
page {
	background-color: #F7F7F7;
}
.label-input-item{
	border-top: 1px solid #EEEEEE;
	background-color: #FFFFFF;
	padding: 10px 15px;
	position: relative;
	line-height: 30px;
}
.label-input-item input{
	line-height: 30px;
	height: 30px;
}
.label-input-item checkbox-group{
	display: flex;
	display: -webkit-flex;
	align-items: center;
}
.label-input-item .clean{
	float: right;
	color: #FD9523;
}
.label-input-item.textarea{
	margin-top: 8px;
	padding: 20px 15px;
	border: 0;
}
.label-input-item.textarea > view{
	height: 115px;
	border: 1px solid #EEEEEE;
}
.label-input-item.textarea textarea{
	color: #999999;
	line-height: 22px;
	border-radius: 4px;
	padding: 8px;
	width: calc(100% - 16px);
	width: -webkit-calc(100% - 16px);
	height: 65px;
}
.label-input-item.textarea .bottom{
	position: absolute;
	bottom: 25px;
	right: 20px;
	z-index: 99;
}
.label-input-item.textarea .tips{
	font-size: 12px;
	text-align: right;
	color: #f00;
	padding-right: 6px;
}
.label-input-item.textarea .text-btn{
	background: #fd9523;
	color: #fff;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
}
.label-input-item checkbox-group,
.label-input-item .no-checked{
	color: #808080;
}
.btn{
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #FFFFFF;
	padding: 10px 15px;
	z-index: 100;
}
.btn button{
	background-color: #4285F4;
	color: #FFFFFF;
	line-height: 44px;
	border-radius: 20px;
}
.label-input-item.switch{
	margin-top: 8px;
	border-top: 0;
	color: #808080;
}
.label-input-item.switch .switch-btn{
	float: right;
}
.voice{
	display: flex;
	align-items: center;
	margin-right: 5px;
	color: #808080;
}
.voice image{
	width: 12px;
	height: 16px;
	margin-right: 5px;
}
.talk{
	position: fixed;
	top: 50%;
	left: 40px;
	right: 40px;
	z-index: 1000;
	transform: translate3d(0, -50%, 0);
	background-color: #FFFFFF;
	border-radius: 10px;
	text-align: center;
	color: #9B9B9B;
}
.talk .title{
	text-align: center;
	font-size: 18px;
	padding: 20px 0;
}

.talk .btn-default-css{
	background-color: #FD9523;
	width: 60%;
	margin: 0 auto 20px;
}
.quan{
	position: relative;
	height: 120px;
}
.quan-1{
	width: 120px;
	height: 120px;
	border-radius: 50%;
	border: 1px solid #FD9523;
	animation: pulse 5s infinite;
	margin: 0 auto;
}
.quan-2{
	width: 80px;
	height: 80px;
	border-radius: 50%;
	border: 1px solid #FD9523;
	margin: 20px auto;
}
.quan-3{
	width: 60px;
	height: 60px;
	border-radius: 50%;
	border: 1px solid #FD9523;
	margin: 10px auto;
}
.talk .img{
	background: url(../../static/images/voice.png);
	background-size: 25px 35px;
	width: 25px;
	height: 35px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate3d(-50%, -50%, 0);
}
.talk text{
	display: block;
	background-color: #FFFFFF !important;
	color: #666666;
}
@keyframes pulse {
    0% {
		transform:scale(0);
		opacity: 0;
    }
	25%{
		transform:scale(0.25);
		opacity: 0.5;
	}
    50% {
		transform:scale(0.5);
		opacity: 1;
    }
	75%{ 
		transform:scale(0.75);
		opacity: 0.5;
	}
    100% {
		transform:scale(1);
		opacity: 0;
    }
}
</style>