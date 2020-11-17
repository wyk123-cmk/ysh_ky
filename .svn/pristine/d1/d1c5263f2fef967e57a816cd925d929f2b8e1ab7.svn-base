<template>
	<view>
		<page-imges :show="showImage"></page-imges>
		<view class="date">
			<picker class="picker" mode="multiSelector" :range="startArray" :value="startIndex" @change="startPickerChange" @columnchange="startPickerColumn">
				{{startDate}}<text class="iconfont icon-shouqi"></text>
			</picker>
		</view>
		<view v-if="total==0" class="none-data-list"><image src="../../static/images/none.svg"></image>暂无内容</view>
		<scroll-view v-else class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">
			<view class="log-list" v-for="(item, i) in dataList" :key="i">
				<view class="time">
					<text class="m-d">{{item.md}}</text>
					<text class="h-m">{{item.hm}}</text>
				</view>
				<view class="info">
					<view class="operator"><text>{{item.operator}}</text>{{item.logText}}</view>
					<text class="remark">{{item.remark==null?'':item.remark}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			startYear: 2019,
			startDate: "本月",
			startArray: [],
			startIndex: [0, 0],
			page: 1,
			limit: 15,
			total: 0,
			dataList: []
		}
	},
	onShow(){
		this.showImage = getApp().globalData.isDiscountPopup;
		this.startDate = "本月";
		this.page = 1;
		this.dataList = [];
		this.getList();
	},
	created(){
		const date = new Date();
		var yearArr = [];
		for(var i = this.startYear; i <= date.getFullYear(); i++){
			yearArr.push(i+"年")
		}
		this.startArray[0] = yearArr;
		let len = (yearArr.length - 1);
		var start_m = this.$util.getMonth(yearArr[len]);
		this.startArray[1] = start_m;
		this.startIndex = [len, start_m.length - 1];
	},
	methods: {
		scrolltolower:  function() {
			if(Math.ceil(this.total / this.limit) >= this.page){
				this.getList();
			}
		},
		getList: function(){
			const that = this;
			let startTime = "";
			let endTime = "";
			if(that.startDate == "本月"){
				startTime = new Date().getFullYear()+"-"+(new Date().getMonth() + 1)+"-01";
				endTime = new Date().getFullYear()+"-"+(new Date().getMonth() + 2)+"-01";
			}else{
				let _str = that.startDate.split("年");
				let _year = _str[0];
				let _month = _str[1].split("月")[0];
				startTime = _year+"-"+_month;
				if( _month < 12 ){
					endTime = _year+"-"+(Number(_month)+1);
				}else{
					endTime = (Number(_year)+1)+"-01";
				}
			}
			uni.showLoading({ title: '加载中...' });
			that.$util.networkRequest({
				url: "/Company/GetOperateLog",
				data: {
					page: that.page,
					limit: that.limit,
					startTime: startTime,
					endTime: endTime
				},
				success: function(res){
					let total = res.total;
					that.total = total;
					if(total == 0 || res.list.length == 0) return false;
					res.list.filter(item => {
						if(item.logTime != null && item.logTime != ""){
							item.md = that.$util.formatDate.format(item.logTime,"MM-dd");
							item.hm= that.$util.formatDate.format(item.logTime,"hh:mm");
						}
					});
					that.page++;
					that.dataList = that.dataList.concat(res.list);
				}
			})
		},
		//时间
		startPickerChange: function(e){
			var index = e.detail.value;
			var y = this.startArray[0][index[0]].split("年")[0];
			var m = this.startArray[1][index[1]].split("月")[0];
			var _date = y+'年'+m+'月';
			this.startDate = _date;
			this.page = 1;
			this.dataList = [];
			this.getList();
		},
		startPickerColumn: function(e){
			let date = new Date();
			var _value = e.detail.value;
			this.startIndex[e.detail.column] = _value;
			switch (e.detail.column) {
				case 0: //拖动第1列
					this.startArray[1] = this.$util.getMonth(this.startArray[0][_value]);
					this.startIndex.splice(1, 1, 0)
					break;
			}
			this.$forceUpdate()
		},
	}
}
</script>
<style scoped>
.date{
	background: #f7f7f7;
	padding: 12px 15px;
}
.date .picker{
	text-align: center;
	background: #fff;
	height: 22px;
	line-height: 22px;
	padding: 0 10px;
	display: inline-block;
	border-radius: 14px;
	font-size: 12px;
	color: #666;
}
.date .picker .iconfont{
	font-size: 12px;
	padding-left: 3px;
}
.scroll-wrapper{
	position: absolute;
	top: 45px;
	left: 0;
	right: 0;
	bottom: 0;
	overflow-y: auto;
}
.log-list{
	padding: 15px 15px 0;
	display: box;
	display: -webkit-box;
}
.log-list:last-child{
	margin-bottom: 20px;
}
.log-list text{
	display: block;
}
.log-list .time{
	width: 54px;
}
.log-list .time .m-d{
	font-size: 16px;
	font-weight: bold;
	height: 20px;
}
.log-list .time .h-m,
.log-list .info .remark{
	font-size: 12px;
	color: #999;
	margin-top: 5px;
}
.log-list .info{
	border-bottom: 1px solid #eee;
	width: calc(100% - 54px);
	width: -webkit-calc(100% - 54px);
	padding-bottom: 10px;
}
.log-list .info .operator text{
	display: inline;
	color: #4285f4;
}
</style>
