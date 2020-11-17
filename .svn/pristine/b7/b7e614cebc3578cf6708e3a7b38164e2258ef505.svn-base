/**

* 压缩

* @param {Object} imgSrc 图片url
* 
* @param {Object} suffix 图片类型

* @param {Object} callback 回调设置返回值

*/

export function translate(imgSrc, suffix, callback) {

	var img = new Image();

	img.src = imgSrc;

	img.onload = function() {

		var that = this;

		var h = that.height;

		// 默认按比例压缩

		var w = that.width;

		var canvas = document.createElement('canvas');

		var ctx = canvas.getContext('2d');

		var anw = document.createAttribute("width");

		anw.nodeValue = w;

		var anh = document.createAttribute("height");

		anh.nodeValue = h;

		canvas.setAttributeNode(anw);

		canvas.setAttributeNode(anh);

		ctx.drawImage(that, 0, 0, w, h);

		//压缩比例

		var quality = 0.1;
		var imgType = suffix == "jpg" ? "image/jpeg" : "image/"+suffix;
		var base64 = canvas.toDataURL(imgType, quality);

		canvas = null;

		//Blob对象转blob地址
		var blobUrl = base64ToBlob(base64);

		callback(blobUrl);
	}
}

/**

* base转Blob对象

* @param {Object} base64 base64地址

*/

export function base64ToBlob(base64) {

	var arr = base64.split(','),

		mime = arr[0].match(/:(.*?);/)[1],

		bstr = atob(arr[1]),

		n = bstr.length,

		u8arr = new Uint8Array(n);

	while (n--) {

		u8arr[n] = bstr.charCodeAt(n);

	}
	
	var blob = new Blob([u8arr], {

		type: mime

	});
	return  window.URL.createObjectURL(blob);

}
