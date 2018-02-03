var rad = Math.PI/180;
var canvas;
var context;
var image;
var w, h;

function setImage(img){
	canvas = document.getElementById("img");
	context = canvas.getContext('2d');
	
	// 画像読み込み
	image = new Image();
	image.src = img;
	// 読み込み終了を待つ
	image.onload = function() {
		w = image.width, h = image.height;
		if(w % 2 != 0)
			w--;
		if(h % 2 != 0)
			h--;
		// 描画領域を画像のサイズにリサイズ
		canvas.width = w;
		canvas.height = h;
		// 画像描画
		context.drawImage(image, 0, 0);
	}
}

/*
** 画像変換
*/
var imgConvert = (function(){
	var draw;
	// 変換と描画用関数
	function Draw(sx, sy, sw, sh, dx, dy, dw, dh){
		// 描画領域をクリア
	    context.clearRect(0, 0, w, h);
        // 関数を返す（無名関数）
		return function (mX, mY) {
			var W = w, H = h;
			if(mX == 1) W = 0;
			if(mY == 1) H = 0;
			context.setTransform(mX, 0, 0, mY, W, H);
			context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
		}
	}
	// 初期化
	this.Init = function(){
		draw = new Draw(0, 0, w, h, 0, 0, w, h);
		draw(1, 1);
	}

	// 左半分を使用
	this.Left = function () {
        // 変換に使う領域を左半分に設定
	    draw = new Draw(0, 0, w / 2, h, 0, 0, w / 2, h);
        // 普通に描画
	    draw(1, 1);
        // x方向だけ反転して描画
		draw(-1, 1);
	}
	// 右半分を使用
	this.Right = function(){
		draw = new Draw(w/2, 0, w, h, w/2, 0, w, h);
		draw(1, 1);
		draw(-1, 1);
	}
	// 上半分を使用
	this.Top = function(){
		draw = new Draw(0, 0, w, h/2, 0, 0, w, h/2);
		draw(1, 1);
		draw(1, -1);
	}
	// 下半分を使用
	this.Bottom = function(){
		draw = new Draw(0, h/2, w, h, 0, h/2, w, h);
		draw(1, 1);
		draw(1, -1);
	}

	// 左上を使用
	this.tLeft = function(){
		draw = new Draw(0, 0, w/2, h/2, 0, 0, w/2, h/2);
		draw(1, 1);
		draw(-1, 1);
		draw(1, -1);
		draw(-1, -1);
	}
	// 右上を使用
	this.tRight = function(){
		draw = new Draw(w/2, 0, w, h/2, w/2, 0, w, h/2);
		draw(1, 1);
		draw(-1, 1);
		draw(1, -1);
		draw(-1, -1);
	}
	// 左下を使用
	this.bLeft = function(){
		draw = new Draw(0, h/2, w/2, h, 0, h/2, w/2, h);
		draw(1, 1);
		draw(-1, 1);
		draw(1, -1);
		draw(-1, -1);
	}
	// 右下を使用
	this.bRight = function(){
		draw = new Draw(w/2, h/2, w, h, w/2, h/2, w, h);
		draw(1, 1);
		draw(-1, 1);
		draw(1, -1);
		draw(-1, -1);
	}
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
		fr.onload = function onFileLoad(e) {
			setImage(e.target.result);
		}
		fr.readAsDataURL(img);
	}else{
		alert("画像ファイルを指定して下さい");
	}
}

// URL取得
function url() {
	var url = document.getElementById("URL").value;
	setImage(url);
}

// ドラッグ＆ドロップで読み込み
function onDropFile(e) {
    e.preventDefault();
    var img = e.dataTransfer.files[0];
    if (img.type.match('image.*')) {
        var fr = new FileReader();
        // 読み込み終了を待つ
        fr.onload = function onFileLoad(e) {
            setImage(e.target.result);
        }
        fr.readAsDataURL(img);
    } else {
        alert("画像ファイルを指定して下さい");
    }
}

// デフォルト処理をキャンセル
function onCancel(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    return false;
};

window.addEventListener('load', function (){
    setImage("ika.jpg");
    // ドラッグ＆ドロップに対応
    document.getElementById("img").addEventListener("dragover", onCancel, false);
    document.getElementById("img").addEventListener("dragenter", onCancel, false);
    document.getElementById("img").addEventListener("drop", onDropFile, false);
}, false);
