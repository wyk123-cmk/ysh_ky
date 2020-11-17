<template>
<view>
	<page-imges :show="showImage"></page-imges>
	<view v-if="total==0" class="none-data-list"><image src="../../static/images/none.svg"></image>暂无内容</view>
	<scroll-view v-else class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
		<view class="item-list" v-for="(item, i) in dataList" :key="i" @click="goDiscountLine(item)">
			<image mode="widthFix" :src="item.filePath"></image>
			<text class="name">{{item.title}}</text>
			<text class="time" v-if="item.bool">{{item.diffDate==0?"已结束":"剩余"+item.diffDate+"天"}}</text>
			<text class="time" v-else>开始时间: {{item.startTime}}</text>
		</view>
		<text v-if="dataList.length == total" class="no-more">—— 我是有底线的 ——</text>
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
	onLoad(){
		this.showImage = getApp().globalData.isDiscountPopup;
		this.page = 1;
		this.dataList = [];
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
				url: "/Activity/GetList",
				data: {
					page: that.page,
					limit: that.limit
				},
				success: function(res){
					let total = res.total;
					if(total == 0 || res.list.length == 0) return false;
					res.list.forEach(item => {
						item.bool = true;
						let s = that.$util.formatDate.format(item.startTime);
						let c = that.$util.formatDate.format(item.createTime);
						item.startTime = s;
						item.filePath = item.filePath.replace(/\s*/g, "");
						if((new Date(c).getTime() - new Date(s).getTime() ) < 0){
							item.bool = false;
						}
					});
					that.page++;
					that.total = total;
					that.dataList = that.dataList.concat(res.list);
				}
			})
		},
		goDiscountLine: function(item){
			if(item.diffDate == 0) return false;
			uni.navigateTo({
				url: "discountLine"
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
	min-height: 130px;
	margin: 15px 15px 0;
	position: relative;
	overflow: hidden;
}
.item-list image{
	display: block;
	width: 100%;
	min-height: 134px;
	border-radius: 8px;
}
.item-list .name,
.item-list .time{
	position: absolute;
	left: 15px;
	color: #FFFFFF;
}
.item-list .name{
	font-size: 22px;
	top: 15px;
}
.item-list .time{
	background-color: rgba(0,0,0,0.5);
	font-size: 12px;
	line-height: 24px;
	padding: 0 8px;
	border-radius: 5px;
	bottom: 10px;
}
</style>
