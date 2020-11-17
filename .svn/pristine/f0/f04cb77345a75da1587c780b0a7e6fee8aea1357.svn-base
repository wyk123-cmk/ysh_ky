<template>
	<view class="page-bg">
		<page-imges :show="showImage"></page-imges>
		<!-- #ifdef H5 -->
		<!-- <view class="heard-custom" :style="{marginTop: t+'px', height: h+'px', 'line-height': h+'px'}">
			<text class="iconfont icon-fanhui-" @click="goback()"></text>
			<text class="title_txt">地址簿</text>
			<view class="wanc" @click="shareADD()">共享</view>
		</view> -->
		<view class="head-right" @click="shareADD()">共享</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="mp_vie"><text class="wanc_mp" @click="shareADD()">共享</text></view>
		<!-- #endif -->
		<view class="conter">
			<view class="search-box">
				<input type="text" placeholder="请输入姓名/电话/公司" v-model="keyword" @input="changeInput" />
				<text @click="search" class="iconfont icon-chaxun"></text>
			</view>
			<view class="tab-nav" v-if="isCompanyData">
				<view @click="bindTabNav(0)" :class="[isActive==0?'active':'']"><text>个人</text></view>
				<view @click="bindTabNav(1)" :class="[isActive==1?'active':'']"><text>企业</text></view>
			</view>
			<view v-if="isActive == 0">
				<view v-if="personalTotal==0" class="none-data-list">
					<image src="../../static/images/none-dz.svg"></image>暂无内容
				</view>
				<scroll-view v-else class="scroll-wrapper" :class="[isCompanyData?'':'top']" scroll-y="true" @scrolltolower="personalScrolltolower">
					<view class="address-list" v-for="(item, i) in personalList" :key="item.contactsCode">
						<view @click="btnSetAddress(item)">
							<view class="ad_name">
								<text v-if="item.isDefault" class="status">默认</text>
								<text class="name">{{item.name}}</text>
								<text>{{item.phone}}</text>
								<text class="iconfont icon-phone" @click="phoneCall(item.phone)"></text>
							</view>
							<text class="address_com">{{item.companyName}}</text>
							<text class="address">{{item.areaInfo.province+item.areaInfo.city+item.areaInfo.area+item.address}}</text>
						</view>
						<view class="operate">
							<view class="checkbox">
								<checkbox-group v-if="!item.isDefault" @change="setDefault">
									<checkbox :value="item.contactsCode" class="orange"></checkbox>
									<text>设为默认地址</text>
								</checkbox-group>
							</view>
							<view>
								<view class="item-icon" @click="setCopy(item)">
									<text class="iconfont icon-copy" style="margin-right: -5px;"></text>复制
								</view>
								<view class="item-icon" @click="goEdit(item.contactsCode)">
									<text class="iconfont icon-bianji2"></text>编辑
								</view>
								<view class="item-icon" @click="remove(item.contactsCode, item.isShare)">
									<text class="iconfont icon-shanchu"></text>删除
								</view>
							</view>
						</view>
					</view>
					<view v-if="personalList.length == personalTotal" class="no-more">—— 我是有底线的 ——</view>
				</scroll-view>
			</view>
			<view v-if="isActive == 1">
				<view v-if="companyTotal==0" class="none-data-list">
					<image src="../../static/images/none-dz.svg"></image>暂无内容
				</view>
				<scroll-view v-else class="scroll-wrapper" scroll-y="true" @scrolltolower="companyScrolltolower">
					<view class="address-list" v-for="(item, i) in companyList" :key="item.contactsCode">
						<view @click="btnSetAddress(item)">
							<view>
								<!-- <text v-if="item.isDefault" class="status">默认</text> -->
								<text class="name">{{item.name}}</text>
								<text>{{item.phone}}</text>
								<text class="iconfont icon-phone" @click="phoneCall(item.phone)"></text>
							</view>
							<text class="address">{{item.areaInfo.province+item.areaInfo.city+item.areaInfo.area+item.address}}</text>
						</view>
						<!-- <view class="operate" v-if="!item.isDefault"> -->
						<!-- 	<view class="checkbox">
							<checkbox-group @change="setDefault">
								<checkbox :value="item.contactsCode" class="orange"></checkbox>
								<text>设为默认地址</text>
							</checkbox-group>
						</view> -->
						<!-- <view>
							<view class="item-icon" @click="goEdit(item.contactsCode)">
								<text class="iconfont icon-bianji2"></text>编辑
							</view>
							<view class="item-icon" @click="remove(item.contactsCode)">
								<text class="iconfont icon-shanchu"></text>删除
							</view>
						</view> -->
						<!-- </view> -->
					</view>
					<view v-if="companyList.length == companyTotal" class="no-more">—— 我是有底线的 ——</view>
				</scroll-view>
			</view>
			
			<view @click="goEdit()" class="btn">
				<button>新增地址</button>
			</view>
			
	
		
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				keyword: "",
				type: "",
				isInit: true,
				isActive: 0,
				limit: 5,
				code: "",
				isAdd:false,
				personalPage: 1,
				personalTotal: 0,
				personalList: [],
				companyPage: 1,
				companyTotal: 0,
				companyList: [],
				isCompanyData: false,
				t: 0,
				h: 44,
			}
		},
		created() {

			var that = this;
			//#ifdef MP-WEIXIN
			uni.getSystemInfo({ //获取设备信息
				success: (res) => {
					//获取右上角胶囊的布局信息
					let rect = uni.getMenuButtonBoundingClientRect ? uni.getMenuButtonBoundingClientRect() : null;
					let height = 44;
					if (rect != null) {
						height = (rect.bottom + rect.top) - (res.statusBarHeight * 2);
					}
					that.t = res.statusBarHeight;
					that.h = height;
				}
			});
			//#endif

		},
		onLoad(options) {
			const that = this;
			if (options.type != undefined) this.type = options.type;
			if (options.code != undefined) this.code = options.code;
			//判断是否加入企业
			that.$util.networkRequest({
				url: "/Company/IsRegister",
				success: function(res) {
					if (res) {
						that.isCompanyData = true;
					}
				},
			});
		},
		onShow() {
			this.showImage = getApp().globalData.isDiscountPopup;
			if (!this.isInit) {
				this.isInit = true;
				return false;
			}
			this.keyword = "";
			this.search();
			this.GetShareList()
		},
		onBackPress(event){
			if(event.from=="backbutton"){
				// uni.navigateTo({
				// 	url:"/pages/me/addressList"
				// })
			}
		},
		methods: {
			bindTabNav: function(key) {
				if (this.isActive == key) return false;
				this.isActive = key;
			},
			GetShareList: function(){
				const that = this;
				uni.showLoading({ title: '加载中...' });
				that.$util.networkRequest({
					url: "/AddressBook/GetShareListByPage",
					data: {
						page: 1,
						limit: 2,
					},
					success: function(res){
						let total = res.total;
						if(total == 0 || res.list.length == 0) {
							that.isAdd=true;
							
						}
						else{
							that.isAdd=false;
							
						}
					}
				})
			},
			shareADD(){
				if(this.isAdd){
					uni.navigateTo({
						url:"/pages/news/selectAddress"
					})
				}
				else{
					uni.navigateTo({
						url:"/pages/news/shareAddress"
					})
				}
			},
			changeInput: function(e) {
				this.keyword = e.detail.value;
				this.search();
			},
			goback() {
				// #ifdef H5
				uni.switchTab({
					url:"/pages/me/userInfo"
				})
				// #endif
				// #ifdef MP-WEIXIN
				uni.navigateBack({
			
				})
				// #endif
			},
			search: function() {
				this.personalPage = 1;
				this.personalTotal = 0;
				this.personalList = [];
				this.companyPage = 1;
				this.companyTotal = 0;
				this.companyList = [];
				this.personalAddressList();
				this.companyAddressList();
			},
			//个人
			personalScrolltolower: function() {
				if (Math.ceil(this.personalTotal / this.limit) >= this.personalPage) {
					this.personalAddressList();
				}
			},
			personalAddressList() {
				const that = this;
				that.getList(that.personalPage, 1, function(res) {
					that.personalPage++;
					that.personalTotal = res.total;
					that.personalList = that.personalList.concat(res.list);
				})
			},
			//企业
			companyScrolltolower: function() {
				if (Math.ceil(this.companyTotal / this.limit) >= this.companyPage) {
					this.companyAddressList();
				}
			},
			companyAddressList() {
				const that = this;
				that.getList(that.companyPage, 2, function(res) {
					that.companyPage++;
					that.companyTotal = res.total;
					that.companyList = that.companyList.concat(res.list);
				})
			},
			//设置默认
			setDefault: function(e) {
				let code = e.detail.value[0];
				const that = this;
				uni.showLoading({
					title: '加载中...'
				});
				that.$util.networkRequest({
					url: "/AddressBook/SetDefault",
					method: "POST",
					data: {
						value: code
					},
					success: function(res) {
						that.keyword = "";
						if (that.$store.state.expressDeliveryInfo["repAddress"].contactsCode == code) {
							that.$store.state.expressDeliveryInfo["repAddress"] = {};
						}
						that.search();
					}
				})
			},
			//删除
			remove: function(_code, _isShare) {
				const that = this;
				let _msg = '您确定要删除吗？';
				if (_isShare) {
					_msg = '该地址已与企业成员共享，删除后成员将不可见？';
				}
				uni.showModal({
					title: '提示',
					content: _msg,
					success: function(res) {
						if (res.confirm) {
							that.$util.networkRequest({
								url: "/AddressBook/Remove",
								data: {
									value: _code
								},
								method: "POST",
								success: function(res) {
									uni.showToast({
										title: '删除成功',
										duration: 2000,
										icon: 'none',
									});
									if (that.isActive == 0) {
										//个人
										that.personalList = that.personalList.filter(item => {
											return item.contactsCode != _code;
										});
										that.companyPage = 1;
										that.companyTotal = 0;
										that.companyList = [];
										that.companyAddressList();
									}
								}
							});
						}
					},
				});
			},
			getList: function(page, type, callback) {
				const that = this;
				uni.showLoading({
					title: '加载中...'
				});
				that.$util.networkRequest({
					url: "/AddressBook/GetListByPage",
					data: {
						page: page,
						limit: that.limit,
						bookType: type, //1=个人2=企业
						keyword: that.keyword
					},
					success: function(res) {
						let total = res.total;
						if (total == 0 || res.list.length == 0) return false;
						if (callback) callback(res);
					}
				})
			},
			goEdit: function(_code) {
		  _code = _code == undefined ? '' : _code;
		   uni.navigateTo({
		    url: "/pages/me/addressEdit?addresscode=" + _code + "&type=" + this.type
		   });
		 
			},
			btnSetAddress(data) {
				const that = this;
				if (this.type == "") return false;
				let _contactsCode = data.contactsCode;
				let newData = {
					name: data.name,
					contactsCode: _contactsCode,
					address: data.areaInfo.province + data.areaInfo.city + data.areaInfo.area + data.address,
					ad: data.address,
					areaCode: data.areaInfo.areaCode,
					phone: data.phone,
					yfaddress: data.areaInfo.province + data.areaInfo.city + data.areaInfo.area,

				};
				if (this.type == "send") {
					//批量寄寄件不能与收件相同
					let ls = this.$store.state.batchOrderInfo.list;
					let bool = true;
					if (ls.length != 0) {
						ls.forEach(function(item, i) {
							if (item.repAddress.contactsCode == _contactsCode) {
								that.$util.showToast("寄件人不能和收件人一致");
								bool = false;
							}
						});
					} else {
						if (JSON.stringify(this.$store.state.expressDeliveryInfo["repAddress"]) != "{}") {
							if (this.$store.state.expressDeliveryInfo["repAddress"].contactsCode == _contactsCode) {
								this.$util.showToast("寄件人不能和收件人一致");
								return false;
							}
						}
					}
					if (!bool) return false;
					this.$store.state.expressDeliveryInfo["sendAddress"] = newData;
				}
				if (this.type == "rep") {
					if (JSON.stringify(this.$store.state.expressDeliveryInfo["sendAddress"]) != "{}") {
						if (this.$store.state.expressDeliveryInfo["sendAddress"].contactsCode == _contactsCode) {
							this.$util.showToast("收件人不能和寄件人一致");
							return false;
						}
					} else {
						if (data.isDefault) {
							if (this.code == _contactsCode) {
								this.$util.showToast("收件人不能和寄件人一致");
								return false;
							}
						}
					}
					this.$store.state.expressDeliveryInfo["repAddress"] = newData;
				}
				this.$util.navigateBack(this);
			},
			//拨打电话
			phoneCall(tel) {
				this.isInit = false;
				uni.makePhoneCall({
					phoneNumber: tel //仅为示例
				});
			},
			//复制
			setCopy: function(item){
				var str = item.name+" "+item.phone+" "+item.companyName+" "+item.areaInfo.province+item.areaInfo.city+item.areaInfo.area+item.address;
				uni.setClipboardData({ data: str, success: () => {
					uni.showToast({ title: "内容已复制", icon: 'success' });
				}});
			}
		}
	}
</script>
<style scoped>
	.heard-custom {
		background: #FFFFFF;
		position: fixed;
		left: 0;
		right: 0;
		padding: 0px 10px;
		z-index: 10;
		text-align: center;
	}
	.mp_vie{
		width: 65%;
		height: 40px;
		position: fixed;
		bottom: 149px;
		z-index: 100;
		right: 15px;

	}
	/* .conter{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	} */
	
	.heard-custom .iconfont{
		position: absolute;
		left: 10px;
	}
	.heard-custom .title_txt {
	}

	.heard-custom .wanc {
		position: absolute;
		right: 0;
		top: 0;
		font-size: 13px;
		padding: 0px 15px;
	}
.wanc_mp{
	font-size: 13px;
	
	height: 50px;
	line-height: 50px;
	text-align: center;
	
	-webkit-align-self: flex-end;
	align-self: flex-end;
	display: block;
	background-color: #007AFF;
	color: #FFFFFF;
	width: 50px;
	float: right;
	border-radius: 50px;
	margin-top: 10px;


}
	.search-box {
		background-color: #FFFFFF;
		padding: 8px 15px;
		display: -webkit-box;
		display: box;
	}

	.search-box input,
	.search-box text {
		height: 35px;
		line-height: 35px;
		background-color: #F7F7F7;
	}

	.add_adde {
		margin: 0px auto;
	}

	.search-box input {
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
		width: calc(100% - 40px);
		padding-left: 10px;
	}

	.ad_name {
		font-size: 15px;
	}

	.search-box text {
		border-bottom-right-radius: 4px;
		border-top-right-radius: 4px;
		display: block;
		width: 30px;
		text-align: center;
	}

	.tab-nav {
		background-color: #FFFFFF;
		line-height: 35px;
		display: flex;
		display: -webkit-flex;
		text-align: center;
	}

	.tab-nav>view {
		width: 50%;
	}

	.tab-nav>view text {
		width: 60%;
		display: block;
		margin: 0 auto;
	}

	.tab-nav .active text {
		border-bottom: 2px solid #4285F4;
	}

	.scroll-wrapper.top {
		top: 50px;
	}

	.scroll-wrapper {
		position: absolute;
		top: 90px;
		left: 0;
		right: 0;
		bottom: 70px;
		overflow-y: auto;
	}

	.address-list {
		background-color: #FFFFFF;
		margin-top: 10px;
		padding: 15px 15px 8px;
		line-height: 20px;
	}

	.address-list .name {
		font-size: 15px;
		margin-right: 8px;
	}

	.address-list .status {
		background: rgba(248, 111, 0, .2);
		color: #FD9523;
		font-size: 12px;
		float: left;
		display: block;
		padding: 0 4px;
		margin-right: 8px;
		border-radius: 2px;
	}

	.address-list .address {
		font-size: 13px;
		color: #999;
		display: block;

	}

	.address-list .icon-phone {
		color: #469DE2;
		padding-left: 5px;
		float: right;
	}

	.address_com {
		font-size: 14px;
		color: #666666;
		display: block;
		padding: 6px 0px;
	}

	.operate {
		border-top: 1px solid #EEEEEE;
		justify-content: space-between;
		margin-top: 8px;
		padding-top: 5px;
	}

	.operate,
	.operate .checkbox checkbox-group,
	.operate .item-icon {
		display: flex;
		display: -webkit-flex;
		align-items: center;
	}

	.operate .checkbox {
		margin-left: -5px;
	}

	.operate .item-icon {
		float: left;
		color: #999999;
		margin-left: 10px;
	}

	.operate .item-icon text {
		padding-right: 3px;
	}

	.btn {
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 10px 15px;
		text-align: center;
	}

	.btn button {
		background-color: #4285F4;
		color: #FFFFFF;
		line-height: 44px;
		border-radius: 20px;
	}
</style>
