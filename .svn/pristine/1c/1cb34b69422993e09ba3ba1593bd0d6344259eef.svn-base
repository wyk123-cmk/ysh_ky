<template>
	<view class="page_view">
		<page-imges :show="showImage"></page-imges>
		<view class="heard-custom" :style="{marginTop: t+'px', height: h+'px', 'line-height': h+'px'}">
			<text class="iconfont icon-fanhui-" @click="goback()"></text>
			<text class="title_txt">选择成员</text>
			<view>
				<!-- #ifdef H5 -->
				<text class="wanc" @click="Enter()">确定({{num}})</text>
				<!-- #endif -->
				</view>

		</view>
		<view class="contenr">
			<view class="ser_suo">
				<view class="search-btn" >
					<input type="text" v-model="searchtext" @input="inputSearch" class="inp_op" placeholder="搜索" />
					<text class="iconfont icon-chaxun"></text>
				</view>
			</view>
			<scroll-view class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
				<view class="invoice-item-list" v-for="(item,index) in memList" :key="index">
					<checkbox-group class="checkbox-radio" @change="checkboxChange($event,item.phone)">
						<view class="chek_view" >
							<checkbox v-if="item.isChoose" checked="true" disabled="true" class="checkbox_gray"/>
							<checkbox :value="item.phone"  class="checkbox-qx" v-else/>
							<text>{{item.userName}}</text>
							<text class="dianhua">{{item.phone}}</text>
						</view>
					</checkbox-group>

				</view>
			</scroll-view>
			<!-- #ifdef MP-WEIXIN -->
				<text class="wanc_mp" @click="Enter()">确定({{num}})</text>
			<!-- #endif -->
		
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
				limit: 10,
				searchtext: "",
				num:0,
				total:0,
				checkData:[],
				memList: [ ],
				serviceKey:"",
			}
		},
		created() {
			var that = this;
			that.showImage = getApp().globalData.isDiscountPopup;
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
		onLoad(options) {
			this.serviceKey=options.serviceKey;
			this.init();
		},
		watch:{
			
		},
		methods: {
			inputSearch(e){
				this.searchtext=e.detail.value;
				this.page=1;
				this.memList=[];
				this.init();
			},
			init(){
				let that = this;
				let param = {
					page: this.page,
					limit: this.limit,
					serviceKey: this.serviceKey,
					keyWord: this.searchtext
				
				}
				that.$util.networkRequest({
					url: "/CmpyRole/GetList",
					data: param,
					success: res => {
						console.log(res);
						let total = res.total;
						if(total == 0 || res.list.length == 0) return false;
						that.page++;
						that.total = total;
						that.memList = that.memList.concat(res.list);
					}
				})
			},
			goback() {
				// #ifdef H5
				this.$router.go(-1)
				// #endif
				// #ifdef MP-WEIXIN
				uni.navigateBack({

				})
				// #endif
			},
			scrolltolower(){
				if(Math.ceil(this.total / this.limit) >= this.page){
					this.init();
				}
			},
			Enter(){
				let that = this;
				let param = this.checkData;
					
				that.$util.networkRequest({
					url: "/CmpyRole/SetCmpyRole",
					data: param,
					method: "POST",
					success: res => {
						console.log(res);
						if(res){
							uni.navigateBack({
								
							})
						}
						// this.memList = res;
					}
				})
			},
			checkboxChange(e,phone){
				console.log(e.detail.value);
				
				if(e.detail.value.length > 0){
					var item={
						 "serviceKey": this.serviceKey,
						    "serviceValue": phone
					}
					this.checkData.push(item)
					
				}else{
					
					this.checkData = this.checkData.filter(el => {
						return el.serviceValue != phone;
					});
				}
				this.num=this.checkData.length;
				console.log(this.checkData);
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

	.chek_view {
		background-color: #FFFFFF;
		padding: 10px 15px;
		font-size: 15px;
		margin-top: 10px;
	}

	.dianhua {
		color: #666666;
		margin-left: 20px;
	}

	.ser_suo {
		background-color: #FFFFFF;
		padding: 10px 0px;
	}

	.search-btn {
		height: 35px;
		display: flex;
		display: -webkit-flex;
		background: #f7f7f6;
		margin: 0 15px;
		border-radius: 15px;
		align-items: center;
		justify-content: flex-start;
		color: #999;
		position: relative;
	}

	.inp_op {
		position: absolute;
		left: 30px;
	}

	.search-btn .iconfont {
		padding-right: 5px;
		color: #999;
		padding-left: 10px;
	}

	.contenr {
		position: fixed;
		top: 44px;
		width: 100%;
	}

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

	/* #ifdef MP-WEIXIN */
	.contenr {
		position: fixed;
		top: 65px;
		width: 100%;
	}

	/* #endif */
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
		border-radius: 3px;
		align-self: flex-end;
		display: block;
	}
	.wanc_mp{
		background-color: #007AFF;
		color: #FFFFFF;
		font-size: 13px;
		padding: 0px 10px;
		height: 35px;
		line-height: 35px;
		text-align: center;
		border-radius: 3px;
		margin:20px auto;
		width:120px;
		display: block;
	}


	.heard-custom .title_txt {
		text-align: center;
		font-size: 14px;
		width: 70%;

		align-self: center;
		margin-left: auto;
	}
	/* #ifdef MP-WEIXIN */
	.heard-custom .title_txt {
		text-align: center;
		font-size: 14px;
		width: 95%;
	
		align-self: center;
		margin-left: auto;
	}
	/* #endif */
</style>
