<template>
	<view>
		<scroll-view class="item-scroll" scroll-y="true" @scrolltolower="scrolltolower">
			<image class="pic" mode="widthFix" :src="imgApiUrl+'/Content/img/feedback-bg.jpg'"></image>
			<text class="title">程序员近期工作汇报</text>
			<view class="container">
				<view class="item-list" v-for="(item, index) in listData" :key="index">
					<view class="content">{{item.maintainDes}}</view>
					<view class="zan" @click="praiseclick(item.Id)">
						<text class="iconfont icon-zan" v-if="item.active" style="color:#f00"></text>
						<text class="iconfont icon-zan" v-else></text>
						<text>{{item.upNum}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
import {feedBackApiUrl, imgApiUrl} from '../../common/js/config'
export default {
	data() {
		return {
			imgApiUrl: imgApiUrl,
			limit: 10,
			page: 1,
			total: 0,
			listData: [],
			token: "",
		}
	},
	created() {
		this.token = uni.getStorageSync("token");
		this.init();
	},
	methods: {
		scrolltolower: function(){
			if (Math.ceil(this.total / this.limit) >= this.page) {
				this.init();
			}
		},
		init: function(){
			const that = this;
			uni.request({
				url: feedBackApiUrl + "/userinfo/getsysmaintainlist",
				header: { "token": that.token, "appId": that.appId },
				data: {page: this.page, limit: this.limit},
				success: res => {
					let data = res.data.data;
					if(res.data.code != 200){
						this.$util.showToast(res.data.msg);
						return false;
					}
					let total = data.total;
					if(total == 0 || data.modellist.length == 0) return false;
					that.page++;
					that.total = total;
					that.listData = that.listData.concat(data.modellist);
				},
				fail: (res) => {
					this.$util.showToast(res.data.msg);
				},
			});
		},
		praiseclick: function(id) {
			var isdz = uni.getStorageSync('IsFirstdz');
			if(isdz=="" || isdz==null){
				var that = this;
				var json = that.listData;
				json.forEach(function(item, index) {
					if (item.Id == id) {
						item.upNum++;
						item.active = true;
					}
				});
				uni.request({
					url: feedBackApiUrl + "/userinfo/postsysmain",
					header: { "token": that.token, "appId": that.appId },
					method: 'POST',
					data: { userValue: "点赞", userType: id },
					success: res => {
						if(res.data.code != 200){
							this.$util.showToast(res.data.msg);
							return false;
						}
						this.$util.showToast("点赞成功");
						uni.setStorage({key: 'IsFirstdz', data: "yes"});
					},
					fail: (res) => {
						this.$util.showToast(res.data.msg);
					},
				});
				that.listData = json;
			}
			
		},
	}
}
</script>
<style scoped>
.item-scroll{
	background: #50a8ff;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow-y: auto;
}
.pic{
	width: 100%;
}
.title{
	color: #fff;
	font-size: 16px;
	padding: 5px 15px;
}
.container{
	background: #dceeff;
	margin: 0 15px;
}
.item-list{
	position: relative;
	padding: 10px 0;
	margin: 5px 15px;
	border-bottom: 1px solid #c5e2ff;
}
.item-list .content{
	min-height: 50px;
	width: 88%;
	font-size: 15px;
}
.item-list .zan{
	position: absolute;
	right: 0;
	top: 15px;
	text-align: center;
}
.item-list .iconfont{
	display: block;
	font-size: 20px;
	line-height: 20px;
}
</style>
