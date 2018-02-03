
CV.width = 320;
CV.height = 240;
var cap;
$(document).ready(function() {
	// JSカメラ初期化
	crocro.jscam.initSwfCam();
	// crocro.jscam.setFilter(["bin", "label", "hidePaint"]);
	cap = crocro.jscam.makeCaptureObject("cnvsCap");

	// コールバックの設定
	// cap.setBackDataType(["pixelSwf", "labelData"]);
	// cap.setExtrFnc(function(resObj){	// 各戻り値ごとの処理
	// 	var resArr = [];
	// 	if ("labelData" in resObj) {
	// 		var ld = resObj.labelData;
	// 		resArr.push("labelData.length : " + ld.length);
	// 		for (var i = 0; i < ld.length; i ++) {
	// 			var s = "";
	// 			$.each(ld[i], function(k, v) {s += k + ":" + v + ", "});
	// 			resArr.push("labelData[" + i + "] : " + s);
	// 		}
	// 	}
	// 	$("#resData").html(resArr.join("<br>"));
	// })

	$("#cap").click(function () {
		cancelAnimationFrame(anim);
	});
	$("#np").click(function () {
		cancelAnimationFrame(anim);
		negaposi();
	});
	$("#edge").click(function () {
		cancelAnimationFrame(anim);
		edge();
	});
	$("#bin").click(function () {
		cancelAnimationFrame(anim);
		bin();
	});
	$("#skin").click(function () {
		cancelAnimationFrame(anim);
		cut();
	});
	$("#cro").click(function () {
		cancelAnimationFrame(anim);
		trans();
	});
	$("#stop").click(function () {
		cancelAnimationFrame(anim);
	});
});

var anim;
// キャプチャ
function captureImg() {
	cap.capture();		// キャプチャ
}

// ネガポジ
function negaposi(){
	cap.capture(convert);
	function convert(){
		var inImg = CV.read("cnvsCap");
		var outImg = CV.negaposi(inImg);
		CV.draw("cnvsCap", outImg);
		anim = requestAnimationFrame(negaposi);
	}
}

// エッジ
function edge(){
	cap.capture(convert);
	function convert(){
		var inImg = CV.read("cnvsCap");
		var outImg = CV.edge(inImg);
		var outImg = CV.negaposi(outImg);
		CV.draw("cnvsCap", outImg);
		anim = requestAnimationFrame(edge);
	}
}

// エッジ＋二値化
function bin(){
	cap.capture(convert);
	function convert(){
		var threshold = $("#binV").val();
		var inImg = CV.read("cnvsCap");
		var outImg = CV.edge(inImg);
		var outImg = CV.negaposi(outImg);
		var outImg = CV.binary(outImg, threshold);
		CV.draw("cnvsCap", outImg);
		anim = requestAnimationFrame(bin);
	}
}

// 未使用
function hue(){
	cap.capture(convert);
		function convert(){
		var inImg = CV.read("cnvsCap");
		var outImg = CV.hsv.extractH(inImg, 0, 60, 0, 255, 0, 255, 60);
		CV.draw("cnvsCap", outImg);
		anim = requestAnimationFrame(hue);
	}
}

// 抽出領域のみ描画
function cut(){
	cap.capture(convert);
	function convert(){
		var inImg = CV.read("cnvsCap");
		var hueS = Number(document.getElementById('hueStart').value);
		var hueE = Number(document.getElementById('hueEnd').value);
		var satS = Number(document.getElementById('satStart').value);
		var satE = Number(document.getElementById('satEnd').value);
		var volS = Number(document.getElementById('volStart').value);
		var volE = Number(document.getElementById('volEnd').value);
		var outImg = CV.hsv.cutConvert(inImg, hueS, hueE, satS, satE, volS, volE);
		CV.draw("cnvsCap", outImg);
		anim = requestAnimationFrame(cut);
	}
}

// 抽出領域以外を描画
function trans(){
	cap.capture(convert);
	function convert(){
		var inImg = CV.read("cnvsCap");
		var hueS = Number(document.getElementById('hueStartT').value);
		var hueE = Number(document.getElementById('hueEndT').value);
		var satS = Number(document.getElementById('satStartT').value);
		var satE = Number(document.getElementById('satEndT').value);
		var volS = Number(document.getElementById('volStartT').value);
		var volE = Number(document.getElementById('volEndT').value);
		var outImg = CV.hsv.transConvert(inImg, hueS, hueE, satS, satE, volS, volE);
		CV.draw("cnvsCap", outImg);
		anim = requestAnimationFrame(trans);
	}
}

/*************
** その他のメソッド
**************/

/*
** 任意の要素のオフセットを取得する関数 （描画領域のオフセット位置取得用）
** マウス座標を正しく取得するために必要
*/
function getElementPosition(element) {
	var html = document.documentElement;
    var body = document.body;
	var top = left = scrollLeft = scrollTop = 0;
	do {
		top  += element.offsetTop  || 0;
		left += element.offsetLeft || 0;
		scrollLeft = body.scrollLeft || html.scrollLeft;
		scrollTop = body.scrollTop || html.scrollTop;
		element =  element.offsetParent;
	}
	while (element);
	return {top: top, left: left, scrollLeft: scrollLeft, scrollTop: scrollTop};
};

/*
** マウス移動時のイベント
*/
document.addEventListener('mousemove', function(e) {
	// 座標を取得＆オフセット補正
	var targetDiv = "cnvsCap";
	var mouseX = e.clientX - getElementPosition(cnvsCap).left + getElementPosition(cnvsCap).scrollLeft;
	var mouseY = e.clientY - getElementPosition(cnvsCap).top + getElementPosition(cnvsCap).scrollTop;

	var coodinate = [mouseX, mouseY];
	var color = {r:0, g:0, b:0, a:0, h:0, s:0, v:0};
	var rgba = [];
	var hsv = [];
	var info = "";
	/* ここからイベント実装 */
	var outImg = CV.read("cnvsCap");
	if(mouseX >=0 & mouseX < CV.width & mouseY >=0 & mouseY < CV.height){
		var i = (mouseY*CV.width + mouseX)*4;
		color.r = outImg.data[i+0];
		color.g = outImg.data[i+1];
		color.b = outImg.data[i+2];
		color.a = outImg.data[i+3];
		rgba[0] = color.r;
		rgba[1] = color.g;
		rgba[2] = color.b;
		rgba[3] = color.a;
		rgb2hsv(color);
		hsv[0] = parseInt(color.h);
		hsv[1] = parseInt(color.s);
		hsv[2] = parseInt(color.v);
		info = "R:" + rgba[0] + "　G:" + rgba[1] + "　B:" + rgba[2] + "　A:" + rgba[3] + "　　H:" + hsv[0] + "　S:" + hsv[1] + "　V:" + hsv[2];
		document.getElementById('info').innerHTML = info;
	}

	function rgb2hsv(color){
		var max = Math.max(color.r, Math.max(color.g, color.b));
		var min = Math.min(color.r, Math.min(color.g, color.b));
		// Hueの計算
		if(max == min){
			color.h = 0;
		}else if(max == color.r){
			color.h = (60 * (color.g - color.b) / (max - min) + 360) % 360;
		}else if(max == color.g){
			color.h = (60 * (color.b - color.r) / (max - min)) + 120;
		}else if(max == color.b){
			color.h = (60 * (color.r - color.g) / (max - min)) + 240;
		}
		// Saturationの計算
		if(max == 0){
			color.s = 0;
		}else{
			color.s = (255 * ((max - min) / max))
		}
		// Valueの計算
		color.v = max;
	}
}, false);

window.addEventListener('load', function (){
	document.getElementById('binV').value = 200;
	// 色抽出用
	document.getElementById('hueStart').value = -40;
	document.getElementById('hueEnd').value = 40;
	document.getElementById('satStart').value = 1;
	document.getElementById('satEnd').value = 180;
	document.getElementById('volStart').value = 0;
	document.getElementById('volEnd').value = 180;

	document.getElementById('hueStartT').value = 140;
	document.getElementById('hueEndT').value = 220;
	document.getElementById('satStartT').value = 0;
	document.getElementById('satEndT').value = 220;
	document.getElementById('volStartT').value = 0;
	document.getElementById('volEndT').value = 220;
}, false);
