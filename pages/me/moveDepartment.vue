<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<view class="item-list" v-for="(item, i) in dataList" :key="i" @click="active(item.departMentName)">
			{{item.departMentName}}
			<text :class="department==item.departMentName?'iconfont icon-dui':''"></text>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			id: "",
			department: "",
			activeIndex: 0,
			dataList: []
		}
	},
	onLoad(options){
		this.id = options.id;
		this.department = decodeURIComponent(options.department);
		this.getCmpyUserDepartment();
		this.showImage = getApp().globalData.isDiscountPopup;
	},
	methods: {
		active: function(name){
			this.department = name;
			const that = this;
			that.$util.networkRequest({
				url: "/CompanyUser/SetUserDepaterment",
				method: "POST",
				data: {
					id: that.id,
					department: that.department
				},
				success: res => {
				}
			});
		},
		//获取企业部门列表
		getCmpyUserDepartment: function(){
			const that = this;
			that.$util.networkRequest({
				url: "/CompanyUser/GetCmpyUserDepartment",
				success: res => {
					that.dataList = res.departmentLsit;
				}
			});
		},
		
	}
}
</script>
<style scoped>
.item-list{
	display: flex;
	display: -webkit-flex;
	background-color: #FFFFFF;
	padding: 10px 15px;
	align-items: center;
	border-top: 1px solid #F7F7F7;
	justify-content: space-between;
	line-height: 18px;
}
.item-list .iconfont{
    color: #4385f5;
}
</style>
