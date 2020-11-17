<template name="addressPicker">
	<view v-cloak>
	    <picker mode="multiSelector" 
			:range="range" :value="pickerValue" :disabled="isDisabled" 
			@change="region_change" @columnchange="region_change_col" @cancel="region_cancel"
			>
			<slot></slot>
		</picker>
	</view>
</template>
<script>
// import {addressList} from "../../static/address.js";
export default {
	name: "addressPicker",
	props: {
		defaultValue:{ type: [Array,String], default: "" },
		disabled:{ type: Boolean, default: false },
		state:{ type: String, default: "" }, //2: 只显示到省市
	},
	data(){
		return {
			pickerValue: [],
			isDisabled: false,
			range: [],
			zones_tree: [],
		}
	},
	watch: {
		defaultValue(){
			this.defaultValue = this.defaultValue;
			this.value_format();
			this.range_set();
		}
	},
	created: async function(e){
		const that = this;
		if(that.$store.state.addressInit){
			that.$store.state.addressInit = false;
			uni.showLoading({title: "加载...", mask: true });
			var [error, res] = await uni.request({
		        url: that.apiUrl + "/Area/GetListEx",
		        dataType: "json",
		        method: "GET",
		    });
			that.$store.state.addressJson = res.data.data;
			that.setTree();
		}else{
			let time = setInterval(function(){
				if(that.$store.state.addressJson.length > 0){
					clearInterval(time);
					that.setTree();
				}
			},1000);
		}
	},
	methods: {
		setTree(){
			this.zones_tree = this.$store.state.addressJson;
			this.isDisabled = this.disabled;
			this.value_format();
			this.range_set();
			uni.hideLoading();
		},
		value_format(){
			var _value = this.defaultValue;
			if(typeof(_value)=='string' && _value.indexOf(',')>0){
				_value = _value.split(',');
			}
			var sk=0,ck=0,zk=0;
			if(typeof(_value)=='string'){
				this.zones_tree.forEach((sv,si)=>{
					sv.list.forEach((cv,ci)=>{
						cv.list.forEach((zv,zi)=>{
							if(zv.code==_value){
								sk=si;
								ck=ci;
								zk=zi;
							}
						})
					})
				})
				this.pickerValue=[sk,ck,zk];
			}else if(typeof(_value[0])=='string'){
				this.zones_tree.forEach((sv,si)=>{
					if(sv.title==_value[0]){
						sk=si;
						sv.list.forEach((cv,ci)=>{
							if(cv.title==_value[1]){
								ck=ci;
								cv.list.forEach((zv,zi)=>{
									if(zv.title==_value[2]){
										zk=zi;
									}
								})
							}
						})
					}
				})
				this.pickerValue = [sk,ck,zk];
			} else{
				this.pickerValue = _value;
			}
		},
		range_set() {
			var zones_ary=[[],[],[]];
			if(this.state == 2){
				var zones_ary=[[],[]];
			}
			this.zones_tree.forEach((sv,si)=>{
				zones_ary[0].push(sv.title);
				if(si==this.pickerValue[0]){
					sv.list.forEach((cv,ci)=>{
						zones_ary[1].push(cv.title);
						if(this.state != 2){
							if(ci==this.pickerValue[1]){
								cv.list.forEach((zv,zi)=>{
									zones_ary[2].push(zv.title);
								})
							}
						}
					})
				}
			})
			this.range=zones_ary;
		},
		region_change(e){
			var v=e.detail.value;
			var value=[],code=[]
			var sv=this.zones_tree[v[0]]
			value.push(sv.title)
			code.push(sv.code)
			var cv=sv.list[v[1]];
			value.push(cv.title)
			code.push(cv.code)
			if(this.state != 2){
				var zv=cv.list[v[2]];
				value.push(zv.title)
				code.push(zv.code)
			}
			e.detail={code:code,value:value,data:zv}
			this.$emit('change',e)
		},
		region_change_col(e){
			this.pickerValue[e.detail.column]=e.detail.value
			this.range_set();
			this.$emit('columnchange',e)
		},
		region_cancel(e){
			this.$emit('cancel',e)
		},
	}
}
</script>