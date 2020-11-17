<style scoped>
	@import '../../common/css/me/reportForms.css';
</style>
<template>
<view>
	<page-imges :show="showImage"></page-imges>
	<view class="none-data-list" v-if="dataList.length==0"><image src="../../static/images/none.svg"></image>暂无员工发货统计</view>
	<view v-if="dataList.length>0">
		<view class="e-s-t">员工发货地统计</view>
		<view class="e-time">{{year}}年{{month==""?"":month+"月"}}</view>
		<view class="total-con">
			<view class="sort" @click="isSort=true">
				<text class="iconfont icon-paixu"></text>
				<text class="txt">{{sort=="am"?'按金额':'按单量'}}</text>
			</view>
			<text>共发货{{totalNum}}单</text>
			<text>{{totalAmount==0?"":"¥"+totalAmount}}</text>
			<view v-if="isSort">
				<view class="v-model"></view>
				<view class="select">
					<text class="iconfont icon-sanjiao"></text>
					<view :style="sort=='am'?'color: #4285F4':''" @click="sortClick('am')">按金额</view>
					<view :style="sort=='num'?'color: #4285F4':''" @click="sortClick('num')">按单量</view>
				</view>
			</view>
		</view>
		<scroll-view class="scroll-wrapper employee" scroll-y="true" @scrolltolower="scrolltolower">
			<view class="list" v-for="(item, i) in dataList" :key="i">
				<view class="name">{{item.employeeName}}
					<text>{{sort=="num"?'¥'+item.totalAmount:item.totalCount+'单'}}</text>
				</view>
				<view class="classify">
					<view>
						<image src="../../static/images/caigou.png"></image>
						{{item.logisticsCount}}单&nbsp;&nbsp;¥{{item.logisticsMarket}}
					</view>
					<view>
						<image src="../../static/images/kuaidixiaoge.png"></image>
						{{item.expressCount}}单&nbsp;&nbsp;¥{{item.expressMarket}}
					</view>
				</view>
				<view class="total-num">{{sort=="am"?'¥'+item.totalAmount:item.totalCount+'单'}}</view>
			</view>
		</scroll-view>
	</view>
</view>
</template>
<script>
export default {
	data() {
		return {
			isSort: false,
			sort: "am",
			page: 1,
			limit: 10,
			year: "",
			month: "",
			total: 0,
			dataList: [],
			totalNum: 0,
			totalAmount: 0,
		}
	},
	onLoad(options){
		if(options.date.indexOf('-') != -1){
			this.year = (options.date).split('-')[0];
			this.month = (options.date).split('-')[1];
		}else{
			this.year = options.date;
		}
		this.init();
		this.showImage = getApp().globalData.isDiscountPopup;
	},
	methods: {
		init: function(){
			this.page = 1;
			this.total = 0;
			this.dataList = [];
			this.getList()
		},
		sortClick: function(type){
			this.isSort = false;
			if(this.sort == type) return false;
			this.sort = type;
			this.init();
		},
		scrolltolower: function(){
			if(Math.ceil(this.total / this.limit) >= this.page){
				this.getList();
			}
		},
		getList: function(){
			const that = this;
			uni.showLoading({ title: '加载中...' });
			that.$util.networkRequest({
				url: "/ExpressReport/GetEmpliyeeReportListByPage",
				data: {
					page: that.page,
					limit: that.limit,
					year: that.year,
					month: that.month,
					sort: that.sort
				},
				success: function(res){
					let total = res.employeeList.total;
					if(total == 0 || res.employeeList.list.length == 0) return false;
					res.employeeList.list.filter(item => {
						if(item.postTime != null && item.postTime != ""){
							item.postTime = that.$util.formatDate.format(item.postTime,"yyyy-MM-dd hh:mm")
						}
					});
					that.page++;
					that.total = total;
					that.totalNum = res.totalNum;
					that.totalAmount = res.totalAmount;
					that.dataList = that.dataList.concat(res.employeeList.list);	
				}
			})
		}
	}
}
</script>