<style scoped>
	@import '../../common/css/me/reportForms.css';
</style>
<template>
<view>
	<page-imges :show="showImage"></page-imges>
	<view class="none-data-list" v-if="dataList.length==0"><image src="../../static/images/none.svg"></image>暂无寄送地统计</view>
	<view v-if="dataList.length>0">
		<view class="e-s-t">寄送地统计</view>
		<view class="e-time">{{year}}年{{month==""?"":month+"月"}}</view>
		<view class="total-con">
			<view class="sort" @click="sortClick">
				<text class="iconfont" :class="sort?'icon-paixu':'icon-paixu1'"></text>
				<text class="txt">寄出单</text>
			</view>
			<text>{{fromMoreCityName}}共发货{{fromCount}}单</text>
			<text>{{toMoreCityName}}共收件{{toCount}}单</text>
		</view>
		<scroll-view class="scroll-wrapper statistics" scroll-y="true" @scrolltolower="scrolltolower">
			<view class="table">
				<view class="tr">
					<view class="th">城市</view>
					<view class="th">寄件数量</view>
					<view class="th">收件数量</view>
				</view>
				<view class="tr" v-for="(item, i) in dataList" :key="i">
					<view class="td">{{item.cityName}}</view>
					<view class="td send-num"><text>{{item.fromCount}}</text></view>
					<view class="td rep-num"><text>{{item.toCount}}</text></view>
				</view>
			</view>
		</scroll-view>
	</view>
</view>
</template>
<script>
export default {
	data() {
		return {
			sort: true,
			page: 1,
			limit: 15,
			year: "",
			month: "",
			total: 0,
			dataList: [],
			fromMoreCityName: "",
			fromCount: "",
			toMoreCityName: "",
			toCount: "",
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
		sortClick: function(){
			this.sort = !this.sort;
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
				url: "/ExpressReport/GetCityReportListByPage",
				data: {
					page: that.page,
					limit: that.limit,
					year: that.year,
					month: that.month,
					fromdesc: that.sort
				},
				success: function(res){
					let total = res.citylist.total;
					if(total == 0 || res.citylist.list.length == 0) return false;
					res.citylist.list.filter(item => {
						if(item.postTime != null && item.postTime != ""){
							item.postTime = that.$util.formatDate.format(item.postTime,"yyyy-MM-dd hh:mm")
						}
					});
					that.page++;
					that.total = total;
					that.fromMoreCityName = res.fromMoreCityName;
					that.fromCount = res.fromCount;
					that.toMoreCityName = res.toMoreCityName;
					that.toCount = res.toCount;
					that.dataList = that.dataList.concat(res.citylist.list);
				}
			})
		}
	}
}
</script>