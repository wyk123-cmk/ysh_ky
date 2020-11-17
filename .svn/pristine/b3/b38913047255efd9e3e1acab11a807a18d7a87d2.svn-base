#### 特性说明
1. 行政区用的是2018还是2019年的全国标准行政区划, 也可以定义远端的 json 地址, 格式看使用文档
2. 返回的 detail.value 和官方的 mode=region 比缺少了 post_code, 主要是我的数据库中没有邮编, 剩下的 code/value 格式和官方保持一致
3. 传参支持官方的 value, disabled
4. value 的传值支持
  4.1 行政区号数组 [省,市,区]
  4.2 行政区号字符串 "省,市,区" / "区"
  4.3 暂不支持城市名设置value, 有需要可以自己改造, 很简单的代码
5. 事件支持 change / cancel

#### 使用方式
```javascript
import regionPicker from "@/components/region-picker/region-picker.vue"
```
```javascript
components: {  
	regionPicker  
},
```
#### Value 传值说明
```html
<!-- 单传区级行政区号 -->
<region-picker @change="region_change" value="120103000000">
<!-- 传省市区级名称(数组) -->
<region-picker @change="region_change" :value="['河北省','石家庄市','桥西区']">
<!-- 字符串/整形均可, 没具体测试, 如果报错, 就试着改一下类型 -->
```
### disabled 传值说明 是否禁用
```html
<region-picker :disabled=false>
#### 使用远端 json
```
返回json数据应符合格式如下
```json
[{
	title: '福建省',
	code: null,
	list: [{
		title: '福州市',
		code: null,
		list: [{
			title: '仓山区',
			code: '350104000000',
			// post_code: xxx
			// 其他自定义的数据键值对: 值
			// change 事件的 detail.data 属性会返回所选区域的完整的对象
		},
		{
		//...第二个区域
		}]
	},
	{
	//...第二个城市
	}]
},
{
//...第二个省份
}]
```