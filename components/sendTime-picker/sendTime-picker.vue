<template name="sendTimePicker">
	<view>
		<view class="min-popup" v-if="show" :class="[isShow?'min-show':'min-hide']">
			<view class="min-overlay" @click="close"></view>
			<view class="min-content">
				<view class="tab-time">
					<text :class="{active:isActive==i, disabled: i==0&&!isDisabled}" v-for="(item, i) in tabTime" :key="i" @click="clickTime(i)">{{item}}</text>
				</view>
				<view class="time-content">
					<picker-view @change="timeChange" :value="index">
						<picker-view-column>
							<view class="item" v-for="(item,index) in timeSlots" :key="index">{{item}}</view>
						</picker-view-column>
					</picker-view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	name: "sendTimePicker",
	props: {
		show: { type: Boolean, default: false },
		setPickerIndex: {type: Array, default: [0]},
		tabTimeArr: {
			type: Array, 
			default: function() {
				return ["今天","明天","后天"]
			}
		},
		timeTabIndex: {type: Number, default: 0},
		code: {type: String, default: ''},
		startTime: {type: Number, default: 8},
		endTime: {type: Number, default: 19},
	},
	data(){
		return {
			isShow: false,
			timeSlots: [],
			tabTime: [],
			index: [0],
			isActive: 0,
			isDisabled: true
		}
	},
	watch: {
		show() {
			// console.log('开始:',this.show,this.startTime, this.endTime, this.setPickerIndex);
			this.isShow = this.show;
			this.tabTime = this.tabTimeArr;
			this.index = this.setPickerIndex;
			this.isActive = this.timeTabIndex;
			this.isDisabled = true;
			let dt = new Date();
			if(dt.getHours() >= (this.endTime-1) && (this.code == "sf001" || this.code == "")){
				this.isDisabled = false;
			}
			if(dt.getHours() >= (this.endTime) && this.code == "db001"){
				this.isDisabled = false;
			}
			if(!this.show) return false;
			this.selectTime(this.isActive);
		}
	},
	methods: {
		close(){
			this.isShow = false;
			setTimeout(() => { this.$emit('close') }, 100)
		},
		clickTime(key){
			if(!this.isDisabled && key==0) {
				return false;
			}
			this.isActive = key;
			this.selectTime(key);
			this.index = [0];
			this.time(this.index);
		},
		selectTime: function(key){
			let dt = new Date(); //当前时间
			let st = this.startTime;
			let et = this.endTime;
			this.timeSlots = [];
			if(key == 0 && dt.getHours() >= st && dt.getHours() < et){
				st = dt.getHours() + 1;
				if(this.code == "sf001" || this.code == "" || this.code == "ky001"){
					this.timeSlots.push("一小时内");
				}else{
					this.timeSlots.push("两小时内");
				}
			}
			for(var i = st; i < et; i++){
				let _e = i + 1;
				this.timeSlots.push(i+':00-'+_e+':00');
			}
		},
		timeChange: function(e){
			let i = e.detail.value;
			this.index = i;
			this.time(i);
		},
		time: function(i){
			let date = '';
			if(this.isActive != 0) date = this.tabTime[this.isActive];
			let _txt = date+" "+this.timeSlots[i];
			let data = {
				txt: _txt,
				pickerIndex: i,
				tabIndex: this.isActive
			}
			this.$emit('change',data)
		}
	}
}
</script>
<style scoped>
.min-popup{
	position: fixed;
	top:0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
}
.min-hide .min-content{
	animation: hide .5s linear forwards;
}
.min-hide .min-overlay{
	opacity: 0;
}
.min-show .min-content{
	animation: show .5s linear forwards;
}
.min-show .min-overlay{
	opacity: 1;
}
.min-overlay{
	position: absolute;
	top:0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 200;
	transition: .3s;
}
.min-content{
	height: 200px;
	background: #fff;
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 300;
	overflow: hidden;
	display: flex;
	display: -webkit-flex;
}

@keyframes hide {
	0% {
		transform: translateY(0);
	}
	100% {
		transform: translateY(100%);
	}
}
@keyframes show {
	0% {
		transform: translateY(100%);
	}
	100% {
		transform: translateY(0);
	}
}
.tab-time{
	width: 35%;
	background-color: #f7f7f7;
	text-align: center;
	overflow-y: auto;
}
.tab-time text{
	height: 33.33%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.tab-time text.active{
	background-color: #fff;
}
.tab-time text.disabled{
	color: #999999;
}
.time-content{
	width: 65%;
}
.time-content uni-picker-view,
.time-content picker-view{
	padding: 0 10px;
	height: 100%;
	text-align: center;
	line-height: 34px;
}
</style>