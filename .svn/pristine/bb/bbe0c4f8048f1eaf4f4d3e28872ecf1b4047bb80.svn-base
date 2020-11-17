<template>
	<view>
		<page-imges :show="showImage"></page-imges>
		<view v-if="total==0" class="none-data-list"><image src="../../static/images/none.svg"></image>暂无内容</view>
		<scroll-view v-else class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
			<view class="item-list" v-for="(item, i) in dataList" :key="i">
				<view class="time">提现<text>{{item.createTime}}</text></view>
				<view class="status">
					-{{item.amount}}
					<view v-if="item.status==0"><text>审核中</text></view>
					<view v-if="item.status==2" class="error"><text>审核失败</text>{{item.reason}}</view>
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
			limit: 15,
			total: 0,
			dataList: []
		}
	},
	onLoad(){
		this.showImage = getApp().globalData.isDiscountPopup;
		this.getList();
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
				url: "/Referral/GetAmountLogList",
				data: {
					page: that.page,
					limit: that.limit
				},
				success: function(res){
					console.log("资金明细:",res)
					let total = res.total;
					if(total == 0 || res.list.length == 0) return false;
					res.list.filter(item => {
						if(item.createTime != null && item.createTime != ""){
							item.createTime = that.$util.formatDate.format(item.createTime,"yyyy-MM-dd hh:mm")
						}
						item.amount = item.amount.toFixed(2);
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
<style scoped>
.scroll-wrapper{
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
.item-list{
	padding: 8px 15px;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	border-top: 1px solid #eee;
	line-height: 22px;
}
.item-list text{
	font-size: 12px;
}
.item-list .time text{
	display: block;
}
.item-list .status{
	text-align: right;
	max-width: 68%;
	word-wrap:break-word; 
	word-break:break-all;
	overflow: hidden;
}
.item-list .status text{
	color: #fe6603;
}
.item-list .status .error text{
	color: #FF0000;
	padding-right: 5px;
}
</style>
