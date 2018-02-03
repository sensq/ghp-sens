document.write('<script type="text/javascript" src="./sylvester-min.js"></script>');

/*
** 画像読み込み
*/
function setImage(img){
	var canvas = document.getElementById("img");
	var context = canvas.getContext('2d');
	
	// 画像読み込み
	image = new Image();
	image.src = img;
	// 読み込み終了を待つ
	image.onload = function() {
	// 描画領域を画像のサイズにリサイズ
		printHomography();
		canvas.width = image.width;
		canvas.height = image.height;
		// 画像描画
		context.drawImage(image, 0, 0);
		// 画素データ読み込み
		input = context.getImageData(0, 0, canvas.width, canvas.height);
		w = input.width, h = input.height;
		inputData = input.data;
		// 画像変換用オブジェクト
		output = context.createImageData(canvas.width, canvas.height);
		outputData = output.data;
		imgConvert.homography();
	}
}

/*
** 画像変換
*/
var imgConvert = (function(){
	// 描画領域リサイズ
	var canvas,context;
	function resize(){
		canvas = document.getElementById("outputImg");
		context = canvas.getContext('2d');
		canvas.width = output.width;
		canvas.height = output.height;
	}

	// 初期化
	this.init = function(){
		resize();
		context.restore();
	}

	// 平面射影変換
	this.homography = function(){
		setHomography();
		// 変換行列
		var homography_mat = [];
		homography_mat = createSquare(3);
		homography_mat[0][0] = document.getElementById("homography00").value;
		homography_mat[0][1] = document.getElementById("homography01").value;
		homography_mat[0][2] = document.getElementById("homography02").value;
		homography_mat[1][0] = document.getElementById("homography10").value;
		homography_mat[1][1] = document.getElementById("homography11").value;
		homography_mat[1][2] = document.getElementById("homography12").value;
		homography_mat[2][0] = document.getElementById("homography20").value;
		homography_mat[2][1] = document.getElementById("homography21").value;
		homography_mat[2][2] = document.getElementById("homography22").value;
		homography_mat = mat.inverse(homography_mat);
		var ha = document.getElementById("homography00").value;
		var hb = document.getElementById("homography01").value;
		var hc = document.getElementById("homography02").value;
		var hd = document.getElementById("homography10").value;
		var he = document.getElementById("homography11").value;
		var hf = document.getElementById("homography12").value;
		var hg = document.getElementById("homography20").value;
		var hh = document.getElementById("homography21").value;
		// 変換前の座標
		var p = [];
		p = createMat(3, 1);
		// 変換後の座標
		var P = [];
		P = createMat(3, 1);
		resize();
		// p[0][0]はx座標, p[1][0]はy座標
		for (p[1][0] = 0; p[1][0] < h-1; p[1][0]++) {
			for (p[0][0] = 0; p[0][0] < w-1; p[0][0]++) {
				// 平面射影変換
				P = mat.multiply(homography_mat, p);
				var i = (p[1][0]*w + p[0][0])*4;
				var j = (P[1][0]*w + P[0][0])*4;
				outputData[i + 0] = inputData[j + 0];
				outputData[i + 1] = inputData[j + 1];
				outputData[i + 2] = inputData[j + 2];
				outputData[i + 3] = inputData[j + 3];
			}
		}
		context.putImageData(output, 0, 0);
	}
	return this;
})();

/*
** 行列作成・計算用クラス
*/
var mat = (function (){
	// 任意サイズの単位正方行列作成
	this.createSquare = function(size){
		var mat = new Array(size);
		for (i = 0; i < mat.length; i++) {
			mat[i] = new Array(size);
			for (j = 0; j < mat[i].length; j++) {
				mat[i][j] = 0;
				mat[i][i] = 1;
			}
		}
		return mat;
	}
	// 任意サイズの行列作成
	this.createMat = function(row, col){
		var mat = new Array(row);
		for (i = 0; i < mat.length; i++) {
			mat[i] = new Array(col);
			for (j = 0; j < mat[i].length; j++) {
				mat[i][j] = 0;
			}
		}
		return mat;
	}
	// 一般的な掛け算
	this.multiply = function(mat1, mat2){
		var mat = [];
		mat = this.createMat(mat1.length, mat2[0].length);
		var i,j,k;
		for(i=0; i<mat1.length; i++){
			for(j=0; j<mat2[i].length; j++){
				mat[i][j] = 0;
				for(k=0; k<mat2.length; k++){
					mat[i][j] += mat1[i][k] * mat2[k][j];
				}
				mat[i][j] = parseInt(mat[i][j]);
			}
		}
		return mat;
	}
	// 逆行列
	this.inverse = function(mat){
		var a = mat[0][0],  b = mat[0][1],  c = mat[0][2],
			d = mat[1][0],  e = mat[1][1],  f = mat[1][2],
			g = mat[2][0],  h = mat[2][1],  i = mat[2][2];
		var s = a * e * i + g * b * f + h * d * c;
		var t = c * e * g + d * b * i + a * f * h;
		var det = s - t;
		if(det == 0){
			alert("逆行列が存在しません");
		}else{
			var idet = 1.0 / det;
			var dst = [];
			dst = createMat(mat.length);
			dst[0][0] = (e　*　i - f　*　h) * idet;
			dst[0][1] = (c　*　h - b　*　i) * idet;
			dst[0][2] = (b　*　f - c　*　h) * idet;
			dst[1][0] = (f　*　g - d　*　i) * idet;
			dst[1][1] = (a　*　i - c　*　g) * idet;
			dst[1][2] = (c　*　d - a　*　f) * idet;
			dst[2][0] = (d　*　h - e　*　g) * idet;
			dst[2][1] = (b　*　g - a　*　h) * idet;
			dst[2][2] = (a　*　e - b　*　d) * idet;
			return dst;
		}
	};
	return this;
})();

// 画像の読み込み
function loadImg(){
	if (document.getElementById('loadImg').files[0].type.match('image.*')) {
		var img = document.getElementById('loadImg').files[0];
		var info = "name:" + img.name + " size:" + img.size;
		document.getElementById('list').innerHTML = info;
		var fr = new FileReader();
		// 読み込み終了を待つ
		fr.onload = function (e) {
			setImage(e.target.result);
		 	imgConvert.init();
		}
		fr.readAsDataURL(img);
	}else{
		alert("画像ファイルを指定して下さい");
	}
}

// Enterキーで実行
function pressEnter(keycode) {
	if(keycode == 13){
		easyConvert.homography();
	}
}

function printHomography(){
	document.getElementById("homography_x0").value = 1;
	document.getElementById("homography_y0").value = 1;
	document.getElementById("homography_x1").value = 1;
	document.getElementById("homography_y1").value = image.height;
	document.getElementById("homography_x2").value = image.width;
	document.getElementById("homography_y2").value = parseInt(image.height * 0.8);
	document.getElementById("homography_x3").value = image.width;
	document.getElementById("homography_y3").value = parseInt(image.height * 0.2);

	document.getElementById("homography_X0").value = 1;
	document.getElementById("homography_Y0").value = 1;
	document.getElementById("homography_X1").value = 1;
	document.getElementById("homography_Y1").value = image.height;
	document.getElementById("homography_X2").value = image.width;
	document.getElementById("homography_Y2").value = image.height;
	document.getElementById("homography_X3").value = image.width;
	document.getElementById("homography_Y3").value = 1;
}

window.addEventListener('load', function (){
	setImage("perspective_color.jpg");

	src = [];
	src = mat.createMat(4);
	dst = [];
	dst = mat.createMat(4);

	setHomography(src, dst);
	easyConvert.init();
}, false);


/*
** 値を読み込み＆求めた値を表示
*/
function setHomography(){
	src[0][0] = document.getElementById("homography_x0").value;
	src[0][1] = document.getElementById("homography_y0").value;
	src[1][0] = document.getElementById("homography_x1").value;
	src[1][1] = document.getElementById("homography_y1").value;
	src[2][0] = document.getElementById("homography_x2").value;
	src[2][1] = document.getElementById("homography_y2").value;
	src[3][0] = document.getElementById("homography_x3").value;
	src[3][1] = document.getElementById("homography_y3").value;

	dst[0][0] = document.getElementById("homography_X0").value;
	dst[0][1] = document.getElementById("homography_Y0").value;
	dst[1][0] = document.getElementById("homography_X1").value;
	dst[1][1] = document.getElementById("homography_Y1").value;
	dst[2][0] = document.getElementById("homography_X2").value;
	dst[2][1] = document.getElementById("homography_Y2").value;
	dst[3][0] = document.getElementById("homography_X3").value;
	dst[3][1] = document.getElementById("homography_Y3").value;

	var arrayHomography = calcHomography(src, dst);

	document.getElementById("homography00").value = arrayHomography.elements[0];
	document.getElementById("homography01").value = arrayHomography.elements[1];
	document.getElementById("homography02").value = arrayHomography.elements[2];
	document.getElementById("homography10").value = arrayHomography.elements[3];
	document.getElementById("homography11").value = arrayHomography.elements[4];
	document.getElementById("homography12").value = arrayHomography.elements[5];
	document.getElementById("homography20").value = arrayHomography.elements[6];
	document.getElementById("homography21").value = arrayHomography.elements[7];
	document.getElementById("homography22").value = arrayHomography.elements[8];
}

/*
** Homography行列の計算
*/
function calcHomography(src, dst){
	// 行列を読み込み
	var x1 = src[0][0];
	var y1 = src[0][1];
	var x2 = src[1][0];
	var y2 = src[1][1];
	var x3 = src[2][0];
	var y3 = src[2][1];
	var x4 = src[3][0];
	var y4 = src[3][1];

	var u1 = dst[0][0];
	var v1 = dst[0][1];
	var u2 = dst[1][0];
	var v2 = dst[1][1];
	var u3 = dst[2][0];
	var v3 = dst[2][1];
	var u4 = dst[3][0];
	var v4 = dst[3][1];

	// 入力座標
	SRC = [
		[ x1, y1, 1, 0, 0, 0, -x1*u1, -y1*u1, 0 ],
		[ 0, 0, 0, x1, y1, 1, -x1*v1, -y1*v1, 0 ],
		[ x2, y2, 1, 0, 0, 0, -x2*u2, -y2*u2, 0 ],
		[ 0, 0, 0, x2, y2, 1, -x2*v2, -y2*v2, 0 ],
		[ x3, y3, 1, 0, 0, 0, -x3*u3, -y3*u3, 0 ],
		[ 0, 0, 0, x3, y3, 1, -x3*v3, -y3*v3, 0 ],
		[ x4, y4, 1, 0, 0, 0, -x4*u4, -y4*u4, 0 ],
		[ 0, 0, 0, x4, y4, 1, -x4*v4, -y4*v4, 0 ],
		[ 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
	];
	// 出力座標
	DST = [
		[ u1 ],
		[ v1 ],
		[ u2 ],
		[ v2 ],
		[ u3 ],
		[ v3 ],
		[ u4 ],
		[ v4 ],
		[ 1 ],
	];

	var src_mat = $M(SRC);
	var dst_mat = $M(DST);
	// 行列を計算
	var arrayHomography = src_mat.inv().x(dst_mat);
	return arrayHomography;
}

// window.addEventListener("click",function(e){
// 	var rect = e.target.getBoundingClientRect();
// 	var mouseX = (e.clientX - rect.left).toFixed(0);
// 	var mouseY = (e.clientY - rect.top).toFixed(0);

// 	alert(mouseX + "," +  mouseY);
// },false);
