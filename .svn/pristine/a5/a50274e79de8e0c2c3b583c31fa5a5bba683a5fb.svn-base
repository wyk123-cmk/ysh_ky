<template>
	<view>
		<page-imges :show="showImage"></page-imges>
		<view class="tab-nav">
			<view @click="clickTab(i)" :class="tabIndex==i?'active':''" v-for="(tab, i) in tabNav" :key="i">
				<text>{{tab}}</text>
			</view>
		</view>
		<view class="search">
			<input type="text" placeholder="输入订单号、姓名" @input="changeInput" confirm-type="search" placeholder-style="text-align: center;" />
			<view></view>
		</view>
		<view>
			<view v-if="total==0" class="none-data-list"><image src="../../static/images/none.svg"></image>暂无内容</view>
			<scroll-view v-else class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
				<view v-for="(item, i) in dataList" :key="i" class="mail-list" >
					<view class="num"><image src="../../static/images/qy.png" mode="aspectFit" class="qy_img" v-if="item.isCompany"></image>订单号: {{item.mastCode}}</view>
					<view class="order-con" @click="goDetails(item,1)">
						<view class="info">
							<text class="name">{{item.goods.name}}</text>
							<text>体积: {{item.goods.volume}}m³</text>
							<text class="money" v-if="item.status==3">¥ {{item.price}}</text>
						</view>
					</view>
					<view class="state"  @click="goDetails(item)">
						<view>
							<text>寄件信息</text>
							<text v-if="item.expressFrom==null">--</text>
							<text v-else>{{item.expressFrom.name}}-{{item.expressFrom.areaInfo.province}}</text>
						</view>
						<view>
							<text>收件信息</text>
							<text v-if="item.expressTo==null">--</text>
							<text v-else>{{item.expressTo.name}}-{{item.expressTo.areaInfo.province}}</text>
						</view>
						<view>
							<text>状态</text>
							<text v-if="item.status==2" style="color: #F09236;">{{item.statusText}}</text>
							<text v-else>{{item.statusText}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<navigator url="./createOrder">
			<button class="btn-fixed-bottom">创建订单</button>
		</navigator>
	</view>
</template>
<script>
export default {
	data() {
		return {
			tabNav: ["全部","待报价","待支付","运输中","已取消"],
			tabIndex: 0,
			keyword: "",
			page: 1,
			limit: 5,
			total: 0,
			dataList: []
		}
	},
	onLoad(){
		let app = getApp();
		app.isToken();
		this.showImage = app.globalData.isDiscountPopup;
	},
	onShow(){
		//清空寄快递信息
		this.$store.state.expressDeliveryInfo = {
			type: "",
			companyCode: "",
			sendAddress: {},
			expectTime: "",
			repAddress: {},
			goodInfo: {},
			insuredPrice: {},
			service: {},
			takeBill: {},
			carType: {}
		}
		this.tabIndex = 0;
		this.keyword = "";
		this.page = 1;
		this.total = 0;
		this.dataList = [];
		this.getSearchList()
	},
	methods: {
		clickTab: function(key){
			this.tabIndex = key;
			this.page = 1;
			this.total = 0;
			this.dataList = [];
			this.getSearchList();
			// 单据状态:1待报价2待支付3运输中4已签收9已取消
		},
		changeInput: function(e){
			this.keyword = e.detail.value;
			this.page = 1;
			this.total = 0;
			this.dataList = [];
			this.getSearchList();
		},
		//下拉加载
		scrolltolower:  function() {
			if(Math.ceil(this.total / this.limit) >= this.page){
				this.getSearchList();
			}
		},
		//查询列表
		getSearchList: function(){
			const that = this;
			uni.showLoading({
				mask: true,
				title: "数据加载..."
			})
			// status 单据状态:1待报价2待支付3运输中4已签收9已取消
			let _status = this.tabIndex == 4 ? 9 : this.tabIndex;
			that.$util.networkRequest({
				url: "/ExpressCar/Search",
				method: "POST",
				data: {
					page: that.page,
					limit: that.limit,
					keyword: that.keyword,
					status: _status
				},
				success: function(res){
					let total = res.total;
					if(total == 0 || res.list.length == 0) return false;
					(res.list).forEach(item => {
						item.price = item.price.toFixed(2);
					});
					that.page++;
					that.total = total;
					that.dataList = that.dataList.concat(res.list);
				}
			})
		},
		goDetails: function(item,type){
			let details = "";
			if((item.status == 3 || item.status == 4) && type==1){
				details = "&details=true";
			}
			uni.navigateTo({
				url: "details?mastCode="+item.mastCode+details
			});
		}
	}
}
</script>
<style scoped>
.tab-nav{
	border-top: 1px solid #EFEFEF;
	display: flex;
	justify-content: space-between;
	padding: 0 15px;
}
.tab-nav > view{
	text-align: center;
	padding: 10px 5px;
	border-bottom: 2px solid #FFFFFF;
}
.tab-nav > view.active{
	color: #4285F4;
	border-color: #4285F4;
}
.search{
	background-color: #F7F7F7;
	padding: 5px 10px;
}
.search input{
	display: block;
	width: calc(100% - 10px);
	background-color: #FFFFFF;
	height: 40px;
	border-radius: 3px;
	padding: 0 5px;
	font-size: 14px;
}
.scroll-wrapper{
	position: absolute;
	top: 93px;
	bottom: 46px;
	left: 0;
	right: 0;
	overflow-y: auto;
	background-color: #F7F7F7;
}
.mail-list{
	background-color: #FFFFFF;
	margin: 0 10px 10px;
	border-radius: 3px;
}
.mail-list .qy_img{
	width: 18px;
	height: 15px;
	float: left;
	margin-top: 3px;
	margin-right: 3px;
}
.mail-list .num{
	border-bottom: 1px solid #f7f7f7;
	padding: 10px;
}
.mail-list .order-con{
	padding: 15px 10px;
	display: box;
	display: -webkit-box;
	display: -moz-box;
}
.mail-list .order-con .info{
	width: calc(100% - 10px);
	width: -webkit-calc(100% - 10px);
	width: -moz-calc(100% - 10px);
}
.mail-list .order-con .info text{
	display: block;
	width: 100%;
	color: #9B9B9B;
}
.mail-list .order-con .info .name{
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	color: #333333;
	font-size: 16px;
	margin: 5px 0;
}
.mail-list .order-con .info .money{
	color: #F09236;
	font-size: 18px;
	font-weight: bold;
	margin-top: 10px;
}
.mail-list .state{
	border-top: 1px solid #f7f7f7;
}
.mail-list .state > view{
	width: calc(100% / 3 - 1px);
	width: -webkit-calc(100% / 3 - 1px);
	width: -moz-calc(100% / 3 - 1px);
	display: inline-block;
	text-align: center;
	border-left: 1px solid #f7f7f7;
	margin: 10px 0;
}
.mail-list .state > view:first-child{
	border-left: 0;
}
.mail-list .state text{
	display: block;
}
.mail-list .state text:first-child{
	color: #9B9B9B;
	padding-bottom: 5px;
}
.mail-list .state text:last-child{
	width: 90%;
	margin: 0 auto;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
