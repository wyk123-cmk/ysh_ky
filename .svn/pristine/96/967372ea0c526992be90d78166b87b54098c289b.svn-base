<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<view class="head-right" @click="CloseDelete()" v-if="isShow">完成</view>
		<scroll-view class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
			<view class="menm" v-for="(item,index) in companyList" :key="index">
				<view class="addres_inf">
					{{item.name}}<text>{{item.phone}}</text>
				</view>
				<view class="desc_add">{{item.areaInfo.province+item.areaInfo.city+item.areaInfo.area+item.address}}</view>
				<image src="../../static/images/delete-01.png" mode="aspectFit" v-if="isShow" @click="DeleteAdd(item.id)"></image>
			</view>
		</scroll-view>
		<view class="bot_btn">
			<button class="tianjia" @click="AddMem()">添加</button>
			<button class="tianjia" @click="Delete()">删除</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				t: 0,
				h: 44,
				page: 1,
				limit:10,
				total:0,
				companyPage:1,
				isShow: false,
				companyList: [],
				serviceKey:""
			}
		},
		created() {
		
			var that = this;
		},
		onShow() {
			this.showImage = getApp().globalData.isDiscountPopup;
			this.companyPage=1;
			this.companyList=[];
			this.init();
		},
		methods: {
			init(){
				const that = this;
				that.getList(that.companyPage, 2, function(res){
					console.log(res);
					that.companyPage++;
					that.total = res.total;
					that.companyList = that.companyList.concat(res.list);
					
				})
			},
			scrolltolower(){
				if (Math.ceil(this.total / this.limit) >= this.companyPage) {
					this.init();
				}
			},
			getList: function(page, type, callback){
				const that = this;
				uni.showLoading({ title: '加载中...' });
				that.$util.networkRequest({
					url: "/AddressBook/GetShareListByPage",
					data: {
						page: page,
						limit: that.limit,
					},
					success: function(res){
						let total = res.total;
						uni.setNavigationBarTitle({ title: "共享他(她)("+total+")" });
						if(total == 0 || res.list.length == 0) return false;
						if(callback) callback(res);
					}
				})
			},
			AddMem() {
				uni.navigateTo({
					url: "/pages/news/selectAddress?serviceKey="+this.serviceKey
				})
			},
			//完成
			CloseDelete(){
				this.isShow=false;
			},
			Delete() {
				this.isShow = true;
			},
			DeleteAdd(id){
				const that = this;
			
				that.$util.networkRequest({
					url: "/AddressBook/DelShareAddress",
					data: {
						id:id
					},
					method:"POST",
					success: function(res){
						that.companyPage=1;
						that.companyList=[];
					that.init();
					}
				})
			}
		}
	}
</script>

<style scoped>
.scroll-wrapper{
	position: absolute;
	top: 30px;
	left: 0;
	right: 0;
	bottom: 60px;
	overflow-y: auto;
}

.addres_inf{
	font-size:15px;
	color:black;
}
.addres_inf text{
	font-size:14px;
	color:#666666;
}
.desc_add{
	font-size:14px;
	color:black;
	width:90%;
}
	.top {
		padding: 5px 15px;


	}

	.bot_btn {
		padding: 10px 5%;
		font-size: 15px;
		width: 90%;
		display: flex;
		justify-content: space-around;
		position: fixed;
		bottom: 0px;
	}

	.tianjia {
		color: #FFFFFF;
		background-color: #007AFF;
		text-align: center;
		height: 40px;
		line-height: 40px;
		padding: 0px 15px;
		width: 42%;
	}

	.menm {
		background-color: #FFFFFF;
		padding: 10px 15px;
		font-size: 15px;
		width: calc(100%-30px);
		margin-bottom: 10px;
		display: flex;
		flex-direction: column;
		line-height: 22px;
		position: relative;
	}

	.menm text {
		color: #666666;
		margin-left: 20px;
		margin-right: auto;
	}

	.menm image {
		width: 20px;
		height: 20px;
		align-self: flex-end;
		position: absolute;
		top:25px;
		right:20px;
		
	}

</style>
