<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<view class="user-info-list">
			<view class="con">
				<text class="iconfont icon-ji1"></text>
				<view @click="addressPage(0,'send')">
					<text class="s-t">{{sendInfo.name}}</text>
					<text class="address-input">{{sendInfo.address}}</text>
				</view>
			</view>
			<view class="address-icon" @click="addressPage(1,'send')">
				<text class="iconfont icon-dizhibao"></text>地址簿
			</view>
		</view>
		<view class="user-info-list">
			<view class="con">
				<text class="iconfont icon-shou"></text>
				<view @click="addressPage(0,'rep')">
					<text class="s-t">{{repInfo.name}}</text>
					<text class="address-input">{{repInfo.address}}</text>
				</view>
			</view>
			<view class="address-icon" @click="addressPage(1,'rep')">
				<text class="iconfont icon-dizhibao"></text>地址簿
			</view>
		</view>
		<form class="form">
			<label class="label-item" v-if="isShowxs">
				<view class="modality">
					<text @click="expressTypeChange(m+1)" v-for="(item, m) in expressTypeData" :key="m" :class="(expressTypeIndex-1)==m?'active':''">{{item}}</text>
				</view>
				寄件形式<text class="must">必填</text>
			</label>
			<label class="label-item" @click="glMember" v-if="isMaster && expressTypeIndex==2">
				<view>
					<text v-bind:class="{'input-txt':name==''||name==null}">{{name==""||name==null?"请选择成员":name}}</text>
					<text class="iconfont icon--right-jian"></text>
				</view>
				关联到成员
			</label>
			<picker @change="expressCompanyPickerChange" :value="expressCompany.index" :range="expressCompany.range">
				<label class="label-item">
					<view>
						<image :src="expressCompany.path"></image>{{expressCompany.companyName}}
						<text class="iconfont icon--right-jian"></text>
					</view>
					物流公司
					<view class="special" v-if="isCompanySpecial">
						{{specialLineData[0].companyCode=="sf001"?"顺丰特价":""}}
						{{specialLineData[0].companyCode=="db001"?"德邦特价":""}}
						{{specialLineData[0].companyCode=="ky001"?"跨越特价":""}}
					</view>
				</label>
			</picker>
			<label class="label-item" @click="open">
				<view>
					{{sendTime}}
					<text class="iconfont icon--right-jian"></text>
				</view>
				期望上门时间
			</label>
			<label class="label-item" @click="goGoodsInfo">
				<view>
					<text v-bind:class="{'input-txt':goodName==''}">{{goodName==""?"请填写":goodName}}</text>
					<text class="iconfont icon--right-jian"></text>
				</view>
				物品信息<text class="must">必填</text>
			</label>
			<label class="label-item" @click="goInsuredPrice">
				<view>
					<text class="input-txt-bj" v-if="insuredPrice==null">建议足额保价</text>
					<view class="money" v-else>{{insuredPrice.amount=="不保价"?insuredPrice.amount:"￥"+insuredPrice.amount}}<text v-if="insuredPrice.price!=0">￥{{insuredPrice.price}}</text></view>
					<text class="iconfont icon--right-jian"></text>
				</view>
				保价<text v-if="type=='big'" class="must">必填</text>
			</label>
			<label class="label-item" @click="goService">
				<view>
					<text v-bind:class="{'input-txt':serviceNames=='','red':serviceNames!=''}">{{serviceNames==""?"付款方式、签单返还等":serviceNames}}</text>
					<text class="iconfont icon--right-jian"></text>
				</view>
				增值服务
			</label>
		</form>
		<form class="form" v-if="isUseBE">
			<label class="label-item">
				<view>
					<switch color="#4285F4" :checked="isBillExpress" @change="switchChange" layout_width="80px" />
				</view>
				启用电子面单
			</label>
		</form>
		<view class="bill-express-tips" v-if="isUseBE">注:启用电子面单后需打印出电子面单并且要自行联系快递员揽件</view>
		<form class="form" v-if="isShowZhq">
			<label class="label-item input-coupon">
				<view @click="clickCoupon">
					<text class="input-txt" v-bind:class="{'txt':couponInput!=''}">{{couponInput==""?"请选择":couponInput}}</text>
					<text class="iconfont icon--right-jian"></text>
				</view>
				优惠券<text class="must" v-if="couponInput!=''">已选推荐优惠</text>
			</label>
		</form>
		<view class="loading" v-if="isLoading">
			<image src="../../static/images/loading.gif"></image>产品类型正在加载中...
		</view>
		<view class="estimate-price-box" v-if="estimatePriceList.length != 0">
			产品类型
			<view class="estimate-list" v-for="(item, k) in estimatePriceList" :key="k" @click="btnSelProductType(item, k)">
				<view class="con" :class="selectProduct==k?'active':''">
					<view class="name">
						<view class="flex">
							{{item.productName}}
							<text v-if="item.minWeight!=''&&item.maxWeight!=''">{{item.minWeight}}kg-{{item.maxWeight}}kg</text>
							<text v-if="item.minWeight!=''&&item.maxWeight==''">{{item.minWeight}}kg以上</text>
						</view>
						<text>{{item.receivedTime==""||item.receivedTime==null?"--":item.receivedTime}}</text>
					</view>
					<view v-if="item.price > 0">
						<view class="price">￥<text>{{item.price}}</text></view>
						<view v-if="item.price!=item.originalPrice&&!item.isSpecial" class="original">市场价 ￥{{item.originalPrice}}</view>
						<view v-if="item.isSpecial" class="discount">{{item.specialText==null?"":item.specialText}}</view>
					</view>
					<text class="special" v-if="item.isSpecialLine">特价</text>
				</view>
				<text class="note" v-if="item.otherPriceMemo!=''&&item.otherPriceMemo!=null">{{item.otherPriceMemo}}</text>
				<text class="note" v-if="item.specialMemo!=''&&item.specialMemo!=null">{{item.specialMemo}}</text>
				<text class="note" v-if="item.productType=='SE010101'">注:体积需≤{{NetWeightScale}}m³</text>
			</view>
		</view>
		<view class="footer">
			<view>
				<view class="agree">
					<checkbox class="orange" :checked="checkedAgree" @click="checkedAgree=!checkedAgree"></checkbox>
					我已阅读并同意
					<text @click="isAgree=true">仪商汇快运服务协议</text>
					<text @click="isClause=true">、{{expressCompany.agreementUrl}}</text>
					<text @click="isPriceAgree=true" v-if="priceAgreementUrl!=''">、{{priceAgreementUrl}}</text>
				</view>
				<view class="yhq" v-if="isShowYhq&&countYHQ!=0"><text @click="isShowYhq=false" class="iconfont icon-quxiao"></text>你有{{countYHQ}}张可用优惠券，支付时将会自动抵扣</view>
				<button @click="orderNow">立即下单</button>
				<view class="estimate">预估：
					<text v-if="paytype=='到付'">￥--</text>
					<text v-else>￥{{sumMoney == "" || sumMoney == 0.0 ? "--" : sumMoney}}</text>
					<view class="is-special-line" v-if="isSpecialLine">
						<text></text><text>特价</text>
					</view>
				</view>
				<text class="tips">最终费用以系统核实价格为准</text>
			</view>
		</view>
		<sendTimePicker :show="popupShow" :startTime="startTime" :endTime="endTime" :setPickerIndex="setPickerIndex"
		 :timeTabIndex="timeTabIndex" :code="expressCompany.code" @close="close" @change="timeChange"></sendTimePicker>
		<view v-if="isAgree" @click="isAgree=false">
			<view class="v-model"></view>
			<view class="popup-txt" v-html="agreeHtml"></view>
		</view>
		<view v-if="isClause" @click="isClause=false">
			<view class="v-model"></view>
			<view class="popup-txt" v-html="clauseHtml"></view>
		</view>
		<view v-if="isPriceAgree" @click="isPriceAgree=false">
			<view class="v-model"></view>
			<view class="popup-txt" v-html="priceAgreementContent"></view>
		</view>
		<view v-if="isCompanyPassword">
			<view class="v-model" @click="isCompanyPassword=false"></view>
			<view class="company-password-box">
				<view class="title">立即支付<text class="iconfont icon-quxiao" @click="isCompanyPassword=false"></text></view>
				<view class="money">¥<text>{{sumMoney}}</text></view>
				<input type="password" placeholder="请输入企业支付密码" @input="passwordInput" />
				<button class="btn-default-css" @click="orderNow">确定</button>
			</view>
		</view>
		<view v-if="isPopupTime">
			<view class="v-model"></view>
			<view class="popup-time">
				<view class="title">提示</view>
				<view class="msg">德邦官方下单截止时间为18：00，现在下单系统可能无法派单，详情可咨询当地快递小哥。</view>
				<view class="check-box">
					<checkbox class="check" :checked="isPrompt" @click="isPrompt=!isPrompt"></checkbox>不再提示
				</view>
				<view class="btn">
					<button @click="closePrompt">确定</button>
					<button @click="isPopupTime=false">取消</button>
				</view>
			</view>
		</view>
		<!-- 折扣券 -->
		<view v-if="isCouponList">
			<view class="v-model" @click="isCouponList=false"></view>
			<view class="coupon-con">
				<view class="title">
					优惠券
					<view class="right-btn" @click="isCouponExplain=true">
						<text class="iconfont icon-yiwen"></text>
						使用说明
					</view>
				</view>
				<view class="tab-nav">
					<view :class="couponIndex==0?'active':''" @click="couponNav(0)">可用优惠券({{useCount}})<text></text></view>
					<view :class="couponIndex==1?'active':''" @click="couponNav(1)">不可用优惠券({{noUseCount}})<text></text></view>
				</view>
				<scroll-view class="scroll-wrapper" scroll-y="true" @scrolltolower="scrolltolower">

					<view class="scr_v" v-for="(item,index) in CouponList" :key="index">
						<view class="item-list" @click="selectZKQ(item.couponTitle,item.couponPrice,item.couponCode,item.isUse)">
							<view class="number"><text>{{item.couponPrice }}</text>折</view>
							<view class="info">
								<text>{{item.couponTitle }}</text>
								<text>{{item.couponDesc }}</text>
							</view>
							<view :class="item.check?'check active':'check'">
								<text :class="item.check?'iconfont icon-dui':''"></text>
							</view>
						</view>
					</view>

				</scroll-view>
				<button class="btn-default-css" @click="couponConfirm">确定</button>
			</view>
		</view>
		<view v-if="isCouponExplain" class="coupon-explain" @click="isCouponExplain=false">
			<view class="v-model"></view>
			<view class="explain">
				<text class="title">优惠券使用须知</text>
				<text>1、优惠券仅限在仪商汇快运中使用，按运费金额（不含保费、送货费等其他增值服务费用）减免支付。</text>
				<text>2、优惠券不能进行兑现、出售、转让或其他用途。</text>
				<text>3、优惠券不与其他优惠活动同时享用，每次仅限使用一张。</text>
				<text>4、优惠券领取后，有效使用期为一个月，过期自动失效。</text>
				<text>5、本规则最终解释权归仪商汇快运所有。</text>
			</view>
		</view>
	</view>
</template>
<script>
	import sendTimePicker from "../../components/sendTime-picker/sendTime-picker.vue"
	export default {
		data() {
			return {
				type: "small",
				list: [{
					count: 9,
					name: '顺丰折扣券',
					check: true
				}, {
					count: 8,
					name: '德邦折扣券',
					check: false
				}],
				sendInfo: {
					name: "寄件人信息",
					contactsCode: "",
					address: "点击填写寄件地址",
					ad: "",
					areaCode: ""
				},
				repInfo: {},
				shoupj: false,
				phone: "",
				expressTypeData: ["个人"],
				expressTypeIndex: 0,
				insuredPrice: null,
				expressCompany: {
					list: [],
					range: [],
					index: 0,
					code: "",
					path: "",
					agreementUrl: "",
					companyName: ""
				},
				popupShow: false,
				startTime: 8,
				endTime: 19,
				setPickerIndex: [0],
				timeTabIndex: 0,
				sendTime: '一小时内',
				isAgree: false,
				isClause: false,
				agreeHtml: "",
				clauseHtml: "",
				couponCountUser: 0,
				couponCountCompany: 0,
				checkedAgree: false,
				isShowxs: false,
				serviceNames: "",
				serviceList: [],
				isBillExpress: false,
				goodInfoData: {},
				goodName: "",
				estimatePriceList: [],
				selectProduct: 0,
				productType: "",
				isSpecialLine: false,
				sumMoney: "",
				isShowYhq: false,

				countYHQ: 0,
				isLoading: false,
				expressModeStorage: 0,
				companyCodeStorage: "",
				isCompanyPassword: false,
				password: "",
				paytype: "",
				showImage: false,
				istc: "",
				name: "",
				isUseBE: false,
				isPopupTime: false,
				isClickTime: true,
				isPrompt: false,
				isMaster: false,
				isCompanySpecial: false,
				specialLineData: [],
				priceAgreementUrl: "",
				priceAgreementContent: "",
				isPriceAgree: false,
				NetWeightScale: "",
				isCouponList: false,
				isCouponExplain: false,
				couponIndex: 0,
				couponInput: "",
				useCount: 0,
				noUseCount: 0,
				CouponList: [],
				AllCouponList: [],
				isShowZhq: false,

				SelectedCoupon: "",
				couponCode: ""
			}
		},
		components: {
			sendTimePicker
		},
		onLoad(options) {
			this.type = options.type;
			this.name = options.name == undefined ? '' : options.name;
			this.phone = options.phone == undefined ? '' : options.phone;
			this.istc = options.companyCode == undefined ? '' : options.companyCode;
			let title = "寄快递";
			if (options.type) {
				if ((options.type).indexOf("small") != -1) {
					title = "寄快递";
					this.type = "small";
				}
				if ((options.type).indexOf("big") != -1) {
					title = "寄大件";
					this.type = "big";
				}
			}
			//若local storage 存在寄件形式&&物流公司
			if (this.istc == "") {
				let expressStorage = uni.getStorageSync('expressStorage');
				if (expressStorage != "" && expressStorage != undefined) {
					this.expressModeStorage = JSON.parse(expressStorage).expressMode;
					this.companyCodeStorage = JSON.parse(expressStorage).companyCode;
					this.$store.state.expressDeliveryInfo.type = this.expressModeStorage;
					this.$store.state.expressDeliveryInfo.companyCode = this.companyCodeStorage;
				}
			}
			if (uni.getStorageSync('isPromptTime') == "false") {
				this.isClickTime = false;
			}
			uni.setNavigationBarTitle({
				title: title
			});
			this.getExpressCompany();
			this.isRegister();
			this.getCoupon();
			this.getYshESAgree();

		},
		watch: {
			couponCode(val) {
				console.log(val)
				// this.calculateProductType('tz')
			},
			productType(val) {
				console.log("cp" + val);
				
			}
		},
		onShow() {
			let app = getApp();
			app.isToken();
			this.showImage = app.globalData.isDiscountPopup;
			this.setvalue();
			this.GetIsMaster();
			uni.removeStorageSync('companyPrice');

		},
		methods: {
			// GET /api/Coupon/GetCouponDiscountList获取折扣券  只针对个人  德邦8折 顺丰9折  物流公司切换时重新获取折扣券
			GetCouponDiscountList(type) {
				const that = this;
				if(that.type=="big"){
					return false;
				}
				var parm = {
					companyCode: that.expressCompany.code,
					expressModel: that.expressTypeIndex,

				}
				that.$util.networkRequest({
					url: "/Coupon/GetCouponDiscountList",
					data: parm,
					success: function(res) {
						console.log(res);
					
						
						if (res !== null && res.couponCount !== 0) {
							that.isShowZhq = true;
							that.useCount = res.useCount;
							that.noUseCount = res.noUseCount;
							var list = res.list;
							list.forEach(item => {
								item.check = false;
							});
							that.AllCouponList = list;
							that.CouponList = that.AllCouponList.filter(item => {
								return item.isUse == true
							})
							if (type == "tz") {
								if (that.CouponList.length !== 0) {
									that.couponCode = that.CouponList[0].couponCode;
									that.couponInput = that.CouponList[0].couponTitle;
									that.CouponList[0].check = true;
								} else {
									that.couponCode = "";
									that.couponInput = "";
								}
							}


						}else{
							that.isShowZhq=false;
						}

					}
				})
			},
			selectZKQ(title, price, code, isUse) {
				console.log("34");
				// if(!isUse){
				// 	return false;
				// }
				this.CouponList.forEach(item => {
					if (item.couponCode == code) {

						item.check = true;
						this.SelectedCoupon = title;
						this.couponCode = code;

					} else {
						item.check = false;
					}

				})
				console.log(this.CouponList);
			},
			GetIsMaster() {
				const that = this;
				that.$util.networkRequest({
					url: "/Company/Info",
					success: function(res) {
						if (res.isMaster) {
							that.isMaster = true;
						}
					}
				})
			},
			setvalue() {
				//全局赋值
				let storage_data = uni.getStorageSync('expressListData');
				if (storage_data != "" && storage_data != undefined) {
					this.$store.state.expressDeliveryInfo = JSON.parse(storage_data);
					uni.removeStorageSync('expressListData');
				}
				let expressDeliveryInfo = this.$store.state.expressDeliveryInfo;
				let sendAddress = expressDeliveryInfo.sendAddress; //寄件地址
				let repAddress = expressDeliveryInfo.repAddress; //收件地址
				let insuredPrice = expressDeliveryInfo.insuredPrice; //保价
				let serviceData = expressDeliveryInfo.service; //增值服务
				let goodInfoData = expressDeliveryInfo.goodInfo; //物品信息
				this.goodInfoData = {};
				this.insuredPrice = null;
				this.password = "";
				//寄件地址 true--获取用户设置的默认地址;否则获取自己选择的地址
				if (JSON.stringify(sendAddress) == "{}") {
					this.getDefault();
				} else {
					this.sendInfo = sendAddress;
				}
				//收件地址 true--获取用户设置的默认地址;否则获取自己选择的地址
				if (JSON.stringify(repAddress) == "{}") {
					this.repInfo = {
						name: "收件人信息",
						contactsCode: "",
						address: "点击填写收件地址",
						ad: "",
						areaCode: ""
					}
				} else {
					this.repInfo = repAddress;
				}
				//物品信息
				if (JSON.stringify(goodInfoData) != "{}") {
					this.goodInfoData = goodInfoData;
					this.goodName = goodInfoData.goodName;
				}
				//保价
				if (JSON.stringify(insuredPrice) != "{}") {
					this.insuredPrice = insuredPrice;
					this.priceAgreementUrl = "";
					this.priceAgreementContent = "";
					if (insuredPrice.code != "db001" && insuredPrice.code != "sf001" && insuredPrice.code != "ky001") {
						this.getOtherInsuranceCompany();
					}
				}
				//增值服务
				if (JSON.stringify(serviceData) != "{}") {
					this.serviceList = [];
					let str = "";
					serviceData.forEach(item => {
						let s = (item.sub.remark).replace(/ /g, '');
						str += s + '-';
						this.serviceList.push(item.sub);
						if (item.sub.serviceKey == "PayType") {
							this.paytype = item.sub.remark;
						}
					})
					this.serviceNames = str.substring(0, str.length - 1);
				}
				//寄件形式
				if (expressDeliveryInfo.type != "") {
					this.expressTypeIndex = expressDeliveryInfo.type == 0 ? 1 : expressDeliveryInfo.type;
				} else {
					let expressStorage = uni.getStorageSync('expressStorage');
					if (expressStorage != "" && expressStorage != undefined) {
						this.expressModeStorage = JSON.parse(expressStorage).expressMode;
					}
					this.expressTypeIndex = this.expressModeStorage;
				}
				//物流公司
				if (expressDeliveryInfo.companyCode != "") {
					for (var i = 0; i < this.expressCompany.list.length; i++) {
						if (this.expressCompany.list[i].companyCode == expressDeliveryInfo.companyCode) {
							this.setCompanyValue(i);
						}
					}
				}
				if (expressDeliveryInfo.busName != "") {
					this.name = expressDeliveryInfo.busName;
					this.phone = expressDeliveryInfo.busPhone;
				}
				this.calculateProductType();
				this.getSpecialLineList();
			},
			//立即下单
			orderNow: function() {
				const that = this;
				if (!that.Valid()) return false;
				let amount = "";
				let insuranceCompanyCode = "";
				if (that.insuredPrice != null) {
					amount = that.insuredPrice.amount;
					insuranceCompanyCode = that.insuredPrice.code;
				}
				//到付不支持《第三方保险》
				if ((insuranceCompanyCode != "sf001" && insuranceCompanyCode != "db001" && insuranceCompanyCode != "ky001" &&
						insuranceCompanyCode != "") && that.serviceNames.indexOf("到付") != -1) {
					uni.showModal({
						title: "提示",
						content: "到付不支持《第三方保险》",
						success: function(res) {
							if (res.confirm) {
								let _text = that.expressCompany.list[that.expressCompany.index].insuranceText;
								let _insuranceUpper = that.expressCompany.list[that.expressCompany.index].insuranceUpper;
								uni.setStorage({
									key: "companyPrice",
									data: JSON.stringify({
										upperAmount: _insuranceUpper,
										insuranceText: _text
									})
								});
								uni.navigateTo({
									url: "/pages/index/insuredPrice?type=" + that.type + "&code=" + that.expressCompany.code,
								})
							}
						}
					});
					return false;
				}
				let takeBillInfo = that.$store.state.expressDeliveryInfo.takeBill;
				let _takeDeliveryRemark = "";
				let _takeDeliveryAttachment = [];
				if (JSON.stringify(takeBillInfo) != "{}") {
					_takeDeliveryRemark = takeBillInfo.takeDeliveryRemark;
					let ls = takeBillInfo.takeDeliveryAttachment;
					ls.forEach(item => {
						_takeDeliveryAttachment.push({
							path: item.path,
							fileName: item.fileName
						})
					})
				}
				that.expectedTime(true, function(createTime, startSendTime) {
					if (!createTime) return false;
					uni.showLoading({
						mask: true,
						title: '正在下单'
					});
					let param = {
						companyCode: that.expressCompany.code,
						fromContactsCode: that.sendInfo.contactsCode,
						toContactsCode: that.repInfo.contactsCode,
						expressMode: that.expressTypeIndex, //寄件形式
						insurance: amount, //报价金额
						insuranceCompanyCode: insuranceCompanyCode,
						expressType: that.type,
						serviceList: that.serviceList, //增值服务
						sendTime: createTime,
						startSendTime: startSendTime.trim(),
						isBillExpress: that.isBillExpress,
						estimateGoods: { //物品信息
							weight: that.goodInfoData.weigth, //重量
							volume: that.goodInfoData.cubic <= 0 ? 0 : that.goodInfoData.cubic, // 体积m³
							category: that.goodInfoData.packType, //产品类型
							name: that.goodInfoData.goodName, //名称
							count: that.goodInfoData.goodNum, //数量
						},
						remark: that.goodInfoData.remark, //物品信息备注 
						memo: that.goodInfoData.goodMemo, //内部注释
						packageService: that.goodInfoData.packageservice, //包装材质
						productType: that.productType, //预估价格产品类型
						password: that.password,
						takeDeliveryRemark: _takeDeliveryRemark, ////提货单备注 
						takeDeliveryAttachment: _takeDeliveryAttachment, ////提货单上传文件
						businessUserName: that.name, //业务员姓名
						businessUserPhone: that.phone, //业务员手机号
						couponCode: that.couponCode //券码id
					}
					that.password = "";
					that.isClickTime = true;
					that.$util.networkRequest({
						url: "/Express/Post",
						method: "POST",
						data: param,
						success: function(res) {
							let data = res;
							let _storageData = {
								expressMode: that.expressTypeIndex,
								companyCode: that.expressCompany.code
							};
							//默认寄件形式&&物流公司
							uni.setStorage({
								key: 'expressStorage',
								data: JSON.stringify(_storageData)
							});
							that.emptyData();
							let msg = 0;
							if (data.companyCode == "sf001" && data.expressCode == "") {
								msg = 1;
							}
							uni.navigateTo({
								url: "/pages/order/orderSuccess?mastCode=" + data.mastCode + "&sendTime=" + data.sendTime + "&msg=" +
									msg
							});
						},
						error: function(res) {
							//个人余额不足跳转充值存localStorage
							if (res.errCode == 2001) {
								uni.showModal({
									title: '提示',
									content: res.message,
									showCancel: false,
									success: function(res) {
										//默认寄件形式&&物流公司
										let _storageData = {
											expressMode: that.expressTypeIndex,
											companyCode: that.expressCompany.code
										};
										uni.setStorage({
											key: 'expressStorage',
											data: JSON.stringify(_storageData)
										});
										uni.setStorage({
											key: 'expressListData',
											data: JSON.stringify(that.$store.state.expressDeliveryInfo)
										});
										uni.navigateTo({
											url: "/pages/me/myRefill?type=" + that.type
										});
									}
								});
							}
						}
					});
				})
			},
			//输入企业支付密码
			passwordInput: function(e) {
				this.password = e.detail.value;
			},
			glMember() {
				uni.navigateTo({
					url: "/pages/me/memberList?type=2"
				})
			},
			//计算产品类型
			calculateProductType(type, i) {
				let that = this;
				that.estimatePriceList = [];
				that.productType = "";
				that.isSpecialLine = "";
				if(that.serviceNames.indexOf("到付")>0){
					that.isShowZhq=false;
					that.couponCode="";
				}
				else{
					if(that.type=="small"){
						if(that.CouponList.length!==0){
							that.isShowZhq=true;
							that.couponCode=that.CouponList[0].couponCode;
						}
					}
				}
				if (that.sendInfo.areaCode == "") return false;
				if (that.repInfo.areaCode == "") return false;
				if (JSON.stringify(that.goodInfoData) == "{}") return false;
				let amount = "";
				let insuranceCompanyCode = "";
				if (that.insuredPrice != null) {
					amount = that.insuredPrice.amount;
					insuranceCompanyCode = that.insuredPrice.code;
				}
				if (that.isShowxs) {
					if (that.expressTypeIndex == 0) return false;
				} else {
					that.expressTypeIndex = 1;
				}
				//抛重比(体积/重量) ≤ 3000
				that.NetWeightScale = (3000 * Number(that.goodInfoData.weigth)) / 1000000;
				let _code = that.expressCompany.code == "" ? that.companyCodeStorage : that.expressCompany.code;
				that.isLoading = true;
				let createTime = this.expectedTime('', function(createTime) {
					let data = {
						ExpressMode: that.expressTypeIndex,
						areaCodeFrom: that.sendInfo.areaCode,
						fromAddress: that.sendInfo.ad,
						toAddress: that.repInfo.ad,
						areaCodeTo: that.repInfo.areaCode,
						companyCode: _code,
						insuranceValue: amount,
						insuranceCompanyCode: insuranceCompanyCode,
						sendTime: createTime,
						volume: that.goodInfoData.cubic <= 0 ? 0 : that.goodInfoData.cubic,
						serviceDeliveryTypeInfo: that.serviceList,
						weight: that.goodInfoData.weigth,
						remark: that.goodInfoData.remark,
						couponCode: that.couponCode //券码id
					}
					that.$util.networkRequest({
						url: "/Price/EstimatePrice",
						method: "POST",
						data: data,
						success: function(res) {
							res.filter(item => {
								item.price = item.price.toFixed(2);
								item.originalPrice = item.originalPrice.toFixed(2);
							});
							that.estimatePriceList = res;
							that.isLoading = false;
							let index = 0;
							that.btnSelProductType(res[index], index);
						},
						error: function(res) {
							that.isLoading = false;
						}
					});
				});
			},
			//预估价格
			btnSelProductType: function(item, i) {
				let that = this;
				this.sumMoney = "";
				if (this.insuredPrice !== null) {
					this.insuredPrice.price = item.insurancePrice;
				}
				this.selectProduct = i;
				this.productType = item.productType;
				this.isSpecialLine = item.isSpecialLine;
				this.sumMoney = parseFloat(
					parseFloat(item.price) +
					parseFloat((item.insurancePrice == "" ? 0 : item.insurancePrice))
				).toFixed(2);
			},
			//跳转地址
			addressPage: function(key, type) {
				if (key == 0) {
					//新增&&编辑
					let code = "";
					if (type == "send") code = this.sendInfo.contactsCode;
					if (type == "rep") code = this.repInfo.contactsCode;
					uni.navigateTo({
						url: "/pages/me/addressEdit?addresscode=" + code + "&type=" + type
					});
				}
				if (key == 1) {
					//列表
					uni.navigateTo({
						url: "/pages/me/addressList?type=" + type
					});
				}
			},
			//物品信息
			goGoodsInfo: function() {
				uni.navigateTo({
					url: "/pages/index/goodsInfo?type=" + this.type + "&code=" + this.expressCompany.code
				});
			},
			//请填写报价信息
			goInsuredPrice: function() {
				if (this.expressCompany.code == "" || this.expressCompany.code == null) {
					this.$util.showToast("请选择物流公司");
					return false;
				}
				let _text = this.expressCompany.list[this.expressCompany.index].insuranceText;
				let _insuranceUpper = this.expressCompany.list[this.expressCompany.index].insuranceUpper;
				uni.setStorage({
					key: "companyPrice",
					data: JSON.stringify({
						upperAmount: _insuranceUpper,
						insuranceText: _text
					})
				});
				uni.navigateTo({
					url: "/pages/index/insuredPrice?type=" + this.type + "&code=" + this.expressCompany.code,
				});
			},
			//增值服务
			goService: function() {
				uni.navigateTo({
					url: "/pages/index/addedService?code=" + this.expressCompany.code
				});
			},
			//启用电子面单
			switchChange: function(e) {
				this.isBillExpress = e.target.value;
			},
			//物流公司
			expressCompanyPickerChange(e) {
				let index = e.detail.value;
				this.estimatePriceList = [];
				this.productType = "";
				this.isSpecialLine = "";
				this.$store.state.expressDeliveryInfo.expectTime = "";
				this.setCompanyValue(index);
				this.$store.state.expressDeliveryInfo.companyCode = this.expressCompany.list[index].companyCode;
				//更换物流公司 增值清空
				this.$store.state.expressDeliveryInfo.service = {};
				this.$store.state.expressDeliveryInfo.insuredPrice = {};
				this.insuredPrice = null;
				uni.removeStorageSync('insuredPrice');
				this.serviceNames = "";
				this.GetCouponDiscountList('tz')
				this.initServiceData();
				this.calculateProductType();
				this.getSpecialLineList();
				this.couponInput = "";
				this.couponCode = "";
				
			},
			setCompanyValue(index) {
				let _code = this.expressCompany.list[index].companyCode;
				let _start = this.expressCompany.list[index].startTime;
				let _end = this.expressCompany.list[index].endTime;
				let _path = this.expressCompany.list[index].logoPath;
				let _agreementUrl = this.expressCompany.list[index].agreementUrl;
				this.expressCompany.index = index;
				this.expressCompany.code = _code;
				this.expressCompany.path = _path.replace(/\s*/g, "");
				this.expressCompany.agreementUrl = _agreementUrl.replace(/\《|》*/g, "");
				this.expressCompany.companyName = this.expressCompany.list[index].companyName;
				this.clauseHtml = this.expressCompany.list[index].agreementContent;
				this.startTime = _start;
				this.endTime = _end;
				this.setPickerIndex = [0];
				if (this.$store.state.expressDeliveryInfo.expectTime != "") {
					this.sendTime = this.$store.state.expressDeliveryInfo.expectTime;
				} else {
					this.setDate(_code, _end);
				}
			},
			//选择时间段
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
				this.$store.state.expressDeliveryInfo.expectTime = this.sendTime;
				this.calculateProductType();
			},
			setDate(_code, _end) {
				let dt = new Date(); //当前时间
				if (dt.getHours() >= (this.endTime - 1) && (_code == "sf001" || _code == "" || _code == "ky001")) {
					this.timeTabIndex = 1;
				} else if (dt.getHours() >= (this.endTime) && _code == "db001") {
					this.timeTabIndex = 1;
				} else this.timeTabIndex = 0;
				let _txt = this.timeTabIndex == 0 ? "" : "明天";
				this.sendTime = _code == "" || _code == "sf001" || _code == "ky001" ? _txt + " 一小时内" : _txt + " 两小时内";
			},
			//计算期望上门时间年月日 时:分
			expectedTime: function(bool, callback) {
				let that = this;
				let date = new Date();

				that.$util.networkRequest({
					url: "/SysInfo/GetDateTime",
					success: function(res) {
						date = new Date(res);
						let new_date = "";
						let hour = "";
						let section = "";
						let startSendTime = "";
						if (that.sendTime.indexOf("小时") != -1) {
							let h_i = 1;
							if (that.timeTabIndex == 1) {
								//若距离下班时间1小时则期待上门时间是明天
								new_date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
								hour = that.startTime + ':00';
							} else {
								if (that.expressCompany.code == "sf001" || that.expressCompany.code == "ky001") {
									if (((that.endTime - 1) < (new Date).getHours()) && ((new Date).getHours() < that.endTime)) {
										callback(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + that.endTime +
											':00', startSendTime);
										return false;
									}
									//顺丰一小时之内
									new_date = new Date(date.getTime() + 60 * 60 * 1000);
								} else {
									if (((that.endTime - 2) < (new Date).getHours()) && ((new Date).getHours() < that.endTime)) {
										if (date.getHours() >= 18 && that.expressCompany.code == "db001" && that.isClickTime && that.timeTabIndex ==
											0 && bool) {
											that.isPopupTime = true;
											callback(false, startSendTime);
											return false;
										}
										callback(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + that.endTime +
											':00', startSendTime);
										return false;
									}
									//德邦两小时之内
									new_date = new Date(date.getTime() + 60 * 60 * 1000 * 2);
								}
								hour = new_date.getHours() + ':' + new_date.getMinutes();
							}
						} else {
							//已选择时间段
							hour = that.sendTime.split("-")[1];
							if (that.timeTabIndex == 0) {
								new_date = new Date();
								if (hour == "24:00") {
									hour = "23:59";
								}
							} else {
								new_date = new Date(date.getTime() + 24 * 60 * 60 * 1000 * that.timeTabIndex);
								if (hour == "24:00") {
									hour = "23:59";
								}
							}
							let str = that.sendTime.split(" ");
							section = str[1].split("-")[0];
						}
						let set_date = new_date.getFullYear() + '-' + (new_date.getMonth() + 1) + '-' + new_date.getDate();
						let expectedTime = set_date + ' ' + hour;
						if (section != "") {
							startSendTime = set_date + ' ' + section;
						}
						//德邦截止下单时间为18点，18点后下单小哥可能第二天才能收到下单信息
						if (date.getHours() >= 18 && that.expressCompany.code == "db001" && that.isClickTime && that.timeTabIndex ==
							0 && bool) {
							that.isPopupTime = true;
							callback(false, startSendTime);
							return false;
						}
						callback(expectedTime, startSendTime);
					}
				})
			},
			closePrompt: function() {
				this.isClickTime = false;
				this.isPopupTime = false;
				if (this.isPrompt) {
					uni.setStorage({
						key: 'isPromptTime',
						data: "false"
					});
				}
				this.orderNow();
			},
			//获取物流公司
			getExpressCompany() {
				const that = this;
				that.expressCompany = {
					list: [],
					range: [],
					index: 0,
					code: "",
					path: "",
					agreementUrl: "",
					companyName: "",
				};
				let _companyType = that.type == "small" ? "Normal" : "Big";
				that.$util.networkRequest({
					url: "/ExpressCompany/GetList",
					data: {
						companyType: _companyType
					},
					success: function(res) {
						let index = that.expressCompany.index;
						if (that.istc !== "") {
							for (var i = 0; i < res.length; i++) {
								if (res[i].companyCode == that.istc) {
									index = i;
								}
							}
						} else {
							if (that.companyCodeStorage != "") {
								for (var i = 0; i < res.length; i++) {
									if (res[i].companyCode == that.companyCodeStorage) {
										index = i;
									}
								}
							}
						}
						let _data = res[index];
						that.expressCompany.list = res;
						that.expressCompany.code = _data.companyCode;
						that.expressCompany.companyName = _data.companyName;
						that.expressCompany.path = _data.logoPath.replace(/\s*/g, "");
						that.expressCompany.agreementUrl = _data.agreementUrl;
						that.clauseHtml = _data.agreementContent;
						that.startTime = _data.startTime;
						that.endTime = _data.endTime;
						that.initServiceData(); //增值服务
						that.setDate("", that.endTime);
						that.setCompanyValue(index);
						that.GetCouponDiscountList('tz');
						res.forEach((c, i) => {
							that.expressCompany.range.push(c.companyName);
						});
					}
				})
			},
			//寄件形式
			expressTypeChange: function(index) {
				this.$store.state.expressDeliveryInfo.type = this.expressTypeIndex = index;
				this.countYHQ = this.expressTypeIndex == 1 ? this.couponCountUser : this.couponCountCompany;
				if (this.expressTypeIndex == 0) this.estimatePriceList = [];
				this.GetCouponDiscountList('tz');
				this.calculateProductType();
				this.couponInput = "";
				this.couponCode = "";

			},
			//寄件形式
			isRegister() {
				const that = this;
				that.$util.networkRequest({
					url: "/Company/IsRegister",
					success: function(res) {
						that.isUseBillExpress();
						if (res) {
							that.isShowxs = true;
							that.expressTypeData.push("企业");
							that.expressTypeIndex = 2;
						} else {
							that.isShowxs = false;
							that.expressTypeIndex = 1;
						}

						if (that.expressModeStorage !== 0) {
							that.expressTypeIndex = that.expressModeStorage;
						}
						that.$store.state.expressDeliveryInfo.type = that.expressTypeIndex;
					}
				});
			},
			//是否启用电子面单
			isUseBillExpress() {
				const that = this;
				that.$util.networkRequest({
					url: "/Company/IsUseBillExpress",
					success: function(res) {
						that.isUseBE = res;
					}
				})
			},
			//获取服务协议
			getYshESAgree() {
				const that = this;
				that.$util.networkRequest({
					url: "/ExpressCompany/GetYshESAgree",
					success: function(res) {
						that.agreeHtml = res;
					}
				});
			},
			//获取默认地址簿
			getDefault() {
				const that = this;
				that.$util.networkRequest({
					url: "/AddressBook/GetDefault",
					success: function(res) {
						if (!that.$util.isNotEmpty(res)) {
							return false;
						}
						that.sendInfo = {
							name: res.name,
							contactsCode: res.contactsCode,
							address: res.areaInfo.province + res.areaInfo.city + res.areaInfo.area + res.address,
							ad: res.address,
							areaCode: res.areaInfo.areaCode
						}
						that.$store.state.expressDeliveryInfo.sendAddress = that.sendInfo;
					}
				});
			},
			//优惠券数
			getCoupon() {
				const that = this;
				that.$util.networkRequest({
					url: "/Coupon/GetCouponCountModel",
					success: function(res) {
						if (that.expressTypeIndex != 0) that.countYHQ = that.expressTypeIndex == 1 ? res.userCount : res.companyCount;
						that.couponCountUser = res.userCount;
						that.couponCountCompany = res.companyCount;
					}
				});
			},
			//增值服务
			initServiceData() {
				let that = this;
				if (JSON.stringify(this.$store.state.expressDeliveryInfo.service) == "{}") {
					that.serviceList = [];
					that.$util.networkRequest({
						url: "/ExpressService/GetList",
						data: {
							companyCode: that.expressCompany.code
						},
						success: function(res) {
							res.forEach(item => {
								let _subData = item.listDetail[0];
								if (that.expressCompany.code == "db001" && item.serviceKey == "DeliveryType") {
									//若是德邦:提货方式默认“送货（不含上楼）”
									item.listDetail.forEach(sub => {
										if (sub.remark == "送货（不含上楼）") {
											_subData = sub;
										}
									});
								}
								that.serviceList.push({
									remark: _subData.remark,
									serviceKey: _subData.serviceKey,
									serviceValue: _subData.serviceValue
								});
							})
						}
					})
				}
			},
			//根据收寄地址查询是否存在特价线路信息
			getSpecialLineList: function() {
				let that = this;
				let param = {
					"fromAreaCode": that.sendInfo.areaCode, //寄件人地址
					"toAreaCode": that.repInfo.areaCode, //收件人地址
					"expressType": that.type, //配送类型：small小件，big大件
					"expressMode": that.expressTypeIndex, //寄件形式：0未选择1个人2公司 可为空说
					// "companyCode": that.expressCompany.code //物流公司代码 可为空
					"companyCode": "sf001" //物流公司代码 可为空
				}
				if (param.fromAreaCode == "") return false;
				if (param.toAreaCode == "") return false;
				if (param.expressMode == "") return false;
				if (param.companyCode == "") return false;
				that.$util.networkRequest({
					url: "/Express/GetSpecialLineList",
					method: "POST",
					data: param,
					success: function(res) {
						if (res == null) {
							that.isCompanySpecial = false;
							return false;
						}
						if (res.length > 0) {
							that.specialLineData = res;
							that.isCompanySpecial = true;
						} else {
							that.isCompanySpecial = false;
						}
					}
				})
			},
			getOtherInsuranceCompany: function() {
				let that = this;
				that.$util.networkRequest({
					url: "/InsuranceCompany/GetList",
					success: function(res) {
						if (res.length == 0) return false;
						res.forEach(item => {
							if (that.insuredPrice.code == item.companyCode) {
								that.priceAgreementUrl = item.agreementUrl;
								that.priceAgreementContent = item.agreementContent;
							}
						});
					}
				});
			},
			//优惠券
			clickCoupon: function() {
				this.isCouponList = true;
				this.couponIndex = 0;
				
			},
			couponNav: function(i) {
				this.couponIndex = i;
				if (i == 0) {
					this.CouponList = this.AllCouponList.filter(item => {
						return item.isUse == true
					})
				} else {
					this.CouponList = this.AllCouponList.filter(item => {
						return item.isUse == false
					})
				}
				console.log(this.CouponList)

			},
			couponConfirm: function() {
				console.log(this.SelectedCoupon);
				this.couponInput = this.SelectedCoupon;
				this.isCouponList = false;
				this.calculateProductType()

			},
			scrolltolower: function() {
				console.log('====')
			},
			Valid() {
				if (!this.$util.isNotEmpty(this.sendInfo.contactsCode)) {
					this.$util.showToast("寄件人不能为空");
					return false;
				}
				if (!this.$util.isNotEmpty(this.repInfo.contactsCode)) {
					this.$util.showToast("收件人不能为空");
					return false;
				}
				if (this.expressTypeIndex == 0) {
					this.$util.showToast("请选择寄件形式");
					return false;
				}
				if (JSON.stringify(this.goodInfoData) == "{}") {
					this.$util.showToast("请填写物品信息");
					return false;
				}
				if (this.insuredPrice == null && this.type == "big") {
					this.$util.showToast("请填写保价信息");
					return false;
				}
				if (this.expressCompany.code == "db001" && this.isBillExpress == true && this.goodInfoData.packageservice == "") {
					this.$util.showToast("请选择包装材质");
					return false;
				}
				if (!this.$util.isNotEmpty(this.productType)) {
					this.$util.showToast("请选择产品类型");
					return false;
				}
				if (!this.checkedAgree) {
					this.$util.showToast("请详细阅读条款并勾选");
					return false;
				}
				if (this.expressTypeIndex == 2 && this.password == "") {
					let bool = true;
					this.serviceList.forEach(item => {
						if (item.serviceKey == "PayType" && item.serviceValue == 1) {
							bool = false;
						}
					});
					if (bool) {
						this.isCompanyPassword = true;
						return false;
					} else {
						this.isCompanyPassword = false;
					}
				} else {
					this.isCompanyPassword = false;
				}
				return true;
			},
			//清空数据
			emptyData() {
				this.password = "";
				this.estimatePriceList = [];
				this.sumMoney = "";
				this.goodName = "";
				this.insuredPrice = null;
				this.serviceNames = "";
				this.isBillExpress = false;
				this.checkedAgree = false;
				uni.removeStorageSync('insuredPrice');
				this.$store.state.expressDeliveryInfo = {
					type: "", //寄件形式
					companyCode: "", //物流公司
					expectTime: "", //期望时间
					sendAddress: {}, //寄件地址
					repAddress: {}, //收件地址
					goodInfo: {}, //物品信息
					insuredPrice: {}, //保价
					service: {}, //增值服务
					takeBill: {}
				}
			}
		}
	}
</script>
<style scoped>
	@import '../../common/css/index/expressDelivery.css';
</style>
