var ImageProcessing = function(src, dst, width, height) {
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			var idx = (j + i * width) * 4;
			var gray = (src[idx] + src[idx + 1] + src[idx + 2]) / 3;
			if(gray<128)gray=0;
			else gray=255;
			dst[idx] = gray;
			dst[idx + 1] = gray;
			dst[idx + 2] = gray;
			dst[idx + 3] = src[idx + 3];
		}
	}
};
window.addEventListener("DOMContentLoaded", function(){
	var ofd = document.getElementById("selectfile");
	ofd.addEventListener("change", function(evt) {
		var img = null;
		var canvas = document.createElement("canvas");
		var file = evt.target.files;
		var reader = new FileReader();
		reader.readAsDataURL(file[0]);
		reader.onload = function(){
			img = new Image();
			img.onload = function(){
				var context = canvas.getContext('2d');
				var width = img.width;
				var height = img.height;
				canvas.width = width;
				canvas.height = height;
				context.drawImage(img, 0, 0);
				var srcData = context.getImageData(0, 0, width, height);
				var dstData = context.createImageData(width, height);
				var src = srcData.data;
				var dst = dstData.data;
				ImageProcessing(src, dst, width, height);
				context.putImageData(dstData, 0, 0);
				var dataurl = canvas.toDataURL();
				document.getElementById("output").innerHTML = "<img src='" + dataurl + "'>";
			}
			img.src = reader.result;
		}
	}, false);
});