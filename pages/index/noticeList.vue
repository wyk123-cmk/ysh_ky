<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<view v-if="total==0" class="none-data-list"><image src="../../static/images/none.svg"></image>暂无内容</view>
		<scroll-view v-else class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
			<view v-for="(item, i) in dataList" :key="i" class="item-list" @click="goPage(item)">
				<text class="iconfont icon-gonggao"></text>
				<view>
					<view class="flex">
						<text class="title">{{item.title}}</text>
						<text class="time">{{item.createDate}}</text>
					</view>
					<view class="info notices_content" v-html="item.noticesContent"></view>
				</view>
				<text class="iconfont icon--right-jian"></text>
			</view>
		</scroll-view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			page: 1,
			limit:10,
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
		goPage: function(data){
			let link = data.titlePath;
			if(link == "" || link == null){
				uni.navigateTo({url: "/pages/index/noticeDetails?code="+data.noticesCode});
			}else{
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: "/pages/web-view/index?url=" + link
				});
				// #endif
				// #ifdef H5
				window.location.href = link;
				// #endif
			}
		},
		scrolltolower:  function() {
			if(Math.ceil(this.total / this.limit) >= this.page){
				this.getList();
			}
		},
		getList: function(){
			const that = this;
			uni.showLoading({ title: '加载中...' });
			that.$util.networkRequest({
				url: "/Notices/GetList",
				data: {
					page: that.page,
					limit: that.limit
				},
				success: function(res){
					let total = res.total;
					if(total == 0 || res.list.length == 0) return false;
					res.list.filter(item => {
						item.createDate = that.$util.formatDate.format(item.createDate,"MM-dd");
						item.noticesContent = item.noticesContent.replace(/<\/?.+?\/?>/g, "");
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
	background-color: #FFFFFF;
	margin: 15px;
	padding: 14px;
	display: flex;
	align-items: center;
}
.item-list .icon--right-jian{
	color: #999999;
}
.item-list .icon-gonggao{
	display: block;
    width: 50px;
    height: 50px;
	background-color: #ecf2fe;
	border-radius: 50px;
	font-size: 26px;
	text-align: center;
	line-height: 48px;
	color: #7199EF;
}
.item-list > view{
	width: calc(100% - 76px);
	width: -webkit-calc(100% - 76px);
	margin-left: 10px;
}
.item-list .flex{
	display: flex;
	align-items: center;
}
.item-list .flex .title{
	font-weight: bold;
	max-width: 70%;
}
.item-list .flex .time{
	color: #989898;
	padding-left: 15px;
}
.item-list .flex .title,
.item-list .info{
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.item-list .info{
	display: block;
	font-size: 12px;
	color: #999999;
	padding-top: 4px;
}
</style>