/*
3次元点の表現
vertex
var p = [1.1, 4.5, 1.4];
*/
function vec(a, b){
	var v = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
	return v;
}
function  v_add(a, b){
	var v = [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
	return v;
}
function crs(a, b){
	var v =[
		a[1]*b[2]-a[2]*b[1],
		a[2]*b[0]-a[0]*b[2],
		a[0]*b[1]-a[1]*b[0]
	];
	return v;
}
function v_str(a){
	return ""+a[0]+" "+a[1]+" "+a[2];
}
function v_iden(a){
	var t = Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);
	var v = [
		a[0]/t,
		a[1]/t,
		a[2]/t
	];
	return v;
}
function v_rotx(a, rad){
	var v = [
		a[0],
		a[1]*Math.cos(rad)-a[2]*Math.sin(rad),
		a[1]*Math.sin(rad)+a[2]*Math.cos(rad),
	];
	return v;
}
function v_roty(a, rad){
	var v = [
		a[0]*Math.cos(rad)+a[2]*Math.sin(rad),
		a[1],
		-a[0]*Math.sin(rad)+a[2]*Math.cos(rad),
	];
	return v;
}
function v_rotz(a, rad){
	var v = [
		a[0]*Math.cos(rad)-a[1]*Math.sin(rad),
		a[0]*Math.sin(rad)+a[1]*Math.cos(rad),
		a[2]
	];
	return v;
}

/*
3次元3(4)角形の表現
polygon
*/
function p_add(p, v){
	var q = [];
	q.push(v_add(p[0], v));
	q.push(v_add(p[1], v));
	q.push(v_add(p[2], v));
	return q;
}
function p_rotx(p, rad){
	var q = [];
	q.push(v_rotx(p[0], rad));
	q.push(v_rotx(p[1], rad));
	q.push(v_rotx(p[2], rad));
	return q;
}
function p_roty(p, rad){
	var q = [];
	q.push(v_roty(p[0], rad));
	q.push(v_roty(p[1], rad));
	q.push(v_roty(p[2], rad));
	return q;
}
function p_rotz(p, rad){
	var q = [];
	q.push(v_rotz(p[0], rad));
	q.push(v_rotz(p[1], rad));
	q.push(v_rotz(p[2], rad));
	return q;
}


/*
STLクラス
使い方は下のsampleを参照
*/
class STL{
	constructor(name){
		this.name = name;
		this.data = "solid "+name+"\n";
	}
	add_v_tri(a, b, c){
		var ab = vec(a, b);
		var ac = vec(a, c);
		var n = crs(ab, ac);
		this.data += "facet normal "+v_str(n)+"\n";
		this.data += "outer loop\n";
		this.data += "vertex "+v_str(a)+"\n";
		this.data += "vertex "+v_str(b)+"\n";
		this.data += "vertex "+v_str(c)+"\n";
		this.data += "endloop\n";
		this.data += "endfacet\n";
	}
	add_v_quad(a, b, c){
		var ab = vec(a, b);
		var ac = vec(a, c);
		var n = crs(ab, ac);
		this.data += "facet normal "+v_str(n)+"\n";
		this.data += "outer loop\n";
		this.data += "vertex "+v_str(a)+"\n";
		this.data += "vertex "+v_str(b)+"\n";
		this.data += "vertex "+v_str(c)+"\n";
		this.data += "endloop\n";
		this.data += "endfacet\n";
		var d = v_add(b, ac);
		this.data += "facet normal "+v_str(n)+"\n";
		this.data += "outer loop\n";
		this.data += "vertex "+v_str(c)+"\n";
		this.data += "vertex "+v_str(b)+"\n";
		this.data += "vertex "+v_str(d)+"\n";
		this.data += "endloop\n";
		this.data += "endfacet\n";
	}
	add_p_tri(p){
		var a = p[0];
		var b = p[1];
		var c = p[2];
		var ab = vec(a, b);
		var ac = vec(a, c);
		var n = crs(ab, ac);
		this.data += "facet normal "+v_str(n)+"\n";
		this.data += "outer loop\n";
		this.data += "vertex "+v_str(a)+"\n";
		this.data += "vertex "+v_str(b)+"\n";
		this.data += "vertex "+v_str(c)+"\n";
		this.data += "endloop\n";
		this.data += "endfacet\n";
	}
	add_p_quad(p){
		var a = p[0];
		var b = p[1];
		var c = p[2];
		var ab = vec(a, b);
		var ac = vec(a, c);
		var n = crs(ab, ac);
		this.data += "facet normal "+v_str(n)+"\n";
		this.data += "outer loop\n";
		this.data += "vertex "+v_str(a)+"\n";
		this.data += "vertex "+v_str(b)+"\n";
		this.data += "vertex "+v_str(c)+"\n";
		this.data += "endloop\n";
		this.data += "endfacet\n";
		var d = v_add(b, ac);
		this.data += "facet normal "+v_str(n)+"\n";
		this.data += "outer loop\n";
		this.data += "vertex "+v_str(c)+"\n";
		this.data += "vertex "+v_str(b)+"\n";
		this.data += "vertex "+v_str(d)+"\n";
		this.data += "endloop\n";
		this.data += "endfacet\n";
	}
	str(){
		this.data += "endsolid "+this.name+"\n";
		return this.data;
	}
}

//立方体を作るサンプル
function stl_cube_sample(){
	var stl = new STL("sample");
	var poly = [
		[1, -1, -1],
		[1, 1, -1],
		[1, -1, 1]
	];
	for(var i = 0;i<4;i++){
		stl.add_p_quad(poly);
		poly = p_rotz(poly, Math.PI/2);
	}
	poly = p_roty(poly, Math.PI/2);
	stl.add_p_quad(poly);
	poly = p_roty(poly, Math.PI);
	stl.add_p_quad(poly);
	return stl.str();
}
