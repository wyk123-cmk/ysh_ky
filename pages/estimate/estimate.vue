<style scoped>
	@import '../../common/css/index/expressDelivery.css';
	@import './estimate.css';
</style>
<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<view class="user-info-list">
			<view class="con">
				<text class="iconfont icon-ji1"></text>
				<view class="con_vie" >
					<address-picker @change="sendPickerChange" :disabled="false" class="picj_er">
						<text class="s-t">{{sendValue}}</text>
					</address-picker>
					<input type="text" placeholder="请输入详细地址" @input="getAddressAuto($event,1)" v-model="sendAddressDetail" class="inp_add"/>
				</view>
			</view>
			<view class="address-icon" @click="addressPage(1,'send')">
				<text class="iconfont icon-dizhibao"></text>地址簿
			</view>
		</view>
		<view class="user-info-list" style="border-bottom:1px solid #EEEEEE">
			<view class="con">
				<text class="iconfont icon-shou"></text>
				<view class="con_vie" >
					<address-picker @change="receivePickerChange" :disabled="false" class="picj_er">
						<text class="s-t">{{receiveValue}}</text>
					</address-picker>
					<input type="text" placeholder="请输入详细地址" @input="getAddressAuto($event,2)" v-model="repAddressDetail" class="inp_add"/>
				</view>
			</view>
			<view class="address-icon" @click="addressPage(1,'rep')">
				<text class="iconfont icon-dizhibao"></text>地址簿
			</view>
		</view>

		<picker @change="expressCompanyPickerChange" :value="expressCompany.index" :range="expressCompany.range">
			<view class="item-list right">
				物流公司
				<view>
					<image :src="expressCompany.path"></image>{{expressCompany.range[expressCompany.index]}}
				</view>
			</view>
		</picker>
		<view class="item-list right">
			预估重量
			<view class="weight">
				<text class="btn reduce" @click="reduceWeight">-</text>
				<input type="number" placeholder="1" v-model="weight" onkeyup="this.value=this.value.replace(/D/g,'')" onafterpaste="this.value=this.value.replace(/D/g,'')" />
				<text class="unit">kg</text>
				<text class="btn add" @click="addWeight">+</text>
			</view>
		</view>
		<view class="item-list right">
			体积填写
			<view>
				<view class="volume">
					<input type="number" placeholder="长" v-model="txtLong" />
					<text class="unit">cm</text>
					<text class="f-h">*</text>
					<input type="number" placeholder="宽" v-model="txtWidth" />
					<text class="unit">cm</text>
					<text class="f-h">*</text>
					<input type="number" placeholder="高" v-model="txtheight" />
					<text class="unit">cm</text>
				</view>
				<view class="volume total">
					总体积：
					<input type="digit" v-model="volume" />
					<text class="unit">m³</text>
				</view>
			</view>
		</view>
		<view class="item-list right" @click="open">
			寄件时间
			<view>{{sendTime}}</view>
		</view>
		<text class="item-list tip">注：因平台相关优惠折扣与物流产品相关，为确保您可享受平台便利，望合理填写产品重量及体积，预估与实际重量差距过大会产生无折扣订单，敬请留意！</text>
		<button class="btn-default-css" @click="btnQuery">查询</button>
		<view v-if="isEstimate">
			<text class="tip" style="font-size: 14px;">* 以下内容为估算值,请以实际揽收为准</text>
			<view class="estimate-list">
				<text class="small-title">产品类型</text>
				<view v-for="(item, i) in estimatePriceList" :key="i">
					<view class="e-l-item">
						<view class="e-l-i-info">
							<image src="../../static/images/db.png" v-if="item.companyCode=='db001'"></image>
							<image src="../../static/images/sf.png" v-if="item.companyCode=='sf001'"></image>
							<image src="../../static/images/kye.png" v-if="item.companyCode=='ky001'"></image>
							<view>
								<view class="flex">
									{{item.productName}}
									<text v-if="item.minWeight!=''&&item.maxWeight!=''">{{item.minWeight}}kg-{{item.maxWeight}}kg</text>
									<text v-if="item.minWeight!=''&&item.maxWeight==''">{{item.minWeight}}kg以上</text>
								</view>
								<text class="received-time">{{item.receivedTime==""||item.receivedTime==null?"——":item.receivedTime}}</text>
							</view>
						</view>
						<view class="price" v-if="item.price>0">
							￥<text class="num">{{item.price}}</text>
							<text class="original" v-if="item.price!=item.originalPrice">市场价 ￥{{item.originalPrice}}</text>
						</view>
						<view v-else class="price">— —</view>
						<text class="special" v-if="item.isSpecialLine">特价</text>
					</view>
					<view class="memo">
						<text v-if="item.companyCode==='db001'&&item.otherPriceMemo!=''&&item.otherPriceMemo!=null">{{item.otherPriceMemo}}</text>
						<text v-if="item.SpecialMemo!=''||item.SpecialMemo!=null">{{item.SpecialMemo}}</text>
					</view>
				</view>
			</view>
		</view>
		<sendTimePicker :show="popupShow" :startTime="startTime" :endTime="endTime" :setPickerIndex="setPickerIndex"
		 :timeTabIndex="timeTabIndex" :code="expressCompany.code" @close="close" @change="timeChange"></sendTimePicker>
	</view>
</template>
<script>
	import addressPicker from "../../components/address-picker/address-picker.vue"
	import sendTimePicker from "../../components/sendTime-picker/sendTime-picker.vue"
	export default {
		data() {
			return {
				sendValue: "选择寄件地址",
				sendCode: "",
				sendAddressDetail: "",
				repAddressDetail: "",
				receiveValue: "选择收件地址",
				receiveCode: "",
				expressCompany: {
					list: [],
					range: ["全部"],
					index: 0,
					code: "",
					path: ""
				},
				sendInfo: {
					yfaddress: "请选择寄件地址",
					contactsCode: "",
					ad: "请输入详细地址",
					areaCode: ""
				},
				repInfo: {
					yfaddress: "请选择收件地址",
					contactsCode: "",
					ad: "请输入详细地址",
					areaCode: ""
				},
				popupShow: false,
				startTime: 8,
				endTime: 19,
				setPickerIndex: [0],
				timeTabIndex: 0,
				sendTime: '一小时内',
				weight: 1,
				txtheight: "",
				txtWidth: "",
				txtLong: "",
				volume: 0.00,
				isEstimate: false,
				estimatePriceList: [],
				showImage: false
			}
		},
		components: {
			addressPicker,
			sendTimePicker
		},
		onLoad() {
			let app = getApp();
			app.isToken(this);
		},
		onShow() {
			let app = getApp();
			this.showImage = app.globalData.isDiscountPopup;
			//初始默认值
			this.sendValue = "选择寄件地址";
			this.sendCode = "";
			this.receiveValue = "选择收件地址";
			this.receiveCode = "";
			this.expressCompany = {
				list: [],
				range: ["全部"],
				index: 0,
				code: "",
				path: ""
			}
			this.popupShow = false;
			this.startTime = 8;
			this.endTime = 19;
			this.setPickerIndex = [0];
			this.timeTabInde = 0,
				this.sendTime = '一小时内';
			this.weight = 1;
			this.txtheight = "";
			this.txtWidth = "";
			this.txtLong = "";
			this.volume = 0.00;
			this.isEstimate = false;
			this.estimatePriceList = [];
			this.getExpressCompany();
			this.setValue();
			this.setDate("", this.endTime);
		},
		computed: {
			txtCubic1: function() {
				try {
					let long = Number(this.txtLong);
					let height = Number(this.txtheight == "" ? 0 : this.txtheight);
					let width = Number(this.txtWidth == "" ? 0 : this.txtWidth);
					let cubicMeter = (long * height * width) / 1000000;
					return cubicMeter;
				} catch (e) {}
			}
		},
		watch: {
			txtCubic1(val) {
				this.volume = val > 0 ? val : 0.01;
			}
		},
		methods: {
			//详情地址自动获取市区
			getAddressAuto(e, type){
				var that = this;
				let _val = that.$util.stripAddress(e.detail.value);
				uni.request({
					url: that.apiUrl + "/AddressBook/GetAddressAutoInfo",
					header: {
						appId: that.appId,
						token: uni.getStorageSync('token'),
						"content-type": "application/json"
					},
					data: {addressText: _val},
					success: res => {
						if(res.data.errCode != 200) return false;
						let data = res.data.data;
						let str = data.province+'-'+data.city+'-'+data.area;
						if(type == 1){
							that.sendValue = str;
							that.sendCode = data.areaCode;
						}
						if(type == 2){
							that.receiveValue = str;
							that.receiveCode = data.areaCode;
						}
					}
				})
			},
			setValue() {
				let expressDeliveryInfo = this.$store.state.expressDeliveryInfo;
				let sendAddress = expressDeliveryInfo.sendAddress; //寄件地址
				let repAddress = expressDeliveryInfo.repAddress; //收件地址

				if (JSON.stringify(sendAddress) == "{}") {
					this.sendInfo = {
						yfaddress: "请选择寄件地址",
						contactsCode: "",
						ad: "请输入详细地址",
						areaCode: ""
					}

				} else {
					this.sendInfo = sendAddress;
					this.sendCode = sendAddress.areaCode;
					this.sendAddressDetail = sendAddress.ad;
					this.sendValue = this.sendInfo.yfaddress;
					this.sendAddressDetail=this.sendInfo.ad;
				}
				//收件地址 true--获取用户设置的默认地址;否则获取自己选择的地址
				if (JSON.stringify(repAddress) == "{}") {
					this.repInfo = {
						yfaddress: "请选择收件地址",
						contactsCode: "",
						ad: "请输入详细地址",
						areaCode: ""
					}

				} else {
					this.repInfo = repAddress;
					this.receiveCode = repAddress.areaCode;
					this.repAddressDetail = repAddress.ad;
					this.receiveValue=this.repInfo.yfaddress;
				}
			},
			//查询
			btnQuery: function() {
				const that = this;
				if (!that.$util.isNotEmpty(that.sendCode)) {
					that.$util.showToast("请选择寄件地址");
					return false;
				}
				if (!that.$util.isNotEmpty(that.receiveCode)) {
					that.$util.showToast("请选择收件地址");
					return false;
				}
				let _companyCode = that.expressCompany.code;
				let createTime = that.expectedTime();
				let param = {
					companyCode: _companyCode,
					areaCodeFrom: that.sendCode,
					fromAddress: that.sendAddressDetail,
					toAddress: that.repAddressDetail,
					areaCodeTo: that.receiveCode,
					weight: that.weight,
					sendTime: createTime,
					volume: that.volume
				}
				uni.showLoading({
					title: '加载中...'
				});
				that.estimatePriceList = [];
				that.$util.networkRequest({
					url: "/Price/EstimatePrice",
					method: "POST",
					data: param,
					success: function(res) {
						if(res.length == 0) {
							that.$util.showToast("暂时估不出产品类型,请稍后");
							return false;
						}
						that.isEstimate = true;
						res.filter(item => {
							item.price = item.price.toFixed(2);
							item.originalPrice = item.originalPrice.toFixed(2);
						});
						that.estimatePriceList = res;
					}
				})
			},
			//跳转地址
			addressPage: function(key, type) {

				if (key == 1) {
					//列表
					uni.navigateTo({
						url: "/pages/me/addressList?type=" + type
					});
				}
			},
			addWeight: function() {
				   this.weight++;
			},
			reduceWeight: function() {
				if (this.weight <= 1) return false;
				   this.weight--;
			},
			//寄件地址
			sendPickerChange(e) {
				let data = this.setAddress(e, this.receiveValue);
				if (!data) return false;
				this.sendValue = data.value;
				if(data.code!==this.sendCode){
					this.sendAddressDetail="";
				}
				this.sendCode = data.code;
			},
			//收件地址
			receivePickerChange(e) {
				let data = this.setAddress(e, this.sendValue);
				if (!data) return false;
				this.receiveValue = data.value;
				if(data.code!==this.receiveCode){
					this.repAddressDetail="";
				}
				this.receiveCode = data.code;
			},
			//获取物流公司
			getExpressCompany() {
				const that = this;
				this.$util.networkRequest({
					url: "/ExpressCompany/GetList",
					data: {
						companyType: "All"
					},
					success: function(res) {
						that.expressCompany.list = res;
						res.forEach((c, i) => {
							that.expressCompany.range.push(c.companyName);
						})
					}
				})
			},
			//物流公司
			expressCompanyPickerChange(e) {
				let index = e.detail.value;
				let _code = "";
				let _start = 8;
				let _end = 19;
				let _path = "";
				if (index != 0) {
					_code = this.expressCompany.list[index - 1].companyCode;
					_start = this.expressCompany.list[index - 1].startTime;
					_end = this.expressCompany.list[index - 1].endTime;
					_path = this.expressCompany.list[index - 1].logoPath;

				}
				this.expressCompany.index = index;
				this.expressCompany.code = _code;
				this.expressCompany.path = _path.replace(/\s*/g, "");
				this.startTime = _start;
				this.endTime = _end;
				this.setPickerIndex = [0];
				this.setDate(_code, _end);
			},
			//寄件时间
			open() {
				this.popupShow = true;
			},
			close() {
				this.popupShow = false;
			},
			timeChange(data) {
				this.setPickerIndex = [Number(data.pickerIndex)];
				this.sendTime = data.txt;
				this.timeTabIndex = data.tabIndex;
			},
			setAddress(e, _v) {
				let _current = e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2];
				// if(_current == _v){
				// 	uni.showToast({ title: "寄件地址和收件地址不能一致", icon: 'none' });
				// 	return false;
				// }
				return {
					value: _current,
					code: e.detail.code[2]
				}
			},
			setDate(_code, _end) {
				let dt = new Date(); //当前时间
				if (dt.getHours() >= (this.endTime - 1) && (_code == "sf001" || _code == "" || _code == "ky001")) {
					this.timeTabIndex = 1;
				} else if (dt.getHours() >= (this.endTime - 2) && _code == "db001") {
					this.timeTabIndex = 1;
				} else this.timeTabIndex = 0;
				let _txt = this.timeTabIndex == 0 ? "" : "明天";
				this.sendTime = _code == "" || _code == "sf001" || _code == "ky001" ? _txt + " 一小时内" : _txt + " 两小时内";
			},
			//计算期望上门时间年月日 时:分
			expectedTime() {
				let date = new Date();
				let new_date = "";
				let hour = "";
				if (this.sendTime.indexOf("小时") != -1) {
					let h_i = 1;
					if (this.timeTabIndex == 1) {
						//若距离下班时间1小时则期待上门时间是明天
						new_date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
						hour = this.startTime + ':00';
					} else {
						if (this.expressCompany.code == "sf001" || this.expressCompany.code == "ky001") {
							if (((this.endTime - 1) < (new Date).getHours()) && ((new Date).getHours() < this.endTime)) {
								return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + this.endTime + ':00';
							}
							//顺丰一小时之内
							new_date = new Date(date.getTime() + 60 * 60 * 1000);
						} else {
							if (((this.endTime - 2) < (new Date).getHours()) && ((new Date).getHours() < this.endTime)) {
								return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + this.endTime + ':00';
							}
							//德邦两小时之内
							new_date = new Date(date.getTime() + 60 * 60 * 1000 * 2);
						}
						hour = new_date.getHours() + ':' + new_date.getMinutes();
					}
				} else {
					//已选择时间段
					hour = this.sendTime.split("-")[1];
					if (this.timeTabIndex == 0) {
						new_date = new Date();
						if (hour == "24:00") {
							hour = "23:59";
						}
					} else {
						new_date = new Date(date.getTime() + 24 * 60 * 60 * 1000 * this.timeTabIndex);
						if (hour == "24:00") {
							hour = "23:59";
						}
					}
				}
				return new_date.getFullYear() + '-' + (new_date.getMonth() + 1) + '-' + new_date.getDate() + ' ' + hour;
			},
		}
	}
</script>
