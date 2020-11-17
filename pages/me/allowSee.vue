<template>
	<view class="page_view">
		<page-imges :show="showImage"></page-imges>
		<view class="heard-custom" :style="{marginTop: t+'px', height: h+'px', 'line-height': h+'px'}">
			<text class="iconfont icon-fanhui-" @click="goback()"></text>
			<text class="title_txt">允许他查看（{{total}}）</text>
			<view><text class="wanc" @click="CloseDelete()" v-if="isShow">完成</text></view>

		</view>

		<view class="contenr">
			<view class="ones_to">
					<view class="top">允许他(她)查看全部企业快递</view>
					<!-- #ifdef MP-WEIXIN -->
					<text class="wanc_sc" @click="CloseDelete()" v-if="isShow">完成</text>
								<!-- #endif -->
			</view>
		
		
			<scroll-view class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
				<view class="menm" v-for="(item,index) in memList" :key="index">
					{{item.userName}}<text>{{item.phone}}</text>
					<image src="../../static/images/delete-01.png" mode="aspectFit" v-if="isShow" @click="DeleteMem(item.phone)"></image>
				</view>
			</scroll-view>
			<view class="bot_btn">
				<button class="tianjia" @click="AddMem()">添加</button>
				<button class="tianjia" @click="Delete()">删除</button>
			</view>
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
				isShow: false,
				memList: [],
				serviceKey:""
			}
		},
		onLoad(options) {
			this.serviceKey=options.serviceKey;
			this.showImage = getApp().globalData.isDiscountPopup;
		},
		created() {

			var that = this;
			//#ifdef MP-WEIXIN
			uni.getSystemInfo({ //获取设备信息
				success: (res) => {
					//获取右上角胶囊的布局信息
					let rect = uni.getMenuButtonBoundingClientRect ? uni.getMenuButtonBoundingClientRect() : null;
					let height = 44;
					if (rect != null) {
						height = (rect.bottom + rect.top) - (res.statusBarHeight * 2);
					}
					that.t = res.statusBarHeight;
					that.h = height;
				}
			});
			//#endif

		},
		
		onShow() {
			this.page=1;
			this.memList=[];
			this.init()
		},
		methods: {
			init() {
				let that = this;
				let param = {
					page: this.page,
					limit: this.limit,
					serviceKey: this.serviceKey,
				
				}
				that.$util.networkRequest({
					url: "/CmpyRole/GetCmpyUserRoleList",
					data: param,
					success: res => {
						console.log(res);
						let total=res.total;
						that.page++;
						that.total=total;
						this.memList =that.memList.concat(res.list);
					}
				})
			},
			CloseDelete(){
				this.isShow=false;
			},
			scrolltolower(){
				if(Math.ceil(this.total/this.limit)>=this.page){
					this.init();
				}
			},
			goback() {
				uni.navigateBack({
				
				})
				// // #ifdef H5
				// this.$router.go(-1)
				// // #endif
				// // #ifdef MP-WEIXIN
				// uni.navigateBack({

				// })
				// // #endif
				
				
			},
			DeleteMem(phone) {
				let that = this;
				let param = {
					"serviceKey": this.serviceKey,
					"serviceValue": phone

				}
				that.$util.networkRequest({
					url: "/CmpyRole/DelRole",
					data: param,
					method: "POST",
					success: res => {
						console.log(res);
						that.page=1;
						that.memList=[];
						that.init()
						// that.memList = that.memList.filter(el => {
						// 	return el.phone != phone;
						// });
						
					}
				})
			},
			AddMem() {
				uni.navigateTo({
					url: "/pages/me/selectMember?serviceKey="+this.serviceKey
				})
			},
			//删除
			Delete() {
				this.isShow = true;
			}
		}
	}
</script>

<style scoped>
	page {
		background-color: #f7f7f7;
	}

	.page_view {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow-y: auto;
		background-color: #f7f7f7;
		overflow-x: hidden;

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
	}

	.contenr {
		position: fixed;
		top: 44px;
		width: 100%;
	}

	/* #ifdef MP-WEIXIN */
	.contenr {
		position: fixed;
		top: 65px;
		width: 100%;
	}

	/* #endif */
	.heard-custom {
		/* background: #FFFFFF; */
		position: fixed;
		width: 90%;
		display: flex;
		padding: 0px 5%;
		z-index: 10;
		align-items: center;
		text-align: center;
	}

	.heard-custom .news {
		position: absolute;
		padding: 0 15px;
	}

	.wanc {
		background-color: #007AFF;
		color: #FFFFFF;
		font-size: 13px;
		padding: 0px 10px;
		height: 25px;
		line-height: 25px;
		text-align: center;
		border-radius: 7px;
		align-self: flex-end;
		display: block;
	}
	.ones_to{
		position: relative;
		margin-bottom: 10px;
	}
	.wanc_sc{
		
			background-color: #007AFF;
			color: #FFFFFF;
			font-size: 13px;
			padding: 0px 10px;
			height: 25px;
			line-height: 25px;
			text-align: center;
			border-radius: 7px;
			position: absolute;
			right:15px;
			top:0px;
			display: block;
		
	}


	.heard-custom .title_txt {
		text-align: center;
		font-size: 14px;
		
margin-right: auto;
		align-self: center;
		margin-left: 100px;
	}
</style>
