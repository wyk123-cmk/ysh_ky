<template>
	<view class="page_view">
		<page-imges :show="showImage"></page-imges>
		<view v-for="(item,index) in SetList" :key="index">
			<view class="top">{{item.title}}</view>
			<view class="ones" v-for="(item,index) in item.list" :key="index" @click="goPage(item.isSwitch,item.serviceKey)">
				{{item.remark}}
				<switch class="swi" v-if="item.isSwitch" @change="SwitchChange($event,item.serviceKey)" :checked="item.isChoose"></switch>
				<view class="swi" v-else><text class="iconfont icon--right-jian"></text></view>
			</view>
		</view>
		<!-- <view class="ones" >
			允许他(她)查看
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				SetList: [],
				SWchecked: false
			}
		},
		onLoad() {
			let that = this;
			that.showImage = getApp().globalData.isDiscountPopup;
			that.$util.networkRequest({
				url: "/CmpyRole/GetRoleList",
				data: {},
				success: res => {
					console.log(res);
					this.SetList = res;
					// this.SetList.forEach(item=>{
					// 	if(item.remark=="允许成员查看" && item.isChoose){
					// 		this.SWchecked=true;
					// 	}
					// })
				}
			})
		},
		methods: {
			goPage(isSwitch, serviceKey) {
				if (isSwitch == false) {
					uni.navigateTo({
						url: "/pages/me/allowSee?serviceKey=" + serviceKey
					})
				}

			},
			SwitchChange(e, key) {
				console.log(e.detail.value);
				this.SWchecked = e.detail.value;
				let that = this;
				let param = [{
					"serviceKey": key,
					"serviceValue": String(this.SWchecked) 
				}]

				that.$util.networkRequest({
					url: "/CmpyRole/SetCmpyRole",
					data: param,
					method: "POST",
					success: res => {
						console.log(res);

					}
				})
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

	.ones {
		padding: 5px 15px;
		background-color: #FFFFFF;
		position: relative;
		width: calc(100%-30px);
		display: flex;
		height: 35px;
		line-height: 35px;
		border-bottom: 1px solid #EEEEEE;

	}

	.swi {
		float: right;
		position: absolute;
		right: 15px;
	}
</style>
