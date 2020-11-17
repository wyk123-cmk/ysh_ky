<template>
	<view>
		<page-imges :show="showImage"></page-imges>
		<view class="tops">
			<view class="con">
				<text class="iconfont icon-ji1"></text>
				<view class="add_ji">{{sendInfo}}</view>
			</view>
			<view class="con">
				<text class="iconfont icon-shou" style="color:#ffaa00"></text>
				<view class="add_ji">{{repInfo}}</view>
			</view>
			<view class="ot_top">
				<view>编号：{{ExpressCarInfo.mastCode}}</view>
				<view class="right_time">创建时间：

					{{$util.formatDate.format(ExpressCarInfo.createTime,"yyyy-MM-dd") }}</view>
			</view>
		</view>
		<view class="jjxx">
			<view class="name">寄件信息</view>
			<view class="jj_ones">
				寄件时间
				<text>{{$util.formatDate.format(ExpressCarInfo.sendTime,"yyyy-MM-dd") }}</text>
			</view>
			<view class="jj_ones">
				物品名称
				<text>{{goods.name}}</text>
			</view>
			<view class="jj_ones">
				物品重量
				<text>{{goods.weight}}kg</text>
			</view>
			<view class="jj_ones">
				物品体积
				<text>{{goods.volume}}m³</text>
			</view>
			<view class="jj_ones">
				车型要求
				<text>{{carInfo}}</text>
			</view>
			<view class="jj_ones">
				其他要求
				<text>{{ExpressCarInfo.remark}}</text>
			</view>
		</view>
		<view class="jjxx" style="border-top: 10px solid #EEEEEE;" v-if="offerPriceList.length>0">
			<view class="name">报价信息</view>
			<view v-for="(item,index) in offerPriceList" :key="index">
				<view class="jj_ones">
					{{item.productName}}
					<text>{{item.userPrice}}元</text>
				</view>
				<view class="jj_ones">
					报价时间
					<text>{{$util.formatDate.format(item.addTime,"yyyy-MM-dd hh:mm:ss") }}</text>
				</view>
			</view>
		</view>
		<view class="bot" v-if="offerPriceList.length==0" v-cloak>
			<view class="libj" @click="baojia(2)">拒绝报价</view>
			<view class="libj" @click="baojia(1)" v-if="ExpressCarInfo.status==1">立即报价</view>
			<view class="libj" v-else>已报价</view>
		</view>
		<view class="mask" v-if="isShow" @click="Cloase()"></view>
		<view class="sele" v-if="baojiaS">
			<view class="tit">整车报价</view>
			<view class="zxbj">
				<view class="zx">在线报价</view>
				<view class="chexin">
					<view class="sele_chexi" v-for="(item,index) in proList" :key="index">
						{{item.productName}}
						<input type="text" placeholder="输入金额" @input="getPrice" @blur="setPrice($event,item.productCode)" />元</view>
				</view>
			</view>
			<view class="subnmit" @click="subnmitBJ()">提交</view>
		</view>
		<view class="sele" v-if="baojiaR">
			<view class="tit">拒绝报价</view>
			<view class="yuanyin">
				<textarea placeholder="拒绝原因" v-model="refuContext"></textarea>
			</view>
			<view class="subnmit" @click="refuseBJ()">提交</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false,
				baojiaS: false,
				baojiaR: false,
				refuContext: "",
				cxList: ['车型1', '车型2'],
				dropS: false,
				code: "",
				ExpressCarInfo: {},
				offerPriceList: [],
				expressTo: {},
				price: "",
				priceList: [],
				expressFrom: {},
				goods: {},
				sendInfo: "",
				repInfo: "",
				proList: [],
				carInfo: {}

			}
		},
		onLoad(options) {
			if (options.params) {
				this.code = options.params;
				this.init();
			}
			this.GetProductList();
			this.showImage = getApp().globalData.isDiscountPopup;
		},
		methods: {
			baojia(type) {
				if (type == 1) {
					this.isShow = true;
					this.baojiaS = true;
					this.baojiaR = false;
				} else {
					this.isShow = true;
					this.baojiaS = false;
					this.baojiaR = true;
				}

			},
			getPrice(e) {
				this.price = e.detail.value;
			},
			refuseBJ() {

				let that = this;
				if (that.refuContext == "") {
					that.$util.showToast("请输入拒绝原因");
					return false;
				}
				let param = {
					"priceList": null,
					"code": that.code,
					"passWord": "123456",
					"refuse": that.refuContext
				}
				that.$util.networkRequest({
					url: "/ExpressCar/RefuseOrder",
					data: param,
					method: "POST",
					success: res => {
						if (res) {
							that.$util.showToast('提交成功');
							that.isShow = false;
							that.baojiaS = false;
							that.baojiaR = false;
						}

					},
				});
			},
			setPrice(e, code) {
				this.priceList = this.proList;
				this.priceList.forEach(item => {
					// delete item.productName;
					if (item.productCode == code) {
						item.price = e.detail.value;
					}
				})
			},
			subnmitBJ() {
				let that = this;
				if (that.price == "") {
					that.$util.showToast("请输入报价金额");
					return false;
				}
				let list = [];
				(this.priceList).forEach(item => {
					list.push({price: item.price, productCode: item.productCode})
				})
				let param = {
					"priceList": list,
					"code": that.code,
					"passWord": "123456",
					"refuse": ""
				}
				that.$util.networkRequest({
					url: "/ExpressCar/PostOfferPrice",
					data: param,
					method: "POST",
					success: res => {
						if (res) {
							that.$util.showToast('提交成功');
							that.isShow = false;
							that.baojiaS = false;
							that.baojiaR = false;
							that.init();
						}
					},
				});
			},
			GetProductList() {
				let that = this;
				let param = {
					companyCode: "db001"
				}
				that.$util.networkRequest({
					url: "/ExpressCar/GetProductList",
					data: param,
					method: "GET",
					success: res => {
						that.proList = res;
					},
				});
			},
			init() {
				let that = this;
				let param = {
					code: that.code
				}
				that.$util.networkRequest({
					url: "/ExpressCar/GetQueryOfferExpress",
					data: param,
					method: "GET",
					success: res => {
						that.ExpressCarInfo = res;
						that.offerPriceList = res.offerPriceList;
						that.expressFrom = res.expressFrom;
						that.sendInfo = that.expressFrom.areaInfo.province + that.expressFrom.areaInfo.city + that.expressFrom.areaInfo
							.area + that.expressFrom.address;
						that.expressTo = res.expressTo;
						that.repInfo = that.expressTo.areaInfo.province + that.expressTo.areaInfo.city + that.expressTo.areaInfo
							.area + that.expressTo.address;
						that.goods = res.goods;
						that.carInfo = res.carInfo.carName + '/' + res.carInfo.carLength + '米/' + res.carInfo.carWeight + 'kg';

					}
				})
			},

			Cloase() {
				this.isShow = false;
				this.baojiaS = false;
				this.baojiaR = false;
			},
			drop() {
				this.dropS = !this.dropS;
			},
			selectItm() {
				this.dropS = false;
			}
		}
	}
</script>

<style scoped>
	[v-cloak] {
		display: none;
	}

	.tops {
		padding: 0px 15px;
		border-bottom: 10px solid #EEEEEE;
	}

	.yuanyin {
		padding: 10px 15px;
		border-bottom: 1px solid #EEEEEE;

	}

	.yuanyin textarea {
		width: 90%;
		padding: 5%;
		height: 100px;
		border: 1px solid #EEEEEE;
		text-align: left;
	}

	.zxbj {
		display: flex;
		flex-direction: column;
		/* justify-content: space-around; */
		padding: 10px 15px;
		align-items: center;
	}

	.zx {
		width: 100%;
		height: 40px;
		line-height: 40px;
		font-size: 16px;
		font-weight: bold;
		text-align: left;
	}

	.chexin {


		position: relative;
	}

	.sele_chexi {
		height: 40px;
		line-height: 40px;
		border: 1px solid #EEEEEE;
		margin-right: 10px;
		margin-top: 10px;
		padding-left: 15px;
		padding-right: 15px;
		display: flex;
		align-items: center;
	}

	.sele_chexi input {
		width: 100px;
		text-align: right;
		margin-left: 20px;
		margin-right: 10px;
	}

	.sele_chexi .iconfont {
		float: right;
		margin-right: 15px;
	}

	.sele_chexi_list {
		position: absolute;
		top: 42px;
		z-index: 100;

	}

	.sele_chexi_list view {
		padding-left: 15px;
		height: 40px;
		line-height: 40px;
		border: 1px solid #EEEEEE;
		width: 130px;
		background-color: #FFFFFF;
	}

	.je {
		display: flex;
		padding: 10px 15px;
		font-size: 16px;
		align-items: center;
		position: relative;
		border-bottom: 1px solid #EEEEEE;
	}

	.je label {
		position: absolute;
		top: 18px;
		right: 33px;
	}

	.je input {
		align-self: flex-end;
		width: 130px;
		height: 40px;
		padding-left: 15px;
		line-height: 40px;
		border: 1px solid #EEEEEE;
		margin-right: 10px;
		margin-left: auto;
	}

	.tit {
		width: 100%;
		height: 45px;
		line-height: 45px;
		text-align: center;
		font-size: 15px;
		border-bottom: 1px solid #EEEEEE;
	}

	.sele {
		width: 80%;
		position: absolute;
		top: 20%;
		left: 10%;
		border-radius: 10px;
		background-color: #FFFFFF;
		padding-bottom: 6px;
		z-index: 1000;
	}

	.ot_top view {
		color: #666666;
	}

	.right_time {
		color: #666666;
		align-self: flex-end;
		margin-left: 30px;
	}

	.mask {
		position: fixed;
		z-index: 999;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .6);
		text-align: center;
	}

	.bot {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 90%;
		margin: 30px auto;
	}

	.libj {

		height: 40px;
		line-height: 40px;
		width: 40%;
		background-color: #007AFF;
		color: #FFFFFF;
		text-align: center;
		border-radius: 5px;
	}

	.subnmit {
		height: 40px;
		line-height: 40px;
		width: 80%;
		background-color: #007AFF;
		color: #FFFFFF;
		text-align: center;
		border-radius: 5px;
		margin: 20px auto;
	}

	.iconfont icon-shou {
		color: #E7501E;
	}

	.ot_top {
		color: #666666;
		display: flex;
		align-items: center;
		padding: 8px 0px;
		color: #666666;
		font-size: 13px;
	}

	.con {
		display: flex;
		align-items: center;
		padding: 8px 0px;
	}

	.con .iconfont {
		font-size: 20px;
	}

	.add_ji {
		margin-left: 10px;
	}

	.name {
		font-size: 16px;
		font-weight: bold;
		height: auto;
		line-height: 40px;
		padding: 0px 15px;
		border-bottom: 1px solid #EEEEEE;
	}

	.jj_ones {
		color: #666666;
		height: auto;
		line-height: 40px;
		padding: 0px 15px;
		font-size: 15px;
		border-bottom: 1px solid #EEEEEE;
		display: flex;
	}

	.jj_ones text {
		color: black;
		margin-left: 30px;
		width: 60%;
		height: auto;
		display: block;
	}
</style>
