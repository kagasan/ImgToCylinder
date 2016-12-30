var MakeCylinder =function(src, width, height){
	var form = document.forms.fm;
	var stl = new STL("Cylinder");//STLクラス
	
	var sh = parseFloat(form.sh.value);//しきい値
	var wsp = parseFloat(form.wsp.value);//画像横分割数
	var hsp = parseFloat(form.hsp.value);//画像縦分割数
	var lng = parseFloat(form.lng.value);//円柱縦長さ
	var rw = parseFloat(form.rw.value);//長方形穴横長さ
	var rh = parseFloat(form.rh.value);//長方形穴縦長さ
	var dep = parseFloat(form.dep.value);//長方形穴深さ
	
	var rd = lng * width / (Math.PI*2*height);//半径
	var angle = Math.PI*2/wsp;//角度
	
	//dep=rd/10;
	
	//穴空け用
	var px = rd + (rd*Math.cos(angle)-rd)/2;
	var pz = rd*Math.sin(angle)/2;
	var tx = (rd-px)/Math.sqrt((rd-px)*(rd-px)+pz*pz);
	var tz = (-pz)/Math.sqrt((rd-px)*(rd-px)+pz*pz);
	var ax = px + tx * rw/2;
	var az = pz + tz * rw/2;
	var bx = px - tx * rw/2;
	var bz = pz - tz * rw/2;
	var a2x = ax - ax/Math.sqrt(ax*ax+az*az)*dep;
	var a2z = az - az/Math.sqrt(ax*ax+az*az)*dep;
	var b2x = bx - bx/Math.sqrt(bx*bx+bz*bz)*dep;
	var b2z = bz - bz/Math.sqrt(bx*bx+bz*bz)*dep;
	var p0x = rd;
	var p0z = 0;
	var p1x = rd*Math.cos(angle);
	var p1z = rd*Math.sin(angle);
	
	form.para.value="半径："+rd+"\n";
	form.para.value+="分割横サイズ："+rd*Math.sqrt(2*(1-Math.cos(angle)))+"\n";
	form.para.value+="分割縦サイズ："+lng/hsp+"\n";
	
	for(var i=0;i<wsp;i++){
		stl.add_p_tri(p_roty([[0,0,0],[rd,0,0],[rd*Math.cos(angle),0,rd*Math.sin(angle)]] ,angle*i));
		stl.add_p_tri(p_roty([[0,lng,0],[rd*Math.cos(angle),lng,rd*Math.sin(angle)],[rd,lng,0]] ,angle*i));
		for(var j = 0;j<hsp;j++){
			var sum = 0;
			for(var dx = parseInt(width-i*width/wsp);dx>width-(i+1) * width/wsp;dx--){
				if(dx<0 || dx>=width)continue;
				for(var dy = parseInt(height-(j*height/hsp));dy>height-((j+1)*height/hsp);dy--){
					if(dy<0 || dy>=height)continue;
					var idx = (dx + dy * width) * 4;
					var gray = (src[idx] + src[idx + 1] + src[idx + 2]) / 3;
					if(gray<sh)sum++;
				}
			}
			var y0 = j * lng / hsp;
			var y1 = (j + 0.5) * lng / hsp - rh /2;
			var y2 = (j + 0.5) * lng / hsp + rh /2;
			var y3 = (j + 1) * lng / hsp;
			if(sum/((width/wsp)*(height/hsp))>0.5){
				//stl.add_p_quad(p_roty([[,,],[,,],[,,]],angle*i));
				stl.add_p_quad(p_roty([[p0x,y0,p0z],[p0x,y1,p0z],[p1x,y0,p1z]],angle*i));
				stl.add_p_quad(p_roty([[p0x,y2,p0z],[p0x,y3,p0z],[p1x,y2,p1z]],angle*i));
				stl.add_p_quad(p_roty([[p0x,y1,p0z],[p0x,y2,p0z],[ax,y1,az]],angle*i));
				stl.add_p_quad(p_roty([[bx,y1,bz],[bx,y2,bz],[p1x,y1,p1z]],angle*i));
				
				//stl.add_p_quad(p_roty([[ax,y1,az],[ax,y2,az],[bx,y1,bz]],angle*i));
				
				
				stl.add_p_tri(p_roty([[a2x,y1,a2z],[a2x,y2,a2z],[b2x,y1,b2z]],angle*i));
				stl.add_p_tri(p_roty([[b2x,y2,b2z],[b2x,y1,b2z],[a2x,y2,a2z]],angle*i));
				
				stl.add_p_tri(p_roty([[a2x,y1,a2z],[b2x,y1,b2z],[ax,y1,az]],angle*i));
				stl.add_p_tri(p_roty([[bx,y1,bz],[ax,y1,az],[b2x,y1,b2z]],angle*i));
				
				stl.add_p_tri(p_roty([[a2x,y2,a2z],[ax,y2,az],[b2x,y2,b2z]],angle*i));
				stl.add_p_tri(p_roty([[bx,y2,bz],[b2x,y2,b2z],[ax,y2,az]],angle*i));
				
				stl.add_p_tri(p_roty([[a2x,y1,a2z],[ax,y1,az],[a2x,y2,a2z]],angle*i));
				stl.add_p_tri(p_roty([[ax,y2,az],[a2x,y2,a2z],[ax,y1,az]],angle*i));
				
				stl.add_p_tri(p_roty([[b2x,y2,b2z],[bx,y2,bz],[b2x,y1,b2z]],angle*i));
				stl.add_p_tri(p_roty([[bx,y1,bz],[b2x,y1,b2z],[bx,y2,bz]],angle*i));
				
			}
			else{
				stl.add_p_quad(p_roty([[p0x,y0,p0z],[p0x,y3,p0z],[p1x,y0,p1z]],angle*i));
			}
		}
	}
	form.ta.value=stl.str();//STL書き込み
}

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
				var src = srcData.data;
				MakeCylinder(src, width, height);
				//ImageProcessing(src, width, height);
				context.putImageData(srcData, 0, 0);
				var dataurl = canvas.toDataURL();
				document.getElementById("output").innerHTML = "<img src='" + dataurl + "'>";
			}
			img.src = reader.result;
		}
	}, false);
});

//フォームの内容をダウンロードする
function DL(){
	var form = document.forms.fm;
	var content = form.ta.value;
	var blob = new Blob([ content ], { "type" : "text/plain" });
	if(window.navigator.msSaveBlob){
		window.navigator.msSaveBlob(blob, "test.txt"); 
		//msSaveOrOpenBlobの場合はファイルを保存せずに開ける
		window.navigator.msSaveOrOpenBlob(blob, "test.txt"); 
	}
	else{
		document.getElementById("download").href = window.URL.createObjectURL(blob);
	}
}
