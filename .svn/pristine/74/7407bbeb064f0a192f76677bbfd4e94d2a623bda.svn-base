import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 应用初始状态
const state = {
	expressDeliveryInfo: {
		type: "", //寄件形式
		companyCode: "",//物流公司
		expectTime: "", //期望时间
		sendAddress: {}, //寄件地址
		repAddress: {},  //收件地址
		goodInfo: {}, //物品信息
		insuredPrice: {}, //保价
		service: {}, //增值服务
		takeBill: {}, //提货单
		carType: {} ,//车辆类型
		busName:"",
		busPhone:""
	},
	batchOrderInfo: { //批量订单
		list: [],
		companyCode: "",//物流公司
		sendAddress: {} //寄件地址
	},
	addressJson: [],
	addressInit: true
}
// 创建 store 实例
export default new Vuex.Store({
    state
})