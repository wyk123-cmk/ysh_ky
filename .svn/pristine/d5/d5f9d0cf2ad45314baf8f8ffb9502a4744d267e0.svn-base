<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<view class="form">
			<label>姓名<input type="text" placeholder="输入成员真实姓名" v-model="userName" /></label>
			<label>手机<input type="number" maxlength="11" placeholder="输入成员手机号" v-model="userPhone" /></label>
			<label>部门<input type="text" placeholder="输入成员部门" v-model="userPosition" /></label>
		</view>
		<button class="btn-default-css" @click="btnAddUser">添加成员</button>
	</view>
</template>
<script>
export default {
	data() {
		return {
			userName: "",
			userPhone: "",
			userPosition: ""
		}
	},
	onLoad() {
		this.showImage = getApp().globalData.isDiscountPopup;
	},
	methods: {
		btnAddUser: function(){
			const that = this;
			if (that.userName=="" || that.userName==null) {
				that.$util.showToast("请输入成员姓名");
				return false;
			}
			if (that.userPhone=="" || that.userPhone==null) {
				that.$util.showToast("请输入成员手机号");
				return false;
			}
			if (that.userPosition=="" || that.userPosition==null) {
				that.$util.showToast("请输入成员部门");
				return false;
			}
			let params={
				phone: that.userPhone,
				userName: that.userName,
				department: that.userPosition
			};
			uni.showLoading({mask: true, title: '加载中...'});
			that.$util.networkRequest({
				url : "/CompanyUser/AddUser",
				method: "POST",
				data: params,
				success: function(res){
					uni.showModal({
					    title: '提示',
					    content: '成员添加成功',
						showCancel: false,
						success: function () {
							that.$util.navigateBack(that);
						}
					});
				}
			})
		}
	}
}
</script>
<style scoped>
.form{
	background-color: #FFFFFF;
	margin-top: 8px;
	padding: 15px;
}
.form label{
	border: 1px solid #f7f7f7;
	padding: 15px;
	margin-bottom: 15px;
	border-radius: 4px;
	display: box;
	display: -webkit-box;
}
.form label input{
	height: 20px;
	line-height: 20px;
	font-size: 14px;
	width: 70%;
	margin-left: 10px;
}
.btn-default-css {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
}
</style>
