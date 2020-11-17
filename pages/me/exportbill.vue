<template>
	<view class="main">
		<page-imges :show="showImage"></page-imges>
		<view class="picker-list">
			<picker class="picker" mode="multiSelector" :range="startArray" :value="startIndex" @change="startPickerChange"
			 @columnchange="startPickerColumn">
				{{startDate==""?"开始时间":startDate}}
			</picker>
			至
			<picker class="picker" mode="multiSelector" :range="endArray" :value="endIndex" @change="endPickChange"
			 @columnchange="endPickerColumn">
				{{endDate==""?"结束时间":endDate}}
			</picker>
		</view>
		<text class="tips">注：每月1-7号为公司核账日，7号以后可以下载上个月账单,账单导出周期不超过31天，核对账单如有疑义，请拨打客服热线010-51285751。</text>
		<button class="btn-fixed-bottom" @click="exportZD">导出</button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				startYear: 2019,
				startDate: "",
				startArray: [],
				startIndex: [0, 0, 0],
				endDate: "",
				endArray: [],
				endIndex: [0, 0, 0]
			}
		},
		created() {
			this.showImage = getApp().globalData.isDiscountPopup;
			const date = new Date();
			var yearArr = [];
			for (var i = this.startYear; i <= date.getFullYear(); i++) {
				yearArr.push(i + "年")
			}
			let year_index = (yearArr.length - 1);
			let set_month = this.$util.getMonth(yearArr[year_index]);
			let month_index = (set_month.length - 1);
			let set_days = this.$util.getDays(yearArr[year_index], set_month[(month_index)])
			let days_index = (set_days.length - 1);
			//开始时间
			this.startArray[0] = yearArr;
			this.startArray[1] = set_month;
			this.startArray[2] = set_days;
			//结束时间
			this.endArray[0] = yearArr;
			this.endArray[1] = set_month;
			this.endArray[2] = set_days;
			//默认显示当前年-月-日
			this.startIndex = [year_index, month_index, days_index];
			this.endIndex = [year_index, month_index, days_index];
		},
		methods: {
			exportZD: function() {
				let that = this;
				let dt = new Date(); //当前时间
				if(dt.getDate() < 7){
					that.$util.showToast("1-7号为公司核账日，7号以后可以下载上个月账单");
					return false;
				}
				if (!that.$util.isNotEmpty(that.startDate)) {
					that.$util.showToast("请选择开始时间");
					return false;
				}
				if (!that.$util.isNotEmpty(that.endDate)) {
					that.$util.showToast("请选择结束时间");
					return false;
				}
				uni.showLoading({
					mask: true,
					title: "正在导出"
				});
				that.$util.networkRequest({
					url: "/CompanyReconciliation/ExcelCompanyCustomer",
					data: {
						startDate: that.startDate,
						endDate: that.endDate
					},
					success: data => {
						var content = JSON.parse(data);
						that.$util.downloadFile(content.filePath);
					}
				});
			},
			//开始时间
			startPickerChange: function(e) {
				var index = e.detail.value;
				var y = this.startArray[0][index[0]].split("年")[0];
				var m = this.startArray[1][index[1]].split("月")[0];
				var d = this.startArray[2][index[2]].split("日")[0];
				var _date = y + '-' + m + '-' + d;
				if (_date == this.endDate) {
					this.$util.showToast("开始时间与结束时间不能一致");
					return false;
				}
				this.startDate = _date;
			},
			startPickerColumn: function(e) {
				let date = new Date();
				var _value = e.detail.value;
				this.startIndex[e.detail.column] = _value;
				switch (e.detail.column) {
					case 0: //拖动第1列
						this.startArray[1] = this.$util.getMonth(this.startArray[0][_value]);
						this.startArray[2] = this.$util.getDays(this.startArray[0][_value], this.startArray[1][0]);
						this.startIndex.splice(1, 1, 0)
						this.startIndex.splice(2, 1, 0)
						break;
					case 1: //拖动第2列
						this.startArray[2] = this.$util.getDays(this.startArray[0][this.startIndex[0]], this.startArray[1][_value]);
						this.startIndex.splice(2, 1, 0)
						break;
				}
				this.$forceUpdate()
			},
			//结束时间
			endPickChange: function(e) {
				var index = e.detail.value;
				var y = this.endArray[0][index[0]].split("年")[0];
				var m = this.endArray[1][index[1]].split("月")[0];
				var d = this.endArray[2][index[2]].split("日")[0];
				var _date = y + '-' + m + '-' + d;
				if (_date == this.startDate) {
					this.$util.showToast("开始时间与结束时间不能一致");
					return false;
				}
				this.endDate = _date;
			},
			endPickerColumn: function(e) {
				let date = new Date();
				var _value = e.detail.value;
				this.endIndex[e.detail.column] = _value;
				switch (e.detail.column) {
					case 0: //拖动第1列
						this.endArray[1] = this.$util.getMonth(this.endArray[0][_value]);
						this.endArray[2] = this.$util.getDays(this.endArray[0][_value], this.endArray[1][0]);
						this.endIndex.splice(1, 1, 0)
						this.endIndex.splice(2, 1, 0)
						break;
					case 1: //拖动第2列
						this.endArray[2] = this.$util.getDays(this.endArray[0][this.endIndex[0]], this.endArray[1][_value]);
						this.endIndex.splice(2, 1, 0)
						break;
				}
				this.$forceUpdate()
			},

		}
	}
</script>
<style scoped>
	.main {
		border-top: 1px solid #f7f7f7;
		padding-top: 15px;
	}

	.picker-list {
		display: flex;
		justify-content: space-between;
		padding: 0 5px;
		color: #999;
		line-height: 34px;
		font-size: 13px;
	}

	.picker-list .picker {
		width: 100%;
		background: #f7f7f7;
		text-align: center;
		height: 34px;
		line-height: 34px;
		border-radius: 4px;
		margin: 0 10px;
		color: #333333;
		font-size: 14px;
	}

	.tips {
		margin: 20px 15px;
		display: block;
		font-size: 13px;
		color: red;
	}
</style>
