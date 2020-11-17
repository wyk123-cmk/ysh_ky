<template>
	<view>
		<text class="title" :style="{marginTop: t+'px', height: h+'px', 'line-height': h+'px'}">完善个人信息</text>
		<form class="form">
			<label class="form-label">
				公司名称<input type="text" placeholder="请填写公司名称" v-model="companyName" @input="getCompanyName" />
			</label>
			<label class="form-label">
				姓名<input type="text" placeholder="请填写您的真实姓名" v-model="userName" />
			</label>
			<label class="form-label">
				职位<input type="text" placeholder="请填写所任职务" v-model="userJob" />
			</label>
			<button class="btn" @click="btnFinish">完成</button>
			<text class="tips">为确保您的账号安全及正常使用，依据国家相关法律法规，您需要填写实名资料，感谢您的理解与支持!</text>
			<view class="company-list" v-if="isShowCompany">
				<text v-for="(item, i) in companyData" :key="i" @click="btnCompanyName(item.companyName)">{{item.companyName}}</text>
			</view>
		</form>
	</view>
</template>
<script>
export default {
	data() {
		return {
			t: 0,
			h: 44,
			type: 0,
			companyName: "",
			userName: "",
			userJob: "",
			types:"",
			companyData: [],
			isShowCompany: false
		}
	},
	onLoad(options) {
		this.type = options.type;
		this.types = options.types;
	},
	created: function(){
		const that = this;
		that.getMeInfo();
		//#ifdef MP-WEIXIN
		uni.getSystemInfo({ //获取设备信息
			success: (res) => {
				//获取右上角胶囊的布局信息
				let rect = uni.getMenuButtonBoundingClientRect?uni.getMenuButtonBoundingClientRect():null;
				let height = 44;
				if(rect != null){
					height = (rect.bottom + rect.top) - (res.statusBarHeight * 2);
				}
				that.t = res.statusBarHeight;
				that.h = height;
			}
		});
		//#endif
	},
	methods: {
		btnFinish: function(){
			let that = this;
			if (!that.Valid()) return false;
			let params = {
				userCompanyName: that.companyName,
				realName: that.userName,
				position: that.userJob
			}
			that.$util.networkRequest({
				url: "/Account/UpdateUserInfo",
				method: "POST",
				data: params,
				success: res => {
					if(res){
						if(that.type == 0){
							uni.reLaunch({url: "/pages/index/index?types="+that.types});
							// uni.switchTab({url: "/pages/index/index?types="+that.types});
						}else{
							uni.switchTab({url: "/pages/me/userInfo"});
						}
					}else{
						uni.showModal({
						    title: '提示',
						    content: '完善失败,请联系管理员',
							showCancel: false,
						    success: function (res) {
						        if (res.confirm) {
						           that.exit();
						        }
						    }
						});
					}
				}
			});
		},
		btnCompanyName: function(_val){
			this.isShowCompany = false;
			this.companyName = _val;
			this.companyData = [];
		},
		//获取用户信息
		getMeInfo(){
			const that = this;
			that.$util.networkRequest({
				url: "/Account/Get",
				success: res => {
					that.userName = res.userName == null || res.userName == ""?"":res.userName;
					that.userJob = res.userJob == null || res.userJob == ""?"":res.userJob;
					that.companyName = res.userCompanyName == null || res.userCompanyName == ""?"":res.userCompanyName;
				}
			});
		},
		//搜索匹配企业名称
		getCompanyName: function(e){
			let that = this;
			let _val = e.detail.value;
			that.companyName = _val;
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
		//退出登录
		exit(){
			let that = this;
			let _recordType = 1; //1:公众号;2:小程序;3:pc
			// #ifdef H5
			// #endif
			// #ifdef MP-WEIXIN
			_recordType = 2
			// #endif
			that.$util.networkRequest({
				url: "/Account/Logout",
				method: "POST",
				data: {
					value: _recordType
				},
				success: res => {
					uni.removeStorageSync('token');
					that.$util.navigateBack(that);
				}
			})
		},
		Valid() {
			if (!this.$util.isNotEmpty(this.companyName)) {
				this.$util.showToast("公司名称不能为空");
				return false;
			}
			if (!this.$util.isNotEmpty(this.userName)) {
				this.$util.showToast("用户姓名不能为空");
				return false;
			}
			if (!this.$util.isNotEmpty(this.userJob)) {
				this.$util.showToast("职位信息不能为空");
				return false;
			}
			return true;
		}
	}
}
</script>
<style scoped>
.title{
	display: block;
	padding-left: 15px;
	border-bottom: 1px solid #f7f7f7;
}
.form{
	margin: 0 15px;
	display: block;
	position: relative;
}
.form-label{
	border: 1px solid #F7F7F7;
	display: flex;
	display: -webkit-flex;
	align-items: center;
	padding: 12px;
	margin-top: 15px;
}
.form-label input{
	margin-left: 20px;
	width: 72%;
}
.btn{
	background: #4285F4;
	color: #fff;
	margin: 30px 0 20px;
	line-height: 40px;
}
.tips{
	font-size: 12px;
	color: #FF0000;
}
.company-list{
	border: 1px solid #F7F7F7;
	position: absolute;
	top: 45px;
	left: 0;
	right: 0;
	z-index: 2;
	background-color: #fff;
	max-height: 300px;
	overflow-y: auto;
}
.company-list text{
	display: block;
	margin: 10px 15px 10px;
}
</style>
