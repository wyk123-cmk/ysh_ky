<template>
<view class="page-bg" v-if="isShow">
	<view class="tips">
		{{dataInfo.batchTime}} 共{{dataInfo.expressCount}}条待处理信息,处理进度<text>{{dataInfo.progress}}</text>
	</view>
	<view class="item-list" v-for="(item, i) in dataInfo.orderList" :key="i" @click="goPage(item.enCode)">
		<view class="info">
			<text class="number">{{item.expressCode}}</text>
			<text>寄件时间: {{item.sendTime}}</text>
			<text v-if="item.status=='已投'">保单号: {{item.insuranceCode}}</text>
		</view>
		<view class="status">
			<text class="txt" :class="item.status=='已投'?'active':''">{{item.status}}</text>
			<text v-if="item.status=='已投'">{{item.insuranceTime}}</text>
		</view>
	</view>
</view>
</template>
<script>
export default {
	data() {
		return {
			keys: "",
			total: 0,
			dataInfo: {
				orderList:[],
			},
			isShow: false
		}
	},
	onLoad(options) {
		this.keys = options.keys;
		this.getList();
	},
	methods: {
		getList: function(){
			const that = this;
			uni.showLoading({ title: '加载中...' });
			that.$util.networkRequest({
				url: "/InsuranceCompany/GetExpressList",
				data: { keys: this.keys },
				success: function(res){
					(res.orderList).filter(item => {
						if(item.sendTime != null && item.sendTime != ""){
							item.sendTime = that.$util.formatDate.format(item.sendTime,"yyyy-MM-dd hh:mm");
							item.insuranceTime = that.$util.formatDate.format(item.insuranceTime,"yyyy-MM-dd hh:mm");
						}
						if(item.insuranceTime != null && item.insuranceTime != ""){
							item.insuranceTime = that.$util.formatDate.format(item.insuranceTime,"yyyy-MM-dd hh:mm");
						}
					});
					that.dataInfo = res;
					that.isShow = true;
				}
			})
		},
		goPage: function(code){
			uni.navigateTo({
				url: "warrantyDetail?code="+code
			})
		}
	}
}
</script>
<style scoped>
.tips{
	font-size: 12px;
	color: #666666;
	padding: 5px 0;
	text-align: center;
}
.tips text{
	color: #4285F4;
	padding: 0 2px;
}
.item-list{
	background-color: #FFFFFF;
	margin: 0 15px 10px;
	border-radius: 5px;
	padding: 10px 10px 5px;
	display: flex;
	justify-content: space-between;
}
.item-list text{
	display: block;
	margin-bottom: 5px;;
}
.item-list .info{
	width: calc(100% - 90px);
	width: -webkit-calc(100% - 90px);
	width: -moz-calc(100% - 90px);
	color: #666666;
}
.item-list .info .number{
	font-weight: bold;
	font-size: 16px;
	color: #333333;
	margin-bottom: 5px;
}
.item-list .status{
	width: 80px;
	text-align: right;
	color: #666;
	font-size: 12px;
}
.item-list .status .txt{
	font-size: 14px;
}
.item-list .status .txt.active{
	color: #4285F4;
}
</style>
