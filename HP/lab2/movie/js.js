var flag = false;
var inv = false;
function setImage(mov){
	var canvas = document.getElementById("img");
	var context = canvas.getContext('2d');

	var video = document.getElementById("video");
	video.src = mov;
	video.load();
	video.addEventListener("loadeddata", function() {
	// // 描画領域を画像のサイズにリサイズ
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	w = canvas.width, h = canvas.height;
	(function mov(){
		requestAnimationFrame(mov);
		context.drawImage(video, 0, 0);
		// 画素データ読み込み
		input = context.getImageData(0, 0, canvas.width, canvas.height);
		inputData = input.data;
	})();
	// 画像変換用オブジェクト
	output = context.createImageData(canvas.width, canvas.height);
	outputData = output.data;
    }, false);

	var button = document.getElementById("pause");
	if(!video.paused){
		video.play();
		button.textContent = "一時停止";
	}else{
		video.pause();
		button.textContent = "　再生　";
	}
}

/*
** 画像変換
*/
var imgConvert = (function(){
	// 描画領域リサイズ
	var canvas,context;
	var flag2 = false;
	var mode = 0;
	function resize(){
		canvas = document.getElementById("img");
		context = canvas.getContext('2d');
		context.setTransform(1, 0, 0, 1, 0, 0);
		canvas.width = output.width;
		canvas.height = output.height;
		mode = 0;
	}

	// 初期化
	this.init = function(){
		resize();
		context.putImageData(output, 0, 0);
	}

	// ネガポジ反転
	this.negaposi = function(){
		resize();
		mode = 1;
		(function mov(){
			if(mode == 1){
				requestAnimationFrame(mov);
			}
			for (var y = 0; y < h-1; y++) {
				for (var x = 0; x < w-1; x++) {
					for (var c = 0; c < 3; c++) {
						var i = (y*w + x)*4 + c;
						outputData[i] = 
							256 - inputData[i];
					}
					outputData[(y*w + x)*4 + 3] = 255; // alpha
				}
			}
			context.putImageData(output, 0, 0);
		})();
	}

	// エッジ検出
	this.edge = function(){
		resize();
		mode = 2;
		(function mov(){
			if(mode == 2){
				requestAnimationFrame(mov);
			}
			for (var y = 0; y < h-1; y++) {
				for (var x = 0; x < w-1; x++) {
					for (var c = 0; c < 3; c++) {
						var i = (y*w + x)*4 + c;
						outputData[i] = 127 + 
							-inputData[i - w*4 - 4] - inputData[i - w*4] - inputData[i - w*4 + 4] +
							-inputData[i - 4] + 8*inputData[i] - inputData[i + 4] +
							-inputData[i + w*4 - 4] - inputData[i + w*4] - inputData[i + w*4 + 4];
					}
					outputData[(y*w + x)*4 + 3] = 255; // alpha
				}
			}
			context.putImageData(output, 0, 0);
		})();
	}

	// グレースケール
	this.gray = function(){
		resize();
		mode = 3;
		(function mov(){
			if(mode == 3){
				requestAnimationFrame(mov);
			}
			for (var y = 0; y < h-1; y++) {
				for (var x = 0; x < w-1; x++) {
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
			context.putImageData(output, 0, 0);
		})();
	}

	// ガンマ補正
	this.gamma = function(){
		resize();
		mode = 4;
		(function mov(){
			if(mode == 4){
				requestAnimationFrame(mov);
			}
			for (var y = 0; y < h-1; y++) {
				for (var x = 0; x < w-1; x++) {
					var i = (y*w + x)*4;
					// ガンマ値
					var gamma = document.getElementById("gammaValue").value;
					var gamma = 1.0/gamma;
					outputData[i + 0] = 255 * Math.pow((inputData[i + 0]/255), gamma);
					outputData[i + 1] = 255 * Math.pow((inputData[i + 1]/255), gamma);
					outputData[i + 2] = 255 * Math.pow((inputData[i + 2]/255), gamma);
					outputData[i + 3] = inputData[i + 3];
				}
			}
			context.putImageData(output, 0, 0);
		})();
	}

	// ガンマ補正（LUT使用版）
	this.gamma2 = function(){
		resize();
		mode = 12;
		// ガンマ値のLUT作成
		var gamma = document.getElementById("gammaValue").value;
		var LUT = [256];
		for(var i=0; i<256; i++){
			LUT[i] = Math.pow((i/255), 1/gamma)*255;
		}
		(function mov(){
			if(mode == 12){
				requestAnimationFrame(mov);
			}
			for (var y = 0; y < h-1; y++) {
				for (var x = 0; x < w-1; x++) {
					var i = (y*w + x)*4;
					outputData[i + 0] = LUT[inputData[i]];
					outputData[i + 1] = LUT[inputData[i + 1]];
					outputData[i + 2] = LUT[inputData[i + 2]];
					outputData[i + 3] = inputData[i + 3];
				}
			}
			context.putImageData(output, 0, 0);
		})();
	}

	// 水平反転
	this.hmirror = function(){
		resize();
		mode = 5;
		(function mov(){
			if(mode == 5){
				requestAnimationFrame(mov);
				context.setTransform(-1, 0, 0, 1, w, 0);
				context.drawImage(video, 0, 0, w, h, 0, 0, w, h)
			}
		})();
	}

	// 垂直反転
	this.vmirror = function(){
		resize();
		mode = 6;
		(function mov(){
			if(mode == 6){
				requestAnimationFrame(mov);
				context.setTransform(1, 0, 0, -1, 0, h);
				context.drawImage(video, 0, 0, w, h, 0, 0, w, h)
			}
		})();
	}

	// 垂直水平反転
	this.vhmirror = function(){
		resize();
		mode = 7;
		(function mov(){
			if(mode == 7){
				requestAnimationFrame(mov);
				context.setTransform(-1, 0, 0, -1, w, h);
				context.drawImage(video, 0, 0, w, h, 0, 0, w, h)
			}
		})();
	}

	// セピア調
	this.sepia = function(){
		resize();
		mode = 8;
		(function mov(){
			if(mode == 8){
				requestAnimationFrame(mov);
			}
			for (var y = 0; y < h-1; y++) {
				for (var x = 0; x < w-1; x++) {
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
			context.putImageData(output, 0, 0);
		})();
	}

	// 拡縮
	this.size = function(){
		resize();
		mode = 9;
		var rateW = document.getElementById('rateW').value / 100;
		var rateH = document.getElementById('rateH').value / 100;
		canvas.width = canvas.width * rateW;
		canvas.height = canvas.height * rateH;
		(function mov(){
			if(mode == 9){
				requestAnimationFrame(mov);
			}
			context.setTransform(rateW, 0, 0, rateH, 0, 0);
			context.drawImage(video, 0, 0, w, h, 0, 0, w, h)
		})();
	}

	// 明暗
	this.bright = function(){
		resize();
		mode = 10;
		(function mov(){
			if(mode == 10){
				requestAnimationFrame(mov);
			}
			var rate = document.getElementById('brightValue').value / 100;
			for (var y = 0; y < h-1; y++) {
				for (var x = 0; x < w-1; x++) {
					var i = (y*w + x)*4;
					var j = parseInt(rate * i);
					outputData[i + 0] = rate * inputData[i + 0];
					outputData[i + 1] = rate * inputData[i + 1];
					outputData[i + 2] = rate * inputData[i + 2];
					outputData[i + 3] = inputData[i + 3];
				}
			}
			context.putImageData(output, 0, 0);
		})();
	}

	// 透過
	this.transparent = function(){
		resize();
		mode = 11;
		(function mov(){
			if(mode == 11){
				requestAnimationFrame(mov);
			}
			var opacity = document.getElementById('opacity').value;
			for (var y = 0; y < h-1; y++) {
				for (var x = 0; x < w-1; x++) {
					var i = (y*w + x)*4;
					outputData[i + 0] = inputData[i + 0];
					outputData[i + 1] = inputData[i + 1];
					outputData[i + 2] = inputData[i + 2];
					if(inputData[i + 3] == 0){
						outputData[i + 3] = inputData[i + 3];
					}else{
						outputData[i + 3] = opacity;
					}
				}
			}
			context.putImageData(output, 0, 0);
		})();
	}

	// 回転
	this.rotation = function(){
		resize();
		(function mov(){
			requestAnimationFrame(mov);
			var itheta = document.getElementById('theta').value;
			var theta = itheta * Math.PI/180;
			var sin = Math.sin(theta);
			var cos = Math.cos(theta);
			dw = parseInt((Math.abs(w * cos) + Math.abs(h * sin) + 0.5), 10);
			dh = parseInt((Math.abs(w * sin) + Math.abs(h * cos) + 0.5), 10);
			output.width = dw;
			output.height = dh;
			canvas.width = output.width;
			canvas.height = output.height;
			for (var y = 0; y < h-1; y++) {
				for (var x = 0; x < w-1; x++) {
					var i = (y*w + x)*4;
					// 回転角
					var rx = parseInt(((cos * (x-dw/2) - sin * (y-dh/2)) + w/2), 10);
					var ry = parseInt(((sin * (x-dw/2) + cos * (y-dh/2)) + h/2), 10);
					var j = (ry*w + rx)*4;
					outputData[i + 0] = inputData[j + 0];
					outputData[i + 1] = inputData[j + 1];
					outputData[i + 2] = inputData[j + 2];
					outputData[i + 3] = inputData[j + 3];
				}
			}
			context.putImageData(output, 0, 0);
		})();
	}
	return this;
})();

function loadImg(){
	if (document.getElementById('loadImg').files[0].type.match('video.*')) {
		var img = document.getElementById('loadImg').files[0];
		var info = "name:" + img.name + " size:" + img.size;
		document.getElementById('list').innerHTML = info;
		var fr = new FileReader();
		fr.onload = onFileLoad;
		fr.readAsDataURL(img);
	}else{
		alert("動画ファイルを指定して下さい");
	}
}

function onFileLoad(e) {
	setImage(e.target.result);
}

// URL取得
function url() {
	var url = document.getElementById("URL").value;
	setImage(url);
}

/*
** 動画制御
*/
var video_control = (function (){
	// 再生/一時停止
	this.pause = function(){
		var button = document.getElementById("pause");
		if(video.paused){
			video.play();
			button.textContent = "一時停止";
		}else{
			video.pause();
			button.textContent = "　再生　";
		}
	}
	// 停止
	this.stop = function(){
		video.pause();
		video.currentTime = 0;
		var button = document.getElementById("pause");
		if(!video.paused){
			button.textContent = "一時停止";
		}else{
			button.textContent = "　再生　";
		}
	}
	// ミュート
	this.mute = function(){
		if(video.muted){
			video.muted = false;
		}else{
			video.muted = true;
		}
	}
	// 再生速度変更
	this.rate = function(){
		var rate = document.getElementById("playRate").value;
		if(rate > 4.0){
			rate = 4.0;
		}else if(rate < 0.5){
			rate = 0.5;
		}
		video.playbackRate = rate;
	}
	// 早送り/巻戻し
	this.skip = function (value) {
		onMouse = true;
		(function mov(){
			if(onMouse){
				requestAnimationFrame(mov);
			}
			video.currentTime += value;
		})();
	}
	return this;
})();

window.addEventListener('load', function (){
	setImage("GN.mp4");
	document.getElementById("URL").value = "http://www.gomplayer.jp/img/sample/mp4_h264_aac.mp4";
	document.getElementById("gammaValue").value = 2.2;
	document.getElementById('rateW').value = 50;
	document.getElementById('rateH').value = 75;
	document.getElementById('brightValue').value = 150;
	document.getElementById('opacity').value = 128;

	document.getElementById("mute").checked = false;
	document.getElementById("playRate").value= (1.0).toFixed(1);
}, false);
