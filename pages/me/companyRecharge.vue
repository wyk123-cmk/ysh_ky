<style scoped>
	@import '../../common/css/me/companyRecharge.css';
</style>
<template>
	<view>
		<page-imges :show="showImage"></page-imges>
		<navigator url="/pages/me/rechargeRecord" class="head-right">充值记录</navigator>
		<view class="main">
			<view class="main-top">
				<view class="card-con">
					<view>
						<view class="copy" @click="setClip()"><text class="iconfont icon-copy1"></text>复制</view>
						<text>账户名称</text>
						<text class="cmp-name">{{cmpyInfo.companyName}}</text>
						<text class="bank">开户行</text>
						<text class="cmp-name bank">{{cmpyInfo.bank}}</text>
						<text class="bank-num">{{cmpyInfo.bankAccount}}</text>
					</view>
					<image class="bank-img" src="../../static/images/bank.svg"></image>
				</view>
				<view class="tips">
					友情提示：<text>线下充值后，请上传您的付款凭证（银行转账交易回单截图），工作日上班时间(09:00-18:00)平台将在收到款后2小时为您充值。</text>
				</view>
			</view>
			<view class="amount">
				充值金额
				<view>￥<input type="number" v-model="txtAmount" placeholder="请输入充值金额" placeholder-style="font-size: 16px" /></view>
			</view>
			<view class="voucher">
				上传凭证
				<textarea class="tear" placeholder="备注：" v-model="remark" cursor-spacing="150" :show-confirm-bar="false" @focus="getFocus()"></textarea>
				<view class="upload-box">
					<view class="img-list" v-for="(item, i) in bankImgUrl" :key="i">
						<image mode="widthFix"  :src="item" @click="previewImg(i)"></image>
						<text class="iconfont icon-guanbi" @click="delFile(i)"></text>
					</view>
					<view class="add-pic">
						<!-- #ifdef MP-WEIXIN -->
						<image mode="widthFix" @click="uploadBankPic()" src="../../static/images/add-pic.svg"></image>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<view ref="input" class="input-view"></view>
						<image mode="widthFix" src="../../static/images/add-pic.svg"></image>
						<!-- #endif -->
					</view>
				</view>
			</view>
		</view>
		<button class="btn-fixed-bottom" @click="submit()">提交凭证</button>
	</view>
</template>
<script>
export default {
	data() {
		return {
			cmpyInfo: [],
			bankImgUrl: [],
			txtAmount: "",
			remark: "",
			token: "",
			isPreview: false
		}
	},
	onShow(){
		let that = this;
		that.showImage = getApp().globalData.isDiscountPopup;
		if(that.isPreview) return false;
		that.token = uni.getStorageSync("token");
		uni.showLoading({ title: '加载中...' });
		that.$util.networkRequest({
			url: "/Company/GetCmpyAccountInfo",
			success: res => {
				res.bankAccount = res.bankAccount.replace(/\s/g, "").replace(/(\d{4})(?=\d)/g, "$1" + " ");
				that.cmpyInfo = res;
			}
		});
	},
	mounted() {
		const that = this;
		// #ifdef H5
		this.$util.$refsFileHtml({
			formData: {
				FileName: "CompanyRillRecord",
				UploadType: 1,
				SuffixName: ""
			},
			multiple: true,
			$input: this.$refs.input.$el
		}, function(data){
			that.bankImgUrl.push(data.data);
		});
		//#endif
	},
	methods: {
		//提交凭证
		submit: function(){
			const that = this;
			if(!this.$util.isNotEmpty(that.txtAmount)){
				that.$util.showToast("请填写充值金额");
				return false;
			}
			if(!this.$util.isNotEmpty(that.bankImgUrl)){
				that.$util.showToast("请上传充值凭证");
				return false;
			}
			uni.showLoading({mask: true, title: '加载中...'});
			that.$util.networkRequest({
				url: "/Company/Refill",
				method: "POST",
				data: {
					credentialsList: that.bankImgUrl,
					remark: that.remark,
					amount: that.txtAmount
				},
				success: res => {
					uni.showModal({
					    title: '提示',
					    content: '充值申请已提交,请等待审核',
						showCancel: false,
						success: function () {
							that.$util.navigateBack(that)
						}
					});
				}
			});
		},
		getFocus(){
			uni.createSelectorQuery().select(".tear").boundingClientRect(data=>{//目标节点
			　　　　uni.pageScrollTo({
			　　　　　　duration:0,//过渡时间必须为0，uniapp bug，否则运行到手机会报错
			　　　　　　scrollTop: data.top,//滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离
			　　　　})
			　　}).exec()
		},
		//上传凭证
		uploadBankPic: function(){
			let that = this;
			that.$util.chooseImage({
				formData: {
					FileName: "CompanyRillRecord",
					UploadType: 1,
					SuffixName: ""
				},
				count: 9,
			},function(data){
				that.bankImgUrl.push(data.data);
			});
		},
		//预览图片
		previewImg: function(key) {
			this.isPreview = true;
			uni.previewImage({
				current: key,
				urls: this.bankImgUrl
			})
		},
		//删除图片
		delFile: function(key){
			console.log(key)
			this.bankImgUrl = this.bankImgUrl.filter(function(item, i){
				console.log(i)
				return i != key;
			});
		},
		//复制
		setClip: function(){
			let val =  this.cmpyInfo.companyName + '\r\n' + this.cmpyInfo.bank + '\r\n' + this.cmpyInfo.bankAccount + '\r\n';
			uni.setClipboardData({ data: val, success: () => {
				uni.showToast({ title: "内容已复制", icon: 'success' });
			}});
		}
	}
}
</script>