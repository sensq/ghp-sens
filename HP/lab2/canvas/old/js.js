// グラフ作成用ライブラリ
document.write('<script type="text/javascript" src="raphael-min.js"></script>');
document.write('<script type="text/javascript" src="g.raphael-min.js"></script>');
document.write('<script type="text/javascript" src="g.line-min.js"></script>');

// オブジェクト作成
var CV = function(){};
// 履歴格納用
CV.history = [];
// RGBとHSV格納用
CV.color = [];

/*
** オブジェクトのプロパティの一覧を表示する関数
** デバッグ用
*/
function printProperties(obj, opt) {
	this.obj = obj;
	this.opt = opt || 0;
	this.properties = new String();
	// 第2引数に1を入れるとalertで表示される
	if(this.opt == 1){
		for (this.prop in this.obj){
			if(this.obj[this.prop] == ''){
				this.obj[this.prop] = '無し';
			}
			this.properties += this.prop + "\n" + this.obj[this.prop] + "\n" + "\n";
		}
		if(this.properties == ''){
			this.properties = 'Property is none.';
		}
		alert(this.properties);
	}else{
		for (this.prop in this.obj){
			if(this.obj[this.prop] == ''){
				this.obj[this.prop] = '<i>無し</i>';
			}
		this.properties += "<font color='blue'><b>" + this.prop + "</b></font> =<br>" + this.obj[this.prop] + "<br><br>";
		}
		if(this.properties == ''){
			this.properties = 'Property is none.';
		}
		// 別ページに表示される
		// 場所によってはFPS表示の枠などが表示されるのは仕様
		this.newWin = window.open(this.obj, this.obj, "width=400,height=600");
		this.newWin.document.open();
		this.newWin.document.write('<title>プロパティリスト</title>');
		this.newWin.document.write(this.properties);
		this.newWin.document.close();
	}
};

// 読み込んだ画像を描画
function setImage(img){
	if(!document.getElementById("change").checked){
		var canvas = document.getElementById("img");
		var context = canvas.getContext('2d');
	}else{
		var canvas = document.getElementById("outputImg");
		var context = canvas.getContext('2d');
	}
	// 画像読み込み
	image = new Image();
	image.src = img;
	// 読み込み終了を待つ
	image.onload = function() {
		// 描画領域を画像のサイズにリサイズ
		// width>500 or height>400の場合は強制的に500に縮小
		var scale = 400/image.height;
		if(image.width > image.height)
			scale = 500/image.width;
		if(scale < 1.0 & document.getElementById('resize').checked){
			canvas.width = scale*image.width;
			canvas.height = scale*image.height;
			context.scale(scale, scale);
		}else{
			canvas.width = image.width;
			canvas.height = image.height;
		}
		// 画像描画
		context.drawImage(image, 0, 0);
		// 画素データ読み込み
		input = context.getImageData(0, 0, canvas.width, canvas.height);
		w = input.width, h = input.height;
		inputData = input.data;
		// 初期化用オブジェクト
		initialize = context.getImageData(0, 0, canvas.width, canvas.height);
		initializeData = initialize.data;
		// 画像変換用オブジェクト
		output = context.createImageData(canvas.width, canvas.height);
		outputData = output.data;
		CV.history.push(context.drawImage(image, 0, 0));
		CV.hist();
	}
}

/***************
** 具体的なメソッド
****************/

/////////////////
// 基本的なメソッド //
/////////////////

// 描画領域リサイズ
CV.resize = function(){
	if(!document.getElementById("change").checked){
		this.canvas = document.getElementById("outputImg");
		this.context = this.canvas.getContext('2d');
		this.canvas.width = output.width;
		this.canvas.height = output.height;
	}else{
		this.canvas = document.getElementById("img");
		this.context = this.canvas.getContext('2d');
		this.canvas.width = output.width;
		this.canvas.height = output.height;
	}
}

// 初期化
CV.init = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 4; c++) {
				var i = (y*w + x)*4 + c;
				inputData[i] = initializeData[i];
				outputData[i] = initializeData[i];
			}
		}
	}
	this.context.putImageData(initialize, 0, 0);
}

// 重ね掛け用のコピー
CV.copy = function(){
	var history = CV.history;
	CV.resize();
	var temp = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
	history.push(temp);
	if(document.getElementById('copy').checked){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				for (var c = 0; c < 4; c++) {
					var i = (y*w + x)*4 + c;
					inputData[i] = outputData[i];
					history[history.length-1].data[i] = outputData[i]; 
				}
			}
		}
	}
	this.context.putImageData(output, 0, 0);
}

// 戻る
CV.undo = function(){
	var history = CV.history;
	// resizeだとダメ
	if(!document.getElementById("change").checked){
		var canvas = document.getElementById("outputImg");
		var context = canvas.getContext('2d');
		canvas.width = output.width;
		canvas.height = output.height;
	}else{
		var canvas = document.getElementById("img");
		var context = canvas.getContext('2d');
		canvas.width = output.width;
		canvas.height = output.height;
	}
	var pre = history.length - 2;
	if(pre > 0){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				for (var c = 0; c < 4; c++) {
					var i = (y*w + x)*4 + c;
					inputData[i] = history[pre].data[i];
					outputData[i] = history[pre].data[i];
				}
			}
		}
		history.pop();
	}
	context.putImageData(output, 0, 0);
}

// 入れ替え
CV.change = function(){
	CV.resize();
	this.context.restore();
	this.context.putImageData(output, 0, 0);
}

// ヒストグラム
CV.hist = function(){
	CV.resize();
	var hist = {
		r: [],
		g: [],
		b: []
	};
	for(var i=0; i<256; i++){
		hist.r[i] = hist.g[i] = hist.b[i] = 0;
	}
	// 各色の輝度ごとの画素数を求める
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			i = (y*w + x)*4;
			outputData[i + 0] = inputData[i + 0];
			outputData[i + 1] = inputData[i + 1];
			outputData[i + 2] = inputData[i + 2];
			outputData[i + 3] = inputData[i + 3];
			hist.r[ inputData[i + 0] ]++;
			hist.g[ inputData[i + 1] ]++;
			hist.b[ inputData[i + 2] ]++;
		}
	}
	// 全画素数に対する輝度ごとの画素の割合を求める
	var max = w*h;
	for(var i=0; i<256; i++){
		hist.r[i] = hist.r[i]/max*100;
		hist.g[i] = hist.g[i]/max*100;
		hist.b[i] = hist.b[i]/max*100;
	}
	// 輝度0と255は表示しない
	hist.r[0] = hist.r[255] = 0;
	hist.g[0] = hist.g[255] = 0;
	hist.b[0] = hist.b[255] = 0;
	CV.copy();
	// グラフを描画
	(function(){
		// 前回のグラフを消去
		document.getElementById('histgram').innerHTML = "";
		document.getElementById('histgram').style.backgroundColor = "#aaccff";
		var r = Raphael("histgram", 460, 170);	// 表示領域のサイズ
		var txtattr = { font: "15px sans-serif" };
		r.text(200, 12, "Color Histgram").attr(txtattr);
		r.text(20, 12, "[%]").attr(txtattr);
		r.text(430, 150, "輝度").attr(txtattr);

		var x = [];
		for(var i=0; i<=260; i++){
			x[i] = i;
		}
		// 原点（左上）, width, height, xValue[], yValue[], opts
		var lines = r.linechart(10, 12, 400, 145, 
			// 横
			[x],
			// 縦
			[hist.r, hist.g, hist.b],
			// オプション
			{
				nostroke: false,	// falseで点を繋ぐ
				axis: "0 0 1 1",	// 上, 右, 下, 左軸を表示
				axisxstep: 13,	// x軸の分割数（ラベル間隔に相当 260/13=20）
				axisystep: 5,	// y軸の分割数
				colors: ["#f00", "#0f0", "#00f"],	// 折れ線の色
				gutter: 15,	// padding
				shade: true,
				symbol: "circle",	// 点の形
				smooth: true
			}
		);
		var xlabel = lines.axis[0].text.items;
		var ylabel = lines.axis[1].text.items;
		lines.axis.attr({"stroke-width": 3,});	// 軸の太さ
		// ラベルの文字サイズ変更
		for(var i=0; i<xlabel.length; i++){
			xlabel[i].attr(txtattr);
		}
		for(var i=0; i<ylabel.length; i++){
			ylabel[i].attr(txtattr);
		}
		// 点のサイズ変更
		lines.symbols.attr({ r: 1 });
	})();
}

// 基本形
CV.sample = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			outputData[i + 0] = inputData[i + 0];
			outputData[i + 1] = inputData[i + 1];
			outputData[i + 2] = inputData[i + 2];
			outputData[i + 3] = inputData[i + 3];
		}
	}
	this.context.putImageData(output, 0, 0);
}

/////////////////////
// RGBとHSVの相互変換 //
/////////////////////

// RGB→HSV変換
CV.RGB2HSV = function(color){
	CV.resize();
	// colorに値を格納
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			color.push({
				r:inputData[i],
				g:inputData[i+1],
				b:inputData[i+2],
				h:0, s:0, v:0
			});
		}
	}
	// HSVの値を計算して格納
	for(var i=0; i<color.length; i++){
		var max = Math.max(color[i].r, Math.max(color[i].g, color[i].b));
		var min = Math.min(color[i].r, Math.min(color[i].g, color[i].b));
		// Hueの計算
		if(max == min){
			color[i].h = 0;
		}else if(max == color[i].r){
			color[i].h = (60 * (color[i].g - color[i].b) / (max - min) + 360) % 360;
		}else if(max == color[i].g){
			color[i].h = (60 * (color[i].b - color[i].r) / (max - min)) + 120;
		}else if(max == color[i].b){
			color[i].h = (60 * (color[i].r - color[i].g) / (max - min)) + 240;
		}
		// Saturationの計算
		if(max == 0){
			color[i].s = 0;
		}else{
			color[i].s = (255 * ((max - min) / max))
		}
		// Valueの計算
		color[i].v = max;
	}
	return color;
}

// HSV→RGB変換
CV.HSV2RGB = function(color){
	var hi, f, p, q, t;
	for(var i=0; i<color.length; i++){
		hi = Math.floor(color[i].h / 60.0) % 6;
		f  = (color[i].h / 60.0) - Math.floor(color[i].h / 60.0);
		p  = Math.round(color[i].v * (1.0 - (color[i].s / 255.0)));
		q  = Math.round(color[i].v * (1.0 - (color[i].s / 255.0) * f));
		t  = Math.round(color[i].v * (1.0 - (color[i].s / 255.0) * (1.0 - f)));
		
		switch(hi){
			case 0:
				color[i].r = color[i].v;
				color[i].g = t;
				color[i].b = p;
				break;
			case 1:
				color[i].r = q;
				color[i].g = color[i].v;
				color[i].b = p;
				break;
			case 2:
				color[i].r = p;
				color[i].g = color[i].v;
				color[i].b = t;
				break;
			case 3:
				color[i].r = p;
				color[i].g = q;
				color[i].b = color[i].v;
				break;
			case 4:
				color[i].r = t;
				color[i].g = p;
				color[i].b = color[i].v;
				break;
			case 5:
				color[i].r = color[i].v;
				color[i].g = p;
				color[i].b = q;
				break;
			default:
				alert("error");
		}
	}
	return color;
}

// HSV変換
CV.hsv = function(type){
	CV.resize();
	var hue = Number(document.getElementById('hueValue').value);
	var sat = Number(document.getElementById('satValue').value);
	var vol = Number(document.getElementById('volValue').value);

	// 抽出用
	var hueS = Number(document.getElementById('hueStart').value);
	var hueE = Number(document.getElementById('hueEnd').value);
	var satS = Number(document.getElementById('satStart').value);
	var satE = Number(document.getElementById('satEnd').value);
	var volS = Number(document.getElementById('volStart').value);
	var volE = Number(document.getElementById('volEnd').value);
	var hueCH = Number(document.getElementById('convHValue').value);
	// 彩度・明度は使いにくいのでコメントアウト
	// var hueCS = Number(document.getElementById('convSValue').value);
	// var hueCV = Number(document.getElementById('convVValue').value);
	// 配列を初期化
	CV.color.length = 0;
	// HSVへ変換
	var color = CV.RGB2HSV(CV.color);
	// 一つ一つ関数化すると長くなるので簡略化
	switch(type){
		// 色相変換
		case 'hue':
			for(var i=0; i<color.length; i++){
				color[i].h += hue;
				if(color[i].h < 0){
					color[i].h += 360;
				}else if(color[i].h > 360){
					color[i].h -= 360;
				}
			}
		break;
		// 彩度調整
		case 'sat':
			for(var i=0; i<color.length; i++){
				if(color[i].s > 10)
					color[i].s += sat;
				if(color[i].s < 0){
					color[i].s = 0;
				}else if(color[i].s > 255){
					color[i].s = 255;
				}
			}
		break;
		// 明度調整
		case 'vol':
			for(var i=0; i<color.length; i++){
				color[i].v += vol;
				if(color[i].v < 0){
					color[i].v = 0;
				}else if(color[i].v > 255){
					color[i].v = 255;
				}
			}
		break;
		// 抽出領域以外カット
		case 'cut':
			for(var i=0; i<color.length; i++){
				if(!(
					(color[i].h >= hueS) & (color[i].h <= hueE) &
					(color[i].s >= satS) & (color[i].s <= satE) &
					(color[i].v >= volS) & (color[i].v <= volE)
					)
				){
					color[i].v = 0;
				}
			}
		break;
		// 抽出領域を白に
		case 'white':
			for(var i=0; i<color.length; i++){
				if(
					(color[i].h >= hueS) & (color[i].h <= hueE) &
					(color[i].s >= satS) & (color[i].s <= satE) &
					(color[i].v >= volS) & (color[i].v <= volE)
				){
					color[i].s = 0;
					color[i].v = 255;
				}
			}
		break;
		// 抽出領域を黒に
		case 'black':
			for(var i=0; i<color.length; i++){
				if(
					(color[i].h >= hueS) & (color[i].h <= hueE) &
					(color[i].s >= satS) & (color[i].s <= satE) &
					(color[i].v >= volS) & (color[i].v <= volE)
				){
					color[i].v = 0;
				}
			}
		break;
		// 抽出領域の色相を変換
		case 'extractH':
			for(var i=0; i<color.length; i++){
				if(
					(color[i].h >= hueS) & (color[i].h <= hueE) &
					(color[i].s >= satS) & (color[i].s <= satE) &
					(color[i].v >= volS) & (color[i].v <= volE)
				){
					color[i].h += hueCH;
					if(color[i].h < 0){
						color[i].h += 360;
					}else if(color[i].h > 360){
						color[i].h -= 360;
					}
				}
			}
		break;
		// // 抽出領域の彩度を変換
		// case 'extractS':
		// 	for(var i=0; i<color.length; i++){
		// 		if(
		// 			(color[i].h >= hueS) & (color[i].h <= hueE) &
		// 			(color[i].s >= satS) & (color[i].s <= satE) &
		// 			(color[i].v >= volS) & (color[i].v <= volE)
		// 		){
		// 			color[i].s += hueS;
		// 			if(color[i].s < 0){
		// 				color[i].s = 0;
		// 			}else if(color[i].s > 255){
		// 				color[i].s = 255;
		// 			}
		// 		}
		// 	}
		// break;
		// // 抽出領域の明度を変換
		// case 'extractV':
		// 	for(var i=0; i<color.length; i++){
		// 		if(
		// 			(color[i].h >= hueS) & (color[i].h <= hueE) &
		// 			(color[i].s >= satS) & (color[i].s <= satE) &
		// 			(color[i].v >= volS) & (color[i].v <= volE)
		// 		){
		// 			color[i].v += hueCV;
		// 			if(color[i].v < 0){
		// 				color[i].v = 0;
		// 			}else if(color[i].v > 255){
		// 				color[i].v = 255;
		// 			}
		// 		}
		// 	}
		// break;
	}
	// RGBへ戻す
	color = CV.HSV2RGB(color);
	// 変換処理
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			outputData[i + 0] = color[Math.floor(i/4)].r;
			outputData[i + 1] = color[Math.floor(i/4)].g;
			outputData[i + 2] = color[Math.floor(i/4)].b;
			outputData[i + 3] = inputData[i + 3];
		}
	}
	CV.copy();
}

////////////
// RGB抽出 //
////////////
CV.rgb = function(mode){
	CV.resize();
	if(mode == "R"){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				outputData[i] = 255;
				outputData[i+1] = inputData[i+1];
				outputData[i+2] = inputData[i+2];
				outputData[i+3] = inputData[i+3];
			}
		}
	}
	else if(mode == "G"){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				outputData[i] = inputData[i];
				outputData[i+1] = 255;
				outputData[i+2] = inputData[i+2];
				outputData[i+3] = inputData[i+3];
			}
		}
	}
	else if(mode == "B"){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = (y*w + x)*4;
				outputData[i] = inputData[i];
				outputData[i+1] = inputData[i+1];
				outputData[i+2] = 255;
				outputData[i+3] = inputData[i+3];
			}
		}
	}
	CV.copy();
}

/////////////
// 色調変換 //
/////////////

// ネガポジ反転
CV.negaposi = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			outputData[i] = 255 - inputData[i];
			outputData[i+1] = 255 - inputData[i+1];
			outputData[i+2] = 255 - inputData[i+2];
			outputData[i+3] = inputData[i+3];
		}
	}
	CV.copy();
}

// グレースケール
CV.gray = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// グレースケールの定数
			var gray = 
				+ 0.299 * inputData[i]
				+ 0.587 * inputData[i + 1]
				+ 0.114 * inputData[i + 2];
			outputData[i + 0] = gray;
			outputData[i + 1] = gray;
			outputData[i + 2] = gray;
			outputData[i + 3] = inputData[i + 3];
		}
	}
	CV.copy();
}

// セピア調
CV.sepia = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// グレースケールの定数
			var gray = 
				+ 0.299 * inputData[i]
				+ 0.587 * inputData[i + 1]
				+ 0.114 * inputData[i + 2];
			outputData[i + 0] = gray / 255 * 240;
			outputData[i + 1] = gray / 255 * 200;
			outputData[i + 2] = gray / 255 * 140;
			outputData[i + 3] = inputData[i + 3];
		}
	}
	CV.copy();
}

// 二値化
CV.binary = function(){
	CV.resize();
	var threshold = document.getElementById('threshold').value;
	var bin = [];
	// LUT作成
	for(var i=0; i<threshold; i++){
		bin[i] = 0;
	}
	for(var i=threshold; i<256; i++){
		bin[i] = 255;
	}
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// グレースケールの定数
			var gray = Math.round(
				+ 0.299 * inputData[i]
				+ 0.587 * inputData[i + 1]
				+ 0.114 * inputData[i + 2]
			);
			outputData[i + 0] = bin[gray];
			outputData[i + 1] = bin[gray];
			outputData[i + 2] = bin[gray];
			outputData[i + 3] = inputData[i + 3];
		}
	}
	CV.copy();
}

/////////////
// エッジ検出 //
/////////////

// エッジ検出（8近傍ラプラシアン）
CV.edge = function(){
	CV.sobel(8);
}

// エッジ検出（4近傍ラプラシアン）
CV.edge2 = function(){
	CV.sobel(4);
}

// ソーベル（兼ラプラシアン）
CV.sobel = function(opt){
	CV.resize();
	var course;
	if(opt == 4){
		// 4近傍ラプラシアン
		course = 0;
	}else if(opt == 8){
		// 8近傍ラプラシアン
		course = 5;
	}else{
		// 始動方向はテンキーの数字の位置に対応
		course = parseInt(document.getElementById('course').value);
	}
	switch(course){
		case 0: var S = [0, 1, 0, 1, -4, 1, 0, 1, 0];break;	// 4近傍
		case 1: var S = [0, -1, -2, 1, 0, -1, 2, 1, 0];break;
		case 2: var S = [-1, -2, -1, 0, 0, 0, 1, 2, 1];break;
		case 3: var S = [-2, -1, 0, -1, 0, 1, 0, 1, 2];break;
		case 4: var S = [1, 0, -1, 2, 0, -2, 1, 0, -1];break;
		case 5: var S = [1, 1, 1, 1, -8, 1, 1, 1, 1];break;	// 8近傍
		case 6: var S = [-1, 0, 1, -2, 0, 2, -1, 0, 1];break;
		case 7: var S = [2, 1, 0, 1, 0, -1, 0, -1, -2];break;
		case 8: var S = [1, 2, 1, 0, 0, 0, -1, -2, -1];break;
		case 9: var S = [0, 1, 2, -1, 0, 1, -2, -1, 0];break;
	}
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				outputData[i] = 
					S[0]*inputData[i - w*4 - 4] + S[1]*inputData[i - w*4] + S[2]*inputData[i - w*4 + 4] +
					S[3]*inputData[i - 4] + S[4]*inputData[i] + S[5]*inputData[i + 4] +
					S[6]*inputData[i + w*4 - 4] + S[7]*inputData[i + w*4] + S[8]*inputData[i + w*4 + 4];
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

//////////
// ぼかし //
//////////

// ランダム入れ替え(NxN)
CV.shuffle = function(N){
	CV.resize();
	var size = Math.pow(N, 2);
	// 位置を入れ替えるための配列
	var number = [];
	for(var i=0; i<size; i++){
		number[i] = []
	}
	// 配列の要素をランダムに入れ替える
	Array.prototype.shuffle = function() {
		var i = this.length;
		while(i){
			var j = Math.floor(Math.random()*i);
			var t = this[--i];
			this[i] = this[j];
			this[j] = t;
		}
		return this;
	}
	var offset = (N-1)/2;
	for (var y = offset; y < h-offset; y++) {
		for (var x = offset; x < w-offset; x++) {
			// カーネル内の画素ごとのRGBを格納
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				var k = 0;
				for(var dy=0; dy<N; dy++){
					for(var dx=0; dx<N; dx++){
						var horizon = w*(-(N-1)/2*4 + 4*dx);
						var vertical = -(N-1)/2*4 + 4*dy;
						number[k][c] = inputData[i + horizon + vertical];
						k++;
					}
				}
			}
			number.shuffle();
			// ランダムに入れ替えた画素を代入
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				var k = 0;
				for(var dy=0; dy<N; dy++){
					for(var dx=0; dx<N; dx++){
						outputData[i + w*dx*4 + dy*4] = number[k][c];
						k++;
					}
				}
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

// メディアン
CV.median = function(){
	CV.resize();
	// 中央値を求めるための配列
	var number = [];
	// クイックセレクト（k番目の値だけ正しくなるソート）
	// 中央値（左から5番目）が欲しいだけなので、すべてソートする必要は無い
	Array.prototype.quickselect = function(k, l, r) {
		var v, i, j, t;
		var l = l || 0;	// 開始位置
		var r = r || this.length - 1;	// 終了位置
		if (r > l) {
			v = this[r]; i = l-1; j = r;
			for (;;) {
				while(this[++i] < v);
				while(this[--j] > v);
				if(i >= j)
					break;
				t = this[i]; this[i] = this[j]; this[j] = t;
			}
			t = this[i]; this[i] = this[r]; this[r] = t;
			if (i > l+k-1)
				this.quickselect(k, l, i-1);
			if (i < l+k-1)
				this.quickselect(k-i, i+1, r);
		}
		return this;
	}
	// メディアンフィルタの処理
	for (var y = 1; y < h-1; y++) {
		for (var x = 1; x < w-1; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				// 3x3のデータを格納（この入れ方が一番速かった）
				number[0] = inputData[i - w*4 - 4];
				number[1] = inputData[i - w*4];
				number[2] = inputData[i - w*4 + 4];
				number[3] = inputData[i - 4];
				number[4] = inputData[i];
				number[5] = inputData[i + 4];
				number[6] = inputData[i + w*4 - 4];
				number[7] = inputData[i + w*4];
				number[8] = inputData[i + w*4 + 4];
				// デフォルトのソート（たぶんクイックソート）
				// number.sort(
				// 	function(a,b){
				// 		if( a < b ) return -1;
				// 		if( a > b ) return 1;
				// 		return 0;
				// 	}
				// );
				// クイックセレクト版
				number.quickselect(5);
				// 中央値を代入
				outputData[i] = number[4];
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

// 平滑化(NxN)
CV.smoothing = function(N){
	N = N || 5;
	CV.resize();
	var smooth = Math.pow(N, -2);
	// 全画素ループ
	var offset = (N-1)/2;
	for (var y = offset; y < h-offset; y++) {
		for (var x = offset; x < w-offset; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				var sum = 0;
				// カーネル全ループ
				for(var dy=0; dy<N; dy++){
					for(var dx=0; dx<N; dx++){
						var horizon = w*(-(N-1)/2*4 + 4*dx);
						var vertical = -(N-1)/2*4 + 4*dy;
						// 輝度値計算
						sum += smooth * inputData[i + horizon +  vertical];
					}
				}
				outputData[i] = Math.round(sum);
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

// 先鋭化(3x3)
CV.sharp = function(){
	CV.resize();
	var k = document.getElementById('sharpValue').value;
	for (var y = 1; y < h-1; y++) {
		for (var x = 1; x < w-1; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				outputData[i] = 
					-k/9*inputData[i - w*4 - 4] - k/9*inputData[i - w*4] - k/9*inputData[i - w*4 + 4]
					-k/9*inputData[i - 4] + (1+8*k/9)*inputData[i] - k/9*inputData[i + 4]
					-k/9*inputData[i + w*4 - 4] - k/9*inputData[i + w*4] - k/9*inputData[i + w*4 + 4];
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

// ガウシアン(3x3)
// NxNは二項定理が必要で重くなりそうだから作らない
CV.gaussian = function(){
	CV.resize();
	for (var y = 1; y < h-1; y++) {
		for (var x = 1; x < w-1; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				outputData[i] = 
					1/16*inputData[i - w*4 - 4] + 2/16*inputData[i - w*4] + 1/16*inputData[i - w*4 + 4] +
					2/16*inputData[i - 4] + 4/16*inputData[i] + 2/16*inputData[i + 4] +
					1/16*inputData[i + w*4 - 4] + 2/16*inputData[i + w*4] + 1/16*inputData[i + w*4 + 4];
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

// ガウシアン(5x5)
CV.gaussian2 = function(){
	CV.resize();
	for (var y = 2; y < h-2; y++) {
		for (var x = 2; x < w-2; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				outputData[i] = 
					1/256*inputData[i - w*8 - 8] + 
					4/256*inputData[i - w*8 - 4] + 
					6/256*inputData[i - w*8] + 
					4/256*inputData[i - w*8 + 4] +
					1/256*inputData[i - w*8 + 8] +

					4/256*inputData[i - w*4 - 8] + 
					16/256*inputData[i - w*4 - 4] + 
					24/256*inputData[i - w*4] + 
					16/256*inputData[i - w*4 + 4] +
					4/256*inputData[i - w*4 + 8] +

					6/256*inputData[i - 8] + 
					24/256*inputData[i - 4] + 
					36/256*inputData[i] + 
					24/256*inputData[i + 4] +
					6/256*inputData[i + 8] +

					4/256*inputData[i + w*4 - 8] + 
					16/256*inputData[i + w*4 - 4] + 
					24/256*inputData[i + w*4] + 
					16/256*inputData[i + w*4 + 4] +
					4/256*inputData[i + w*4 + 8] +

					1/256*inputData[i + w*8 - 8] + 
					4/256*inputData[i + w*8 - 4] + 
					6/256*inputData[i + w*8] + 
					4/256*inputData[i + w*8 + 4] +
					1/256*inputData[i + w*8 + 8];
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

// モザイク(NxN)
CV.pixelization = function(N){
	N = N || 5;
	CV.resize();
	var offset = (N-1)/2;
	var count, r, g, b;
	// 全画素ループ
	for (var y = offset; y < h; y+=N) {
		for (var x = offset; x < w; x+=N) {
			var i = (y*w + x)*4;
			count = r = g = b = 0;
			// 入力用カーネル全ループ
			for(var dy=0; dy<N; dy++){
				for(var dx=0; dx<N; dx++){
					var horizon = -(N-1)/2*4 + 4*dx;
					var vertical = -(N-1)/2*4 + 4*dy;
					// 画像の範囲外は無視する
					if(
						((x + horizon) < 0) ||
						(w <= (x + horizon)) ||
						((y + vertical) < 0) ||
						(h <= (y + vertical))
					){
						continue;
					}
					// 輝度値の合計を取得
					r += inputData[i + w*horizon + vertical + 0];
					g += inputData[i + w*horizon + vertical + 1];
					b += inputData[i + w*horizon + vertical + 2];
					// 取得した画素の個数
					count++;
				}
			}
			// 平均輝度値を計算
			r = Math.round(r/count);
			g = Math.round(g/count);
			b = Math.round(b/count);
			// 出力用カーネル全ループ
			for(var dy=0; dy<N; dy++){
				for(var dx=0; dx<N; dx++){
					var horizon = -(N-1)/2*4 + 4*dx;
					var vertical = -(N-1)/2*4 + 4*dy;
					// 輝度値代入
					outputData[i + w*horizon + vertical + 0] = r;
					outputData[i + w*horizon + vertical + 1] = g;
					outputData[i + w*horizon + vertical + 2] = b;
				}
			}
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

// ブラー(NxN)
CV.blur = function(N, course){
	N = N || 5;
	course = course || "tiltL";
	CV.resize();
	var count, r, g, b, H, V;
	if(course == "vertical")
		H = 0;
	else if(course == "tiltR")
		H = -1;
	else if(course == "tiltL")
		H = 1;
	// 全画素ループ
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			count = r = g = b = 0;
			// 入力用カーネル全ループ
			for(var dx=0; dx<N; dx++){
				if(course == "horizon"){
					var vertical = -(N-1)/2*4 + 4*dx;
					var horizon = 0;
				}else{
					var horizon = -(N-1)/2*4 + 4*dx;
					var vertical = H * horizon;
				}
				// 画像の範囲外は無視する
				if(
					((x + horizon) < 0) ||
					(w <= (x + horizon)) ||
					((y + vertical) < 0) ||
					(h <= (y + vertical))
				){
					continue;
				}
				// 輝度値の合計を取得
				r += inputData[i + w*horizon + vertical + 0];
				g += inputData[i + w*horizon + vertical + 1];
				b += inputData[i + w*horizon + vertical + 2];
				// 取得した画素の個数
				count++;
			}
			// 平均輝度値を計算
			r = Math.round(r/count);
			g = Math.round(g/count);
			b = Math.round(b/count);
			// 輝度値代入
			outputData[i + 0] = r;
			outputData[i + 1] = g;
			outputData[i + 2] = b;
			outputData[(y*w + x)*4 + 3] = inputData[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy();
}

/////////////
// 明度補正 //
/////////////

// 明暗
CV.bright = function(){
	CV.resize();
	var rate = document.getElementById('brightValue').value / 100;
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			var j = parseInt(rate);
			outputData[i + 0] = rate * inputData[i + 0];
			outputData[i + 1] = rate * inputData[i + 1];
			outputData[i + 2] = rate * inputData[i + 2];
			outputData[i + 3] = inputData[i + 3];
		}
	}
	CV.copy();
}

// ガンマ補正（凄く遅い）
CV.gamma = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// ガンマ値
			var gamma = document.getElementById("gammaValue").value;
			outputData[i + 0] = 255 * Math.pow((inputData[i + 0]/255), 1.0/gamma);
			outputData[i + 1] = 255 * Math.pow((inputData[i + 1]/255), 1.0/gamma);
			outputData[i + 2] = 255 * Math.pow((inputData[i + 2]/255), 1.0/gamma);
			outputData[i + 3] = inputData[i + 3];
		}
	}
	CV.copy();
}

// ガンマ補正（LUT使用版）
CV.gammaLUT = function(){
	CV.resize();
	// ガンマ値のLUT作成
	var gamma = document.getElementById("gammaValue").value;
	var LUT = [256];
	for(var i=0; i<256; i++){
		LUT[i] = Math.round(Math.pow((i/255), 1/gamma)*255);
	}
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			outputData[i + 0] = LUT[inputData[i]];
			outputData[i + 1] = LUT[inputData[i + 1]];
			outputData[i + 2] = LUT[inputData[i + 2]];
			outputData[i + 3] = inputData[i + 3];
		}
	}
	CV.copy();
}

/////////////
// 透過処理 //
/////////////

// 透過
CV.transparent = function(){
	CV.resize();
	var opacity = document.getElementById('opacity').value;
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// グレースケールの定数
			var gray = 
				+ 0.299 * inputData[i]
				+ 0.587 * inputData[i + 1]
				+ 0.114 * inputData[i + 2];
			outputData[i + 0] = inputData[i + 0];
			outputData[i + 1] = inputData[i + 1];
			outputData[i + 2] = inputData[i + 2];
			// 一定輝度以上のピクセルを透過
			if(gray >= opacity){
				outputData[i + 3] = 0;
			}
		}
	}
	CV.copy();
}

/////////////
// 幾何変換 //
/////////////

// 水平反転
CV.hmirror = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			var j = (y*w + (w - x - 1))*4;
			outputData[i + 0] = inputData[j + 0];
			outputData[i + 1] = inputData[j + 1];
			outputData[i + 2] = inputData[j + 2];
			outputData[i + 3] = inputData[j + 3];
		}
	}
	CV.copy();
}

// 垂直反転
CV.vmirror = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			var j = ((h - y -1)*w + x)*4;
			outputData[i + 0] = inputData[j + 0];
			outputData[i + 1] = inputData[j + 1];
			outputData[i + 2] = inputData[j + 2];
			outputData[i + 3] = inputData[j + 3];
		}
	}
	CV.copy();
}

// 拡縮（未完成）
CV.small = function(){
	CV.resize();
	var rate = document.getElementById('rate').value / 100;
	// var h = [rate, 0, 0, 0, rate, 0, 0, 0, 1];
	// CV.affine(h)
	this.context.scale(rate, rate);
	this.context.drawImage(image, 0, 0);
	var temp = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {	
			var i = (y*w + x)*4;
			outputData[i + 0] = temp.data[i + 0];
			outputData[i + 1] = temp.data[i + 1];
			outputData[i + 2] = temp.data[i + 2];
			outputData[i + 3] = temp.data[i + 3];
		}
	}
	CV.copy();
}

// 回転（未完成）
CV.rotation = function(){
	CV.resize();
	var itheta = document.getElementById('theta').value;
	var theta = itheta * Math.PI/180;
	var sin = Math.sin(theta);
	var cos = Math.cos(theta);
	// var h = [cos, sin, 0, -sin, cos, 0, 0, 0, 1];
	// CV.affine(h)
	this.context.translate(w/2, h/2);
	this.context.rotate(theta);
	this.context.translate(-w/2, -h/2);
	this.context.drawImage(image, 0, 0, w, h);
	var temp = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {	
			var i = (y*w + x)*4;
			outputData[i + 0] = temp.data[i + 0];
			outputData[i + 1] = temp.data[i + 1];
			outputData[i + 2] = temp.data[i + 2];
			if(!temp.data[i + 3]){
				outputData[i + 0] = 255;
				outputData[i + 1] = 255;
				outputData[i + 2] = 255;
				outputData[i + 3] = 255;
			}
		}
	}
	CV.copy();
}

// アフィン変換
CV.affine = function(H, tx, ty){
	// 平行移動用
	var tx = tx || 0;
	var ty = ty || 0;
	// 変換行列
	var affine_mat = [
		[H[0], H[1], H[2]],
		[H[3], H[4], H[5]],
		[H[6], H[7], H[8]]
	];
	// 変換後の座標に変換前の座標を対応させるため、逆行列にする
	mat.inverse(affine_mat, affine_mat);
	// 平行移動用変換行列
	var trans_mat = [
		[1, 0, tx],
		[0, 1, ty],
		[0, 0, 1]
	];
	// 途中計算用
	var tmp = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
	];
	// 一旦原点に移動するための行列
	var offset_before = [
		[1, 0, image.width/2],
		[0, 1, image.height/2],
		[0, 0, 1]
	];
	// 元に戻すための行列
	var offset_after = [
		[1, 0, -image.width/2],
		[0, 1, -image.height/2],
		[0, 0, 1]
	];
	// 変換前の座標の各RGBAを入れておく行列
	var p = [
		[0],
		[0],
		[1]
	];
	// 変換後の座標の各RGBAを入れておく行列
	var P = [
		[0],
		[0],
		[1]
	];
	CV.resize();
	// 原点へ移動
	mat.multiply2(offset_before, affine_mat, tmp);
	// 元の位置へ戻す
	mat.multiply2(tmp, offset_after, affine_mat);
	// 平行移動
	mat.multiply2(affine_mat, trans_mat, tmp);
	// p[0][0]はx座標, p[1][0]はy座標
	for (p[1][0] = 0; p[1][0] < h-1; p[1][0]++) {
		for (p[0][0] = 0; p[0][0] < w-1; p[0][0]++) {
			// アフィン変換
			mat.multiply1(tmp, p, P);
			var i = (p[1][0]*w + p[0][0])*4;
			var j = (P[1][0]*w + P[0][0])*4;
			outputData[i + 0] = inputData[j + 0];
			outputData[i + 1] = inputData[j + 1];
			outputData[i + 2] = inputData[j + 2];
			outputData[i + 3] = inputData[j + 3];
		}
	}
	CV.copy();
}

// 画像保存
// 参考にしました → http://jsdo.it/Yukisuke/p311
CV.save = function(){
	var canvas;
	if(!document.getElementById("change").checked){
		canvas = document.getElementById("outputImg");
	}else{
		canvas = document.getElementById("img");
	}
	var base64 = canvas.toDataURL();	// firefoxならtoblobで直接blobにして保存できます。
    var blob = Base64toBlob(base64);
    var name = "js_" + info.name　+ ".png";
    saveBlob(blob, name);

    function Base64toBlob(_base64){
		var i;
		var tmp = _base64.split(',');
		var data = atob(tmp[1]);
		var mime = tmp[0].split(':')[1].split(';')[0];

		//var buff = new ArrayBuffer(data.length);
		//var arr = new Uint8Array(buff);
		var arr = new Uint8Array(data.length);
		for (i = 0; i < data.length; i++) {arr[i] = data.charCodeAt(i);}
		var blob = new Blob([arr], { type: mime });
		return blob;
	}
	function saveBlob(_blob,_file){
		if( /*@cc_on ! @*/ false ){	// IEの場合
			window.navigator.msSaveBlob(_blob, _file);
		}else{
			var url = (window.URL || window.webkitURL);
			var data = url.createObjectURL(_blob);
			var e = document.createEvent("MouseEvents");
			e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
			a.href = data;
			a.download = _file;   
			a.dispatchEvent(e);
		}
	}
}

/**********************
** 画像読み込み関連のメソッド
***********************/

// 画像を読み込み
function loadImg(){
	if (document.getElementById('loadImg').files[0].type.match('image.*')) {
		var img = document.getElementById('loadImg').files[0];
		// ファイル名と拡張子を別々に取得
		var name = img.name.match(/([^:\\\*?\"<>\|]+)\.+([^:\\\*?\"<>\|]+)$/);
		info = {name:name[1], type:name[2], size:img.size};
		var property = "NAME『" + img.name + 
			"』, SIZE『" + img.size + "byte (" + (img.size/1024).toFixed(0) + "KB)』";
		document.getElementById('list').innerHTML = property;
		var fr = new FileReader();
		// 読み込み終了を待つ
		fr.onload = function onFileLoad(e) {
			setImage(e.target.result);
		 	CV.init();
		}
		fr.readAsDataURL(img);
	}else{
		alert("画像ファイルを指定して下さい");
	}
}

// ドラッグ＆ドロップで読み込み
function onDropFile(e){
	e.preventDefault();
	var img = e.dataTransfer.files[0];
	// ファイル名と拡張子を別々に取得
	var name = img.name.match(/([^:\\\*?\"<>\|]+)\.+([^:\\\*?\"<>\|]+)$/);
	info = {name:name[1], type:name[2], size:img.size};
	var property = "NAME『" + img.name + 
		"』, SIZE『" + img.size + "byte (" + (img.size/1024).toFixed(0) + "KB)』";
	document.getElementById('list').innerHTML = property;
	if (img.type.match('image.*')) {
		var fr = new FileReader();
		// 読み込み終了を待つ
		fr.onload = function onFileLoad(e) {
			setImage(e.target.result);
		 	CV.init();
		}
		fr.readAsDataURL(img);
	}else{
		alert("画像ファイルを指定して下さい");
	}
}

 // デフォルト処理をキャンセル
function　onCancel(e){
	if(e.preventDefault){
		e.preventDefault();
	}
	return false;
};

/*****************
** アフィン変換用メソッド
******************/

var mat = function (){};
// 単位行列化
mat.identity = function(dst){
	dst[0][0] = 1; dst[0][1] = 0; dst[0][2] = 0;
	dst[1][0] = 0; dst[1][1] = 1; dst[1][2] = 0;
	dst[2][0] = 0; dst[2][1] = 0; dst[2][2] = 1;
	return dst;
};
// 3×3と1×3の掛け算（整数で返す）
mat.multiply1 = function(mat1, mat2, dst){
	var a = mat1[0][0], b = mat1[0][1], c = mat1[0][2],
		d = mat1[1][0], e = mat1[1][1], f = mat1[1][2],
		g = mat1[2][0], h = mat1[2][1], i = mat1[2][2],
		A = mat2[0][0],
		B = mat2[1][0],
		C = mat2[2][0];
	dst[0][0] = parseInt(a * A + b * B + c * C);
	dst[1][0] = parseInt(d * A + e * B + f * C);
	dst[2][0] = parseInt(g * A + h * B + i * C);
	return dst;
};
// 3×3と3×3の掛け算
mat.multiply2 = function(mat1, mat2, dst){
	var A = mat1[0][0], B = mat1[0][1], C = mat1[0][2],
		D = mat1[1][0], E = mat1[1][1], F = mat1[1][2],
		G = mat1[2][0], H = mat1[2][1], I = mat1[2][2],
		a = mat2[0][0], b = mat2[0][1], c = mat2[0][2],
		d = mat2[1][0], e = mat2[1][1], f = mat2[1][2],
		g = mat2[2][0], h = mat2[2][1], i = mat2[2][2];
	dst[0][0] = (A * a + B * d + C * g).toFixed(4);
	dst[0][1] = (A * b + B * e + C * h).toFixed(4);
	dst[0][2] = (A * c + B * f + C * i).toFixed(4);
	dst[1][0] = (D * a + E * d + F * g).toFixed(4);
	dst[1][1] = (D * b + E * e + F * h).toFixed(4);
	dst[1][2] = (D * c + E * f + F * i).toFixed(4);
	dst[2][0] = (G * a + H * d + I * g).toFixed(4);
	dst[2][1] = (G * b + H * e + I * h).toFixed(4);
	dst[2][2] = (G * c + H * f + I * i).toFixed(4);
	return dst;
};
// 逆行列
mat.inverse = function(mat, dst){
	var a = mat[0][0],  b = mat[0][1],  c = mat[0][2],
		d = mat[1][0],  e = mat[1][1],  f = mat[1][2],
		g = mat[2][0],  h = mat[2][1],  i = mat[2][2];
		s = a * e * i + g * b * f + h * d * c;
		t = c * e * g + d * b * i + a * f * h;
		det = s - t;
		idet = 1.0 / det;
	dst[0][0] = ((e　*　i - f　*　h) * idet).toFixed(4);
	dst[0][1] = ((c　*　h - b　*　i) * idet).toFixed(4);
	dst[0][2] = ((b　*　f - c　*　h) * idet).toFixed(4);
	dst[1][0] = ((f　*　g - d　*　i) * idet).toFixed(4);
	dst[1][1] = ((a　*　i - c　*　g) * idet).toFixed(4);
	dst[1][2] = ((c　*　d - a　*　f) * idet).toFixed(4);
	dst[2][0] = ((d　*　h - e　*　g) * idet).toFixed(4);
	dst[2][1] = ((b　*　g - a　*　h) * idet).toFixed(4);
	dst[2][2] = ((a　*　e - b　*　d) * idet).toFixed(4);
	return dst;
};

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
** マウスクリック移動時のイベント
*/
document.addEventListener('mousemove', function(e) {
	// 座標を取得＆オフセット補正
	var mouseX = e.clientX - getElementPosition(outputImg).left + getElementPosition(outputImg).scrollLeft;
	var mouseY = e.clientY - getElementPosition(outputImg).top + getElementPosition(outputImg).scrollTop;

	var coodinate = [mouseX, mouseY];
	var color = {r:0, g:0, b:0, a:0, h:0, s:0, v:0};
	var rgba = [];
	var hsv = [];
	var info = "";
	/* ここからイベント実装 */
	if(mouseX >=0 & mouseX < w & mouseY >=0 & mouseY < h){
		var i = (mouseY*w + mouseX)*4;
		color.r = outputData[i+0];
		color.g = outputData[i+1];
		color.b = outputData[i+2];
		color.a = outputData[i+3];
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

/*
** マウスクリック時のイベント（正確には離した時））
*/
document.addEventListener('click', function(e) {
	// 座標を取得＆オフセット補正
	var mouseX = e.clientX - getElementPosition(outputImg).left + getElementPosition(outputImg).scrollLeft;
	var mouseY = e.clientY - getElementPosition(outputImg).top + getElementPosition(outputImg).scrollTop;

	var coodinate = [mouseX, mouseY];
	var color = {r:0, g:0, b:0, a:0, h:0, s:0, v:0};
	var rgba = [];
	var hsv = [];
	var info = "";
	/* ここからイベント実装 */
	if(mouseX >=0 & mouseX < w & mouseY >=0 & mouseY < h){
		var i = (mouseY*w + mouseX)*4;
		color.r = outputData[i+0];
		color.g = outputData[i+1];
		color.b = outputData[i+2];
		color.a = outputData[i+3];
		rgba[0] = color.r;
		rgba[1] = color.g;
		rgba[2] = color.b;
		rgba[3] = color.a;
		rgb2hsv(color);
		hsv[0] = parseInt(color.h);
		hsv[1] = parseInt(color.s);
		hsv[2] = parseInt(color.v);
		document.getElementById('hueStart').value = hsv[0] - 20;
		document.getElementById('hueEnd').value = hsv[0] + 20;
		if(hsv[1] > 40)
			document.getElementById('satStart').value = hsv[1] - 40;
		else
			document.getElementById('satStart').value = 0;
		if(hsv[1] < 215)
			document.getElementById('satEnd').value = hsv[1] + 40;
		else
			document.getElementById('satEnd').value = 255;
		if(hsv[2] > 40)
			document.getElementById('volStart').value = hsv[2] - 40;
		else
			document.getElementById('volStart').value = 0;
		if(hsv[2] < 215)
			document.getElementById('volEnd').value = hsv[2] + 40;
		else
			document.getElementById('volEnd').value = 255;
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

// メニュー表示
var menu = function(divID){
	var div = document.getElementById(divID);
	div.style.display = div.style.display == 'none' ? 'block' : 'none';
}
menu.all = function(){
	var count = 0;
	var div = [];
	div[0] = document.getElementById('siki');
	div[1] = document.getElementById('edge');
	div[2] = document.getElementById('pix');
	div[3] = document.getElementById('hsv');
	div[4] = document.getElementById('kido');
	div[5] = document.getElementById('kika');
	div[6] = document.getElementById('histgram');
	var button = [];
	button[0] = document.getElementById('Msiki');
	button[1] = document.getElementById('Medge');
	button[2] = document.getElementById('Mpix');
	button[3] = document.getElementById('Mhsv');
	button[4] = document.getElementById('Mkido');
	button[5] = document.getElementById('Mkika');
	button[6] = document.getElementById('Mhistgram');

	// noneの個数数える
	for(var i=0; i<div.length; i++){
		if(div[i].style.display == 'none'){
			count++;
		}
	}
	// noneが一つでもあったら全部block、そうでなければ全部noneにする
	if(count > 0){
		for(var i=0; i<div.length; i++){
			div[i].style.display = 'block';
			button[i].checked = true;
		}
	}else{
		for(var i=0; i<div.length; i++){
			div[i].style.display = 'none';
			button[i].checked = false;
		}
	}
	document.getElementById('histgram').height = document.getElementById('cont').height;
}

window.addEventListener('load', function (){
	// ドラッグ＆ドロップに対応
	document.getElementById('img').addEventListener("dragover", onCancel, false);
	document.getElementById('img').addEventListener("dragenter", onCancel, false);
	document.getElementById('img').addEventListener("drop", onDropFile, false);
	document.getElementById('outputImg').addEventListener("dragover", onCancel, false);
	document.getElementById('outputImg').addEventListener("dragenter", onCancel, false);
	document.getElementById('outputImg').addEventListener("drop", onDropFile, false);

	// デフォルト画像
	setImage("HSV_cone.jpg");

	// 各デフォルト値
	document.getElementById('threshold').value = 190;
	document.getElementById('course').value = 8;
	document.getElementById('sharpValue').value = 1;
	document.getElementById("gammaValue").value = 1.5;
	document.getElementById('rate').value = 75;
	document.getElementById('brightValue').value = 150;
	document.getElementById('opacity').value = 245;
	document.getElementById('theta').value = 45;

	// HSV
	document.getElementById('hueValue').value = 45;
	document.getElementById('satValue').value = 20;
	document.getElementById('volValue').value = 20;

	// 色抽出用
	document.getElementById('hueStart').value = 80;
	document.getElementById('hueEnd').value = 180;
	document.getElementById('satStart').value = 100;
	document.getElementById('satEnd').value = 255;
	document.getElementById('volStart').value = 80;
	document.getElementById('volEnd').value = 255;
	document.getElementById('convHValue').value = 45;
	// document.getElementById('convSValue').value = 20;
	// document.getElementById('convVValue').value = 20;

	document.getElementById("change").checked = false;
	document.getElementById("resize").checked = true;
	document.getElementById("copy").checked = true;

	// メニュー用
	document.getElementById("Msiki").checked = true;
	document.getElementById("Medge").checked = false;
	document.getElementById("Mpix").checked = true;
	document.getElementById("Mhsv").checked = true;
	document.getElementById("Mkido").checked = true;
	document.getElementById("Mkika").checked = false;
	document.getElementById("Mhistgram").checked = false;
}, false);
