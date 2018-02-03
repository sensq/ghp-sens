// グラフ作成用ライブラリ
document.write('<script type="text/javascript" src="raphael-min.js"></script>');
document.write('<script type="text/javascript" src="g.raphael-min.js"></script>');
document.write('<script type="text/javascript" src="g.line-min.js"></script>');

// オブジェクト作成
CV = function(){};
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

/***************
** 具体的なメソッド
****************/

/////////////////
// 基本的なメソッド //
/////////////////

// 作成
// CV.create = function(canvas, context){
	// CV.canvas = document.getElementById("outputImg");
	// CV.context = CV.canvas.getContext('2d');
// }

// 描画領域リサイズ
CV.resize = function(){
	if(!document.getElementById("invisible").checked){
		CV.canvas = document.getElementById("outputImg");
		CV.context = CV.canvas.getContext('2d');
		CV.canvas.width = output.width;
		CV.canvas.height = output.height;
	}else{
		CV.canvas = document.getElementById("img");
		CV.context = CV.canvas.getContext('2d');
		CV.canvas.width = output.width;
		CV.canvas.height = output.height;
	}
}

// 初期化
CV.init = function(){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 4; c++) {
				var i = (y*w + x)*4 + c;
				input.data[i] = initialize.data[i];
				output.data[i] = initialize.data[i];
			}
		}
	}
	CV.context.putImage.data(initialize, 0, 0);
}

// 重ね掛け用のコピー
CV.copy = function(input, output){
	var history = CV.history;
	CV.resize();
	var temp = CV.context.getImage.data(0, 0, CV.canvas.width, CV.canvas.height);
	history.push(temp);
	if(document.getElementById('copy').checked){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				for (var c = 0; c < 4; c++) {
					var i = (y*w + x)*4 + c;
					input.data[i] = output.data[i];
					history[history.length-1].data[i] = output.data[i]; 
				}
			}
		}
	}
	CV.context.putImage.data(output, 0, 0);
}

// 戻る
CV.undo = function(input, output){
	var history = CV.history;
	// resizeだとダメ
	if(!document.getElementById("invisible").checked){
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
	if(pre >= 0){
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				for (var c = 0; c < 4; c++) {
					var i = (y*w + x)*4 + c;
					input.data[i] = history[pre].data[i];
					output.data[i] = history[pre].data[i];
				}
			}
		}
		history.pop();
	}
	context.putImage.data(output, 0, 0);
}

// 入れ替え
CV.invisible = function(){
	CV.resize();
	CV.context.restore();
	CV.context.putImage.data(output, 0, 0);
}

// ヒストグラム
CV.hist = function(input, output){
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
			output.data[i + 0] = input.data[i + 0];
			output.data[i + 1] = input.data[i + 1];
			output.data[i + 2] = input.data[i + 2];
			output.data[i + 3] = input.data[i + 3];
			hist.r[ input.data[i + 0] ]++;
			hist.g[ input.data[i + 1] ]++;
			hist.b[ input.data[i + 2] ]++;
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
	CV.copy(input, output);
	// グラフを描画
	(function(){
		// 前回のグラフを消去
		document.getElementById('histgram').innerHTML = "";
		document.getElementById('histgram').style.backgroundColor = "#aaccff";
		var r = Raphael("histgram", 360, 235);
		var txtattr = { font: "15px sans-serif" };
		r.text(150, 10, "Color Histgram").attr(txtattr);
		r.text(20, 10, "[%]").attr(txtattr);
		r.text(330, 150, "輝度").attr(txtattr);

		var x = [];
		for(var i=0; i<261; i++){
			x[i] = i;
		}
		// 原点（左上）, width, height, xValue[], yValue[], opts
		var lines = r.linechart(10, 10, 300, 145, 
			// 横
			[x],
			// 縦
			[hist.r, hist.g, hist.b],
			// オプション
			{
				nostroke: false,	// falseで点を繋ぐ
				axis: "0 0 1 1",	// 上, 右, 下, 左軸を表示
				axisxstep: 13,	// x軸の分割数（ラベル間隔に相当）
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
CV.sample = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {	
			output.data[i + 0] = input.data[i + 0];
			output.data[i + 1] = input.data[i + 1];
			output.data[i + 2] = input.data[i + 2];
			output.data[i + 3] = input.data[i + 3];
		}
	}
	CV.context.putImage.data(output, 0, 0);
}

/////////////////////
// RGBとHSVの相互変換 //
/////////////////////

// RGB→HSV変換
CV.RGB2HSV = function(color, input){
	CV.resize();
	// colorに値を格納
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			color.push({
				r:input.data[i],
				g:input.data[i+1],
				b:input.data[i+2],
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
CV.hsv = function(type, input, output){
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
	var hueC = Number(document.getElementById('convValue').value);
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
		case 'convert':
			for(var i=0; i<color.length; i++){
				if(
					(color[i].h >= hueS) & (color[i].h <= hueE) &
					(color[i].s >= satS) & (color[i].s <= satE) &
					(color[i].v >= volS) & (color[i].v <= volE)
				){
					color[i].h += hueC;
					if(color[i].h < 0){
						color[i].h += 360;
					}else if(color[i].h > 360){
						color[i].h -= 360;
					}
				}
			}
		break;
	}
	// RGBへ戻す
	color = CV.HSV2RGB(color);
	// 変換処理
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			output.data[i + 0] = color[Math.floor(i/4)].r;
			output.data[i + 1] = color[Math.floor(i/4)].g;
			output.data[i + 2] = color[Math.floor(i/4)].b;
			output.data[i + 3] = input.data[i + 3];
		}
	}
	CV.copy(input, output);
}

/////////////
// 色調変換 //
/////////////

// ネガポジ反転
CV.negaposi = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			output.data[i] = 255 - input.data[i];
			output.data[i+1] = 255 - input.data[i+1];
			output.data[i+2] = 255 - input.data[i+2];
			output.data[i+3] = input.data[i+3];
		}
	}
	CV.copy(input, output);
}

// グレースケール
CV.gray = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// グレースケールの定数
			var gray = 
				+ 0.299 * input.data[i]
				+ 0.587 * input.data[i + 1]
				+ 0.114 * input.data[i + 2];
			output.data[i + 0] = gray;
			output.data[i + 1] = gray;
			output.data[i + 2] = gray;
			output.data[i + 3] = input.data[i + 3];
		}
	}
	CV.copy(input, output);
}

// セピア調
CV.sepia = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// グレースケールの定数
			var gray = 
				+ 0.299 * input.data[i]
				+ 0.587 * input.data[i + 1]
				+ 0.114 * input.data[i + 2];
			output.data[i + 0] = gray / 255 * 240;
			output.data[i + 1] = gray / 255 * 200;
			output.data[i + 2] = gray / 255 * 140;
			output.data[i + 3] = input.data[i + 3];
		}
	}
	CV.copy(input, output);
}

/////////////
// エッジ抽出 //
/////////////

// エッジ抽出（8近傍）
CV.edge = function(input, output){
	CV.sobel(8, input, output);
}

// エッジ抽出（4近傍）
CV.edge2 = function(input, output){
	CV.sobel(4, input, output);
}

// ソーベル
CV.sobel = function(opt, input, output){
	CV.resize();
	var course;
	if(opt == 4){
		// 4近傍
		course = 0;
	}else if(opt == 8){
		// 8近傍
		course = 5;
	}else{
		// 始動方向はテンキーの数字の位置に対応
		course = parseInt(document.getElementById('course').value);
	}
	switch(course){
		case 0:	var S = [0, 1, 0, 1, -4, 1, 0, 1, 0];break;	// 4近傍
		case 1:	var S = [0, -1, -2, 1, 0, -1, 2, 1, 0];break;
		case 2:	var S = [-1, -2, -1, 0, 0, 0, 1, 2, 1];break;
		case 3:	var S = [-2, -1, 0, -1, 0, 1, 0, 1, 2];break;
		case 4:	var S = [1, 0, -1, 2, 0, -2, 1, 0, -1];break;
		case 5:	var S = [1, 1, 1, 1, -8, 1, 1, 1, 1];break;	// 8近傍
		case 6:	var S = [-1, 0, 1, -2, 0, 2, -1, 0, 1];break;
		case 7:	var S = [2, 1, 0, 1, 0, -1, 0, -1, -2];break;
		case 8:	var S = [1, 2, 1, 0, 0, 0, -1, -2, -1];break;
		case 9:	var S = [0, 1, 2, -1, 0, 1, -2, -1, 0];break;
	}
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				output.data[i] = 
					S[0]*input.data[i - w*4 - 4] + S[1]*input.data[i - w*4] + S[2]*input.data[i - w*4 + 4] +
					S[3]*input.data[i - 4] + S[4]*input.data[i] + S[5]*input.data[i + 4] +
					S[6]*input.data[i + w*4 - 4] + S[7]*input.data[i + w*4] + S[8]*input.data[i + w*4 + 4];
			}
			output.data[(y*w + x)*4 + 3] = input.data[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy(input, output);
}

//////////
// ぼかし //
//////////

// メディアン
CV.median = function(input, output){
	CV.resize();
	var number = [];
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				// 中央値を求める
				number[0] = input.data[i - w*4 - 4];
				number[1] = input.data[i - w*4];
				number[2] = input.data[i - w*4 + 4];
				number[3] = input.data[i - 4];
				number[4] = input.data[i];
				number[5] = input.data[i + 4];
				number[6] = input.data[i + w*4 - 4];
				number[7] = input.data[i + w*4];
				number[8] = input.data[i + w*4 + 4];
				number.sort(
					function(a,b){
						if( a < b ) return -1;
						if( a > b ) return 1;
						return 0;
					}
				);
				// 中央値を代入
				output.data[i] = number[4];
			}
			output.data[(y*w + x)*4 + 3] = input.data[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy(input, output);
}

// 平滑化(NxN)
CV.smoothing = function(N, input, output){
	CV.resize();
	var smooth = Math.pow(N, -2);
	// var smooth = 1/25;
	// 全画素ループ
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				var sum = 0;
				// カーネル全ループ
				for(var dy=0; dy<N; dy++){
					for(var dx=0; dx<N; dx++){
						var horizon = w*(-(N-1)/2*4 + 4*dx);
						var vertical = -(N-1)/2*4 + 4*dy;
						// 画素値計算
						sum += smooth * input.data[i + horizon +  vertical];
					}
				}
				output.data[i] = sum;
			}
			output.data[(y*w + x)*4 + 3] = input.data[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy(input, output);
}

// ガウシアン(3x3)
CV.gaussian = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				output.data[i] = 
					1/16*input.data[i - w*4 - 4] + 2/16*input.data[i - w*4] + 1/16*input.data[i - w*4 + 4] +
					2/16*input.data[i - 4] + 4/16*input.data[i] + 2/16*input.data[i + 4] +
					1/16*input.data[i + w*4 - 4] + 2/16*input.data[i + w*4] + 1/16*input.data[i + w*4 + 4];
			}
			output.data[(y*w + x)*4 + 3] = input.data[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy(input, output);
}

// ガウシアン(5x5)
CV.gaussian2 = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			for (var c = 0; c < 3; c++) {
				var i = (y*w + x)*4 + c;
				output.data[i] = 
					1/256*input.data[i - w*8 - 8] + 
					4/256*input.data[i - w*8 - 4] + 
					6/256*input.data[i - w*8] + 
					4/256*input.data[i - w*8 + 4] +
					1/256*input.data[i - w*8 + 8] +

					4/256*input.data[i - w*4 - 8] + 
					16/256*input.data[i - w*4 - 4] + 
					24/256*input.data[i - w*4] + 
					16/256*input.data[i - w*4 + 4] +
					4/256*input.data[i - w*4 + 8] +

					6/256*input.data[i - 8] + 
					24/256*input.data[i - 4] + 
					36/256*input.data[i] + 
					24/256*input.data[i + 4] +
					6/256*input.data[i + 8] +

					4/256*input.data[i + w*4 - 8] + 
					16/256*input.data[i + w*4 - 4] + 
					24/256*input.data[i + w*4] + 
					16/256*input.data[i + w*4 + 4] +
					4/256*input.data[i + w*4 + 8] +

					1/256*input.data[i + w*8 - 8] + 
					4/256*input.data[i + w*8 - 4] + 
					6/256*input.data[i + w*8] + 
					4/256*input.data[i + w*8 + 4] +
					1/256*input.data[i + w*8 + 8];
			}
			output.data[(y*w + x)*4 + 3] = input.data[(y*w + x)*4 + 3]; // alpha
		}
	}
	CV.copy(input, output);
}

/////////////
// 明度補正 //
/////////////

// 明暗
CV.bright = function(input, output){
	CV.resize();
	var rate = document.getElementById('brightValue').value / 100;
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			var j = parseInt(rate);
			output.data[i + 0] = rate * input.data[i + 0];
			output.data[i + 1] = rate * input.data[i + 1];
			output.data[i + 2] = rate * input.data[i + 2];
			output.data[i + 3] = input.data[i + 3];
		}
	}
	CV.copy(input, output);
}

// ガンマ補正（凄く遅い）
CV.gamma = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// ガンマ値
			var gamma = document.getElementById("gammaValue").value;
			output.data[i + 0] = 255 * Math.pow((input.data[i + 0]/255), 1.0/gamma);
			output.data[i + 1] = 255 * Math.pow((input.data[i + 1]/255), 1.0/gamma);
			output.data[i + 2] = 255 * Math.pow((input.data[i + 2]/255), 1.0/gamma);
			output.data[i + 3] = input.data[i + 3];
		}
	}
	CV.copy(input, output);
}

// ガンマ補正（LUT使用版）
CV.gammaLUT = function(input, output){
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
			output.data[i + 0] = LUT[input.data[i]];
			output.data[i + 1] = LUT[input.data[i + 1]];
			output.data[i + 2] = LUT[input.data[i + 2]];
			output.data[i + 3] = input.data[i + 3];
		}
	}
	CV.copy(input, output);
}

/////////////
// 透過処理 //
/////////////

// 透過
CV.transparent = function(input, output){
	CV.resize();
	var opacity = document.getElementById('opacity').value;
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			output.data[i + 0] = input.data[i + 0];
			output.data[i + 1] = input.data[i + 1];
			output.data[i + 2] = input.data[i + 2];
			// 一定輝度以上のピクセルを透過
			if(
				(input.data[i] >= opacity) &
				(input.data[i+1] >= opacity) &
				(input.data[i+2] >= opacity) 
			){
				output.data[i + 3] = 0;
			}
		}
	}
	CV.copy(input, output);
}

/////////////
// 幾何変換 //
/////////////

// 水平反転
CV.hmirror = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			var j = (y*w + (w - x - 1))*4;
			output.data[i + 0] = input.data[j + 0];
			output.data[i + 1] = input.data[j + 1];
			output.data[i + 2] = input.data[j + 2];
			output.data[i + 3] = input.data[j + 3];
		}
	}
	CV.copy(input, output);
}

// 垂直反転
CV.vmirror = function(input, output){
	CV.resize();
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			var j = ((h - y -1)*w + x)*4;
			output.data[i + 0] = input.data[j + 0];
			output.data[i + 1] = input.data[j + 1];
			output.data[i + 2] = input.data[j + 2];
			output.data[i + 3] = input.data[j + 3];
		}
	}
	CV.copy(input, output);
}

// 拡縮（未完成）
CV.small = function(input, output){
	CV.resize();
	var rate = document.getElementById('rate').value / 100;
	CV.canvas.width = CV.canvas.width * rate;
	CV.canvas.height = CV.canvas.height * rate;
	CV.context.drawImage(image, 0, 0, rate * w, rate * h);
}

// 回転（未完成）
CV.rotation = function(input, output){
	CV.resize();
	var itheta = document.getElementById('theta').value;
	var theta = itheta * Math.PI/180;
	var sin = Math.sin(theta);
	var cos = Math.cos(theta);
	dw = parseInt((Math.abs(w * cos) + Math.abs(h * sin) + 0.5), 10);
	dh = parseInt((Math.abs(w * sin) + Math.abs(h * cos) + 0.5), 10);
	output.width = dw;
	output.height = dh;
	CV.canvas.width = output.width;
	CV.canvas.height = output.height;
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var i = (y*w + x)*4;
			// 回転角
			var rx = parseInt(((cos * (x-dw/2) - sin * (y-dh/2)) + w/2), 10);
			var ry = parseInt(((sin * (x-dw/2) + cos * (y-dh/2)) + h/2), 10);
			var j = (ry*w + rx)*4;
			output.data[i + 0] = input.data[j + 0];
			output.data[i + 1] = input.data[j + 1];
			output.data[i + 2] = input.data[j + 2];
			output.data[i + 3] = input.data[j + 3];
		}
	}
	CV.copy(input, output);
}
