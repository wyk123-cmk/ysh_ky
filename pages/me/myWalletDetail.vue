<template>
	<view>
		<page-imges :show="showImage"></page-imges>
		<view class="way-type" @click="isSearchType=!isSearchType">交易类型<text class="iconfont icon-shouqi"></text></view>
		<view v-if="total==0" class="none-data-list"><image src="../../static/images/none.svg"></image>暂无内容</view>
		<scroll-view v-else class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
			<view class="item-list" v-for="(item, i) in dataList" :key="i" @click="goPage(item.id)">
				<view>
					<text class="text">{{item.amountText}}</text>
					<text class="time">{{item.logTime}}</text>
				</view>
				<text class="amount" :style="item.amountSymbol.indexOf('+')>-1?'color:#fd9523':''"> {{item.amountSymbol}}</text>
				<!-- <text class="amount" v-else style="color:#fd9523;">+{{item.amount}}</text> -->
			</view>
		</scroll-view>
		<view class="search-type" v-if="isSearchType">
			<text v-for="(item, k) in searchType" :key="k" @click="btnSelSub(k)" v-bind:class="[tabIndex==k?'active':'']">{{item}}</text>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			page: 1,
			limit: 15,
			total: 0,
			billType: "",
			dataList: [],
			isSearchType: false,
			tabIndex: 0,
			searchType: ["全 部","收 入","支 出"]
		}
	},
	onLoad(){
		this.getWalletDetail();
		this.showImage = getApp().globalData.isDiscountPopup;
	},
	methods: {
		btnSelSub: function(key){
			switch (key) {
				case 0: //全部
					this.billType = "";
					break;
				case 1: //收入
					this.billType = "Refill";
					break;
				case 2: //支出
					this.billType = "Payment";
					break;
			}
			this.page = 1;
			this.dataList = [];
			this.isSearchType = false;
			this.tabIndex = key;
			this.getWalletDetail();
		},
		scrolltolower:  function() {
			if(Math.ceil(this.total / this.limit) >= this.page){
				this.getWalletDetail();
			}
		},
		getWalletDetail: function(){
			let that = this;
			uni.showLoading({ title: '加载中...' });
			that.$util.networkRequest({
				url: "/Wallet/GetLog",
				data: {
					limit: that.limit,
					page: that.page,
					amountType: that.billType
				},
				success: res => {
					let total = res.total;
					that.total = total;
					if(total == 0 || res.list.length == 0) return false;
					res.list.filter(item => {
						if(item.logTime != null && item.logTime != ""){
							item.logTime = that.$util.formatDate.format(item.logTime,"yyyy-MM-dd hh:mm")
						}
						item.amount = item.amount.toFixed(2);
					});
					that.page++;
					that.dataList = that.dataList.concat(res.list);
				}
			})
		},
		goPage: function(id){
			uni.navigateTo({url: "/pages/me/myWalletInfo?id="+id});
		}
	}
}
</script>
<style scoped>
.way-type{
	height: 36px;
	background: #f7f7f7;
	line-height: 36px;
	color: #999;
	padding: 0 15px;
}
.way-type text{
	padding-left: 5px;
	font-size: 12px;
}
.search-type{
	display: flex;
	align-items: center;
	flex-flow: wrap row;
	justify-content: space-between;
	padding: 15px;
	position: fixed;
	z-index: 2;
	left: 0;
	right: 0;
	top: 36px;
	background: #fff;
}
/* #ifdef H5 */
.search-type{
	top: 76px;
}
/* #endif */
.search-type text{
	width: 30%;
	text-align: center;
	height: 36px;
	line-height: 36px;
	background: #f7f7f7;
	margin-bottom: 10px;
}
.search-type text.active{
	color: #4285F4;
}
.scroll-wrapper{
	position: absolute;
	top: 36px;
	left: 0;
	right: 0;
	bottom: 0;
}
.item-list{
	padding: 15px;
	display: flex;
	flex-flow: nowrap row;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid #f7f7f7;
}
.item-list .text{
	font-size: 15px;
}
.item-list text{
	display: block;
}
.item-list .time{
	font-size: 13px;
	color: #999;
}
.item-list .amount{
	font-size: 16px;
	font-weight: bold;
}
</style>
