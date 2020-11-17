<style scoped>
	@import "../../common/css/me/invoiceSubmit.css";
</style>
<template>
	<view style="background-color: #F7F7F7;">
		<text class="tips">开具增值税专用发票需满1000元，20号之前提交申请，25号统一寄出，且每月仅可申请一次</text>
		<text class="head-right" @click="isNotice=true,isTextarea=false">发票须知</text>
		<view class="form">
			<view class="label-list">
				<text class="name">发票类型</text>
				<radio-group class="radio" @change="radioChange">
					<radio color="#4285f4" value="DInvoince" :checked="invoiceData.invoiceType=='DInvoince'" /><text>电子普票</text>
					<radio v-if="isDisabled" color="#4285f4" value="ZInvoince" />
					<radio v-else color="#4285f4" value="ZInvoince" disabled="false" />
					<text :style="isDisabled?'':'color:#999'">专票</text>
				</radio-group>
			</view>
			<view class="label-list">
				<text class="name">发票抬头：</text>
				<input type="text" placeholder="企业开票请填写发票抬头" v-model="invoiceData.invoiceName" />
			</view>
			<view class="label-list">
				<text class="name">纳税人识别号：</text>
				<input type="text" placeholder="企业开票请填写纳税人识别号" v-model="invoiceData.invoiceNumber" />
			</view>
			<view class="label-list">
				<text class="name">开户银行名称：</text>
				<input type="text" placeholder="企业开票请填写开户银行名称" v-model="invoiceData.bankName" />
			</view>
			<view class="label-list">
				<text class="name">基本开户账号：</text>
				<input type="text" placeholder="企业开票请填写基本开户账号" v-model="invoiceData.bankCode" />
			</view>
			<view class="label-list">
				<text class="name">注册场所地址：</text>
				<input type="text" placeholder="企业开票请填写注册场所地址" v-model="invoiceData.cmpyAddress" />
			</view>
			<view class="label-list">
				<text class="name">注册固定电话：</text>
				<input type="text" placeholder="企业开票请填写注册固定电话" v-model="invoiceData.mobile" />
			</view>
			<view class="label-list">
				<text class="name">发票项目：</text>
				<input type="text" value="发票项目" disabled="true" v-model="invoiceData.invoiceProject" />
			</view>
			<view class="label-list">
				<text class="name">开票金额：</text>
				<input type="text" :value="'￥'+totalSum+'元'" disabled="true" />
			</view>
			<view class="label-list">
				<textarea v-if="isTextarea" maxlength="-1" placeholder="备注" v-model="invoiceData.invoiceRemark" cursor-spacing="70" :show-confirm-bar="false"></textarea>
				<text class="textarea-text" v-else>{{invoiceData.invoiceRemark==''?'备注':invoiceData.invoiceRemark}}</text>
			</view>
		</view>
		<view class="form">
			<view class="label-list" v-if="invoiceData.invoiceType!='DInvoince'">
				<text class="name">收票人姓名</text>
				<input type="text" placeholder="请填写收票人姓名" v-model="invoiceData.name" />
			</view>
			<view class="label-list" v-if="invoiceData.invoiceType!='DInvoince'">
				<text class="name">收票人手机</text>
				<input type="number" maxlength="11" placeholder="请填写收票人手机" v-model="invoiceData.invoicePhone" />
			</view>
			<view class="label-list">
				<text class="name">收票人邮箱</text>
				<input type="text" placeholder="用来接收电子发票" v-model="invoiceData.reviceEmail" />
			</view>
			<view class="label-list" v-if="invoiceData.invoiceType!='DInvoince'">
				<text class="name">收票地址</text>
				<address-picker class="address" @change="cityPickerChange" :disabled="false">
					<text class="txt" v-bind:class="[city==''?'no-checked':'']">{{city==''?'请选择':city}}</text>
				</address-picker>
			</view>
			<view class="label-list" v-if="invoiceData.invoiceType!='DInvoince'">
				<text class="name">详细地址</text>
				<input type="text" placeholder="如凤凰小区一单元1501" v-model="address" />
			</view>
			<view class="label-list checkbox" v-if="isFirstInvoice">
				<checkbox-group @change="checkboxChange">
					<checkbox class="orange" :checked="dataCheck" />
				</checkbox-group>
				我已确认信息无误<text>首次开票</text>
			</view>
		</view>
		<button class="btn-default-css" @click="confirm">确认开票</button>
		<view v-if="isNotice" @click="isNotice=false,isTextarea=true">
		  <view class="v-model"></view>
		  <view class="notice-popup">
		    <text class="title">发票须知</text>
		    <text>1、已开具发票的充值金额原则上不予退费，开具发票时敬请留意！</text>
		    <text>2、每月可申请开具一次增值税专用发票，20号之前提交申请，25号统一寄出。</text>
		    <text>3、申请开具增值税专用发票需满1000元。</text>
		    <text>4、发货金额可进行累计统一开票。</text>
		    <text>5、已开具发票的金额不可二次开票，请妥善保存好纸质票据。</text>
		    <text>6、如有其他票据疑问，请添加客服微信（13811418661）进行线上咨询。</text>
		  </view>
		</view>
		<view v-if="isInvoice">
			<view class="v-model"></view>
			<view class="invoice-popup">
				<text class="title">发票信息确认</text>
				<view class="info-list">
					<text>发票类型：</text>{{invoiceData.invoiceType == "DInvoince"?'电子普票': '专票'}}
				</view>
				<view class="info-list">
					<text>发票抬头：</text>{{invoiceData.invoiceName}}
				</view>
				<view class="info-list">
					<text>纳税人识别号：</text>{{invoiceData.invoiceNumber}}
				</view>
				<view class="info-list" v-if="invoiceData.invoiceType == 'ZInvoince'">
					<text>收票人手机号：</text>{{invoiceData.invoicePhone}}
				</view>
				<view class="btn">
					<text @click="isInvoice=false,isTextarea=true">取消</text>
					<text @click="twoConfirm">确认</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import addressPicker from "../../components/address-picker/address-picker.vue"
export default {
	data() {
		return {
			totalSum: "",
			city: "",
			address: "",
			isNotice: false,
			isInvoice: false,
			dataCheck: false,
			isFirstInvoice: true,
			isTextarea: true,
			invoiceData: {
				mastCodeList: [], //开票单号数组
				invoiceType: "",
				invoiceName: "",
				invoiceNumber: "",
				invoiceProject: "",
				bankName: "",
				bankCode: "",
				cmpyAddress: "",
				mobile: "",
				invoiceRemark: "",
				name: "",
				invoicePhone: "",
				reviceEmail: ""
			},
			isDisabled: true
		}
	},
	created(){
		let invoiceInfo = this.$store.state.cmpInvoiceData;
		let that = this;
		if(invoiceInfo != undefined){
			that.totalSum = invoiceInfo.totalSum;
			that.invoiceData.mastCodeList = invoiceInfo.mastCode;
			//限制企业发票 开票金额1000元以下只能开电子普票
			if(that.totalSum < 1000){ 
				that.isDisabled = false; 
				that.invoiceData.invoiceType = "DInvoince";
			}
		}
		that.$util.networkRequest({
			url: "/CompanyInvoice/GetInvoiceCmpyInfo",
			method: "POST",
			data: JSON.stringify(that.invoiceData.mastCodeList),
			success: res => {
				that.invoiceData.invoiceName = res.invoiceName;
				that.invoiceData.invoiceNumber = res.invoiceNumber;
				that.invoiceData.invoiceProject = res.invoiceProject;
				that.invoiceData.cmpyAddress = res.cmpyAddress;
				that.invoiceData.mobile = res.cmpyTel;
				that.invoiceData.bankName = res.bank;
				that.invoiceData.bankCode = res.bankAccount;
				that.invoiceData.name = res.name;
				that.invoiceData.invoicePhone = res.invoicePhone;
				that.isFirstInvoice = res.isFirstInvoice;
				that.getUserHistoryInfo();
			}
		});
	},
	methods: {
		//首次开票
		confirm: function(){
			if(this.Valid()){
				this.isInvoice = true;
				this.isTextarea = false;
			} 
		},
		//二次确认
		twoConfirm: function(){
			let that = this;
			let _name = "";
			let _phone = "";
			let _address = "";
			if(that.invoiceData.invoiceType == "ZInvoince"){
				_name = that.invoiceData.name;
				_phone = that.invoiceData.invoicePhone;
				_address = that.city + " " + that.address;
			}
			let params = {
				rechargeCodeList: that.invoiceData.mastCodeList,
				billType: that.invoiceData.invoiceType,
				invoiceName: that.invoiceData.invoiceName,
				invoiceNumber: that.invoiceData.invoiceNumber,
				invoiceRemark: that.invoiceData.invoiceRemark,
				bank: that.invoiceData.bankName,
				bankAccount: that.invoiceData.bankCode,
				cmpyAddress: that.invoiceData.cmpyAddress,
				cmpyTel: that.invoiceData.mobile,
				name: _name,
				phone: _phone,
				email: that.invoiceData.reviceEmail,
				address: _address
			};
			that.isInvoice = false;
			uni.showLoading({mask: true, title: '开票中...'});
			that.$util.networkRequest({
				url: "/CompanyInvoice/Post",
				method: "POST",
				data: params,
				success: res => {
					if (res == null || !res) return false;
					uni.showModal({
						title: '提示',
						content: "开票申请成功，等待审核!",
						showCancel: false,
						success() {
							uni.redirectTo({ url: '/pages/me/historicalInvoice' });
						}
					})
				}
			})
		},
		radioChange(e){
			this.invoiceData.invoiceType = e.detail.value;
		},
		checkboxChange(){
			this.dataCheck = !this.dataCheck;
		},
		cityPickerChange(e){
			this.city = e.detail.value[0]+'-'+e.detail.value[1]+'-'+e.detail.value[2];
		},
		//获取上次发票地址信息
		getUserHistoryInfo(){
			let that = this;
			that.$util.networkRequest({
				url: "/Invoice/GetLastInvoiceInfo",
				success: res => {
					if((res.address).indexOf("-") != -1){
						let str = (res.address).split("-");
						let str2 = str[2].split(" ");
						let a = "";
						let b = "";
						if(str2.length == 1){
							b = str[2];
						}else{
							a = "-" + str2[0];
							b = str2[1];
						}
						that.city = str[0] + "-" + str[1] + a;
						that.address = b;
					}
					that.invoiceData.reviceEmail = res.invoiceEmail;
				}
			});
		},
		Valid() {
			if(!this.$util.isNotEmpty(this.invoiceData.invoiceType)){
				this.$util.showToast("请选择发票类型");
				return false;
			}
			if(!this.$util.isNotEmpty(this.invoiceData.invoiceName)){
				this.$util.showToast("请填写发票抬头");
				return false;
			}
			if(!this.$util.isNotEmpty(this.invoiceData.invoiceNumber)){
				this.$util.showToast("请填写纳税人识别号");
				return false;
			}
			if(!this.$util.isNotEmpty(this.invoiceData.bankName)){
				this.$util.showToast("请填写开户银行");
				return false;
			}
			if(!this.$util.isNotEmpty(this.invoiceData.bankCode)){
				this.$util.showToast("请填写开户账号");
				return false;
			}
			if(!this.$util.isNotEmpty(this.invoiceData.cmpyAddress)){
				this.$util.showToast("请填写注册所在场地");
				return false;
			}
			if(!this.$util.isNotEmpty(this.invoiceData.mobile)){
				this.$util.showToast("请填写固定电话");
				return false;
			}
			if(this.invoiceData.invoiceType == "ZInvoince" && !this.$util.isNotEmpty(this.invoiceData.name)){
				this.$util.showToast("请填写收票人名称");
				return false;
			}
			if(this.invoiceData.invoiceType == "ZInvoince" && !this.$util.isNotEmpty(this.invoiceData.invoicePhone)){
				this.$util.showToast("请填写收票人手机");
				return false;
			}
			if(!this.$util.isNotEmpty(this.invoiceData.reviceEmail)){
				this.$util.showToast("请填写收票人邮箱");
				return false;
			}
			else if (!this.$util.isEmail(this.invoiceData.reviceEmail)) {
				this.$util.showToast("收票人邮箱格式错误");
				return false;
			}
			if(this.invoiceData.invoiceType == "ZInvoince" && !this.$util.isNotEmpty(this.city)){
				this.$util.showToast("请选择收票人地址信息");
				return false;
			}
			if(this.invoiceData.invoiceType == "ZInvoince" && !this.$util.isNotEmpty(this.address)){
				this.$util.showToast("请填写收票人详细地址信息");
				return false;
			}
			if (this.isFirstInvoice && !this.dataCheck) {
				this.$util.showToast("您是首次开票，请验证并确认开票信息无误");
				return false;
			}
			return true;
		}
	}
}
</script>
