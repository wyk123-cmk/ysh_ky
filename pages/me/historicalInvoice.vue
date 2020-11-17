<style scoped>
	@import "../../common/css/me/historicalInvoice.css";
</style>
<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<view v-if="total==0" class="none-data-list"><image src="../../static/images/none.svg"></image>暂无内容</view>
		<scroll-view v-else class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
			<view class="historical-list" v-for="(item, i) in dataList" :key="i">
				<view class="item-head">
					<view>
						<text class="bill-type">{{item.billTypeText}}</text>
						<text class="time">{{item.postTime}}</text>
					</view>
					<text v-if="item.state == 1" style="color:#FD9523">{{item.stateText}}</text>
					<text v-if="item.state == 2">{{item.stateText}}</text>
					<text v-if="item.state == 3" style="color:#999">{{item.stateText}}</text>
				</view>
				<text class="samll-title">{{item.expressCompany==null?'':item.expressCompany}}</text>
				<view class="item-bottom">
					<view class="">发票代码<text>{{item.invoiceCode==null?'--':item.invoiceCode}}</text></view>
					<view>发票号码<text>{{item.invoiceNo==null?'--':item.invoiceNo}}</text></view>
					<view class="amount">￥<text>{{item.amount}}</text></view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			page: 1,
			limit: 5,
			total: 0,
			dataList: []
		}
	},
	onShow() {
		this.showImage = getApp().globalData.isDiscountPopup;
		this.page = 1;
		this.dataList = [];
		this.getList()
	},
	methods: {
		scrolltolower:  function() {
			if(Math.ceil(this.total / this.limit) >= this.page){
				this.getList();
			}
		},
		getList: function(){
			const that = this;
			uni.showLoading({ title: '加载中...' });
			that.$util.networkRequest({
				url: "/Invoice/GetList",
				data: {
					page: that.page,
					limit: that.limit
				},
				success: function(res){
					let total = res.total;
					if(total == 0 || res.list.length == 0) return false;
					res.list.filter(item => {
						if(item.postTime != null && item.postTime != ""){
							item.postTime = that.$util.formatDate.format(item.postTime,"yyyy-MM-dd hh:mm")
						}
					});
					that.page++;
					that.total = total;
					that.dataList = that.dataList.concat(res.list);
				}
			})
		}
	}
}
</script>
