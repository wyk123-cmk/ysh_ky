<style scoped>
	@import "../../common/css/me/invoiceSubmit.css";
</style>
<template>
	<view style="background-color: #F7F7F7;">
		<page-imges :show="showImage"></page-imges>
		<text class="tips">根据相关规定，仪商汇快运暂时只提供电子发票，请谅解</text>
		<text class="head-right" @click="isNotice=true,isTextarea=false">发票须知</text>
		<view class="form">
			<view class="label-list">
				<text class="name">发票类型</text>
				<radio-group class="radio" @change="radioChange">
					<radio color="#4285f4" value="Company" checked="true" /><text>单位</text>
					<radio color="#4285f4" value="Person" /><text>个人</text>
				</radio-group>
			</view>
			<view v-if="invoiceData.invoiceType == 'Company'">
				<view class="label-list">
					<text class="name">发票抬头</text>
					<input type="text" placeholder="请填写发票抬头" v-model="invoiceData.invoiceName" @input="getCompanyName" />
					<view class="company-list" v-if="isShowCompany">
						<text v-for="(item, i) in companyData" :key="i" @click="btnCompanyName(item)">{{item.companyName}}</text>
					</view>
				</view>
				<view class="label-list">
					<text class="name">纳税人识别号</text>
					<input type="text" placeholder="企业开票请填写纳税人识别号" v-model="invoiceData.invoiceNumber" />
				</view>
			</view>
			<view v-if="invoiceData.invoiceType == 'Person'">
				<view class="label-list">
					<text class="name">姓名</text>
					<input type="text" placeholder="请填写开票人姓名" v-model="invoiceData.invoiceName" />
				</view>
				<view class="label-list">
					<text class="name">手机号</text>
					<input type="number" maxlength="11" placeholder="请填写开票人手机号" v-model="invoiceData.invoiceNumber" />
				</view>
			</view>
			<view class="label-list">
				<text class="name">发票项目</text>
				<input type="text" value="国内货物运输代理服务" disabled="true" />
			</view>
			<view class="label-list">
				<text class="name">开票金额</text>
				<input type="text" :value="'￥'+totalSum+'元'" disabled="true" />
			</view>
			<view class="label-list">
				<textarea v-if="isTextarea" maxlength="-1" placeholder="备注" v-model="invoiceData.invoiceRemark" cursor-spacing="70" :show-confirm-bar="false"></textarea>
				<text class="textarea-text" v-else>{{invoiceData.invoiceRemark==''?'备注':invoiceData.invoiceRemark}}</text>
			</view>
		</view>
		<view class="form">
			<view class="label-list">
				<text class="name">收票人姓名</text>
				<input type="text" placeholder="请填写收票人姓名" v-model="invoiceData.name" />
			</view>
			<view class="label-list">
				<text class="name">收票人手机</text>
				<input type="number" maxlength="11" placeholder="请填写收票人手机" v-model="invoiceData.phone" />
			</view>
			<view class="label-list">
				<text class="name">收票人邮箱</text>
				<input type="text" placeholder="用来接收电子发票" v-model="invoiceData.mail" />
			</view>
			<view class="label-list">
				<text class="name">收票地址</text>
				<address-picker class="address" @change="cityPickerChange" :disabled="false">
					<text class="txt" v-bind:class="[city==''?'no-checked':'']">{{city==''?'请选择':city}}</text>
				</address-picker>
			</view>
			<view class="label-list">
				<text class="name">详细地址</text>
				<input type="text" placeholder="详细地址" v-model="address" />
			</view>
		</view>
		<button class="btn-default-css" @click="confirm">确认开票</button>
		<view v-if="isNotice" @click="isNotice=false,isTextarea=true">
		  <view class="v-model"></view>
		  <view class="notice-popup">
		    <text class="title">发票须知</text>
		    <text>1、个人寄件，仪商汇快运暂时只提供增值税电子普通发票，请谅解</text>
		    <text>2、请确定发票信息填写无误，点击“申请发票”，开票后不支持修改</text>
		    <text>3、发票将在3-5个工作日内开好，电子普通发票以短信或邮件的形式发送至申请时填写的收票人手机或者邮箱上</text>
		  </view>
		</view>
		<view v-if="isInvoice">
			<view class="v-model"></view>
			<view class="invoice-popup">
				<text class="title">发票信息确认</text>
				<view class="info-list">
					<text>发票类型：</text>{{invoiceData.invoiceType == "Company"?'单位': '个人'}}
				</view>
				<view v-if="invoiceData.invoiceType == 'Company'">
					<view class="info-list">
						<text>发票抬头：</text>{{invoiceData.invoiceName}}
					</view>
					<view class="info-list">
						<text>纳税人识别号：</text>{{invoiceData.invoiceNumber}}
					</view>
				</view>
				<view v-if="invoiceData.invoiceType == 'Person'">
					<view class="info-list">
						<text>开票人姓名：</text>{{invoiceData.invoiceName}}
					</view>
					<view class="info-list">
						<text>开票人手机号：</text>{{invoiceData.invoiceNumber}}
					</view>
				</view>
				<view class="info-list">
					<text>收票人邮箱：</text>{{invoiceData.mail}}
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
			totalSum: 0,
			companyData: [],
			isShowCompany: false,
			city: "",
			address: "",
			isNotice: false,
			isInvoice: false,
			isTextarea: true,
			invoiceData: {
				mastCodeList: [], //开票单号数组
				invoiceType: "Company", //发票类型 = ['Company', 'Person']
				invoiceName: "", //发票抬头
				invoiceNumber: "", //纳税人识别号（企业开票必须,个人身份证号）
				billType: "PInvoince", //发票形式 = ['PInvoince', 'EInvoince']
				invoiceRemark: "", //发票备注
				name: "", //收件人姓名
				phone: "", //手机号码
				mail: "",
				address: "" //收件人地址
			},
		}
	},
	created() {
		this.showImage = getApp().globalData.isDiscountPopup;
		let invoiceInfo = this.$store.state.invoiceInfo;
		let that = this;
		if(invoiceInfo != undefined){
			that.totalSum = invoiceInfo.totalSum;
			that.invoiceData.mastCodeList = invoiceInfo.mastCode;
		}
		that.getUserHistoryInfo();
	},
	methods: {
		//确认开票
		confirm: function(){
			let that = this;
			let _param = that.invoiceData;
			if(_param.invoiceType == "Company"){
				if(!this.$util.isNotEmpty(_param.invoiceName)){
					that.$util.showToast("请填写发票抬头");
					return false;
				}
				if(!this.$util.isNotEmpty(_param.invoiceNumber)){
					that.$util.showToast("企业开票请填写纳税人识别号");
					return false;
				}
			}
			if(_param.invoiceType == "Person"){
				if(!this.$util.isNotEmpty(_param.invoiceName)){
					that.$util.showToast("请填写开票人姓名");
					return false;
				}
				if(!this.$util.isNotEmpty(_param.invoiceNumber)){
					that.$util.showToast("请填写开票人手机号");
					return false;
				}
			}
			if(!this.$util.isNotEmpty(_param.name)){
				that.$util.showToast("请填写收票人姓名");
				return false;
			}
			if(!this.$util.isNotEmpty(_param.phone)){
				that.$util.showToast("请填写收票人手机号");
				return false;
			}
			if(!this.$util.isNotEmpty(_param.mail)){
				that.$util.showToast("请填写收票人邮箱");
				return false;
			}
			if(!this.$util.isNotEmpty(that.city)){
				that.$util.showToast("请选择收票地址");
				return false;
			}
			if(!this.$util.isNotEmpty(that.address)){
				that.$util.showToast("请填写收票详细地址");
				return false;
			}
			_param.address = that.city + " " + that.address;
			that.isInvoice = true;
			that.isTextarea = false;
		},
		//二次确认
		twoConfirm: function(){
			let that = this;
			uni.showLoading({mask: true, title: '加载中...'});
			that.$util.networkRequest({
				url: "/Invoice/Post",
				method: "POST",
				data: that.invoiceData,
				success: res => {
					that.isInvoice = false;
					uni.redirectTo({ url: '/pages/me/historicalInvoice' });
				}
			})
		},
		btnCompanyName: function(data){
			this.isShowCompany = false;
			this.invoiceData.invoiceName = data.companyName;
			this.invoiceData.invoiceNumber = data.creditCode;
			this.companyData = [];
		},
		//搜索匹配企业名称
		getCompanyName: function(e){
			let that = this;
			let _val = e.detail.value;
			this.invoiceData.invoiceName = _val;
			if(_val == ""){
				that.isShowCompany = false;
				that.companyData = [];
				return false;
			}
			that.$util.networkRequest({
				url: "/Account/GetCompanyName",
				data: {keyWord: _val},
				success: res => {
					if(res.length == 0){
						that.isShowCompany = false;
					}else{
						that.isShowCompany = true;
					}
					that.companyData = res;
				}
			})
		},
		radioChange(e){
			this.invoiceData.invoiceType = e.detail.value;
			this.invoiceData.invoiceName = "";
			this.invoiceData.invoiceNumber = "";
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
					that.invoiceData.name = res.name;
					that.invoiceData.phone = res.invoicePhone;
					that.invoiceData.mail = res.invoiceEmail;
				}
			});
		},
	}
}
</script>