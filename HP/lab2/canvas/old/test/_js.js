// グラフ作成用ライブラリ
document.write('<script type="text/javascript" src="cv.js"></script>');

// CV = new CV();

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

function main(){

}

/**********************
** 画像読み込み関連のメソッド
***********************/

// 読み込んだ画像を描画
function setImage(img){
	if(!document.getElementById("invisible").checked){
		CV.canvas = document.getElementById("img");
		CV.context = CV.canvas.getContext('2d');
	}else{
		CV.canvas = document.getElementById("outputImg");
		CV.context = CV.canvas.getContext('2d');
	}
	// 画像読み込み
	image = new Image();
	image.src = img;
	// 読み込み終了を待つ
	image.onload = function() {
		// 描画領域を画像のサイズにリサイズ
		CV.width = image.width;
		CV.height = image.height;
		// 画像描画
		CV.context.drawImage(image, 0, 0);
		// 画素データ読み込み
		input = CV.context.getImageData(0, 0, CV.width, CV.height);
		w = input.width, h = input.height;
		inputData = input.data;
		// 初期化用オブジェクト
		initialize = CV.context.getImageData(0, 0, CV.width, CV.height);
		initializeData = initialize.data;
		// 画像変換用オブジェクト
		output = CV.context.createImageData(CV.width, CV.height);
		outputData = output.data;
		// CV.create(CV., CV.context);
		CV.hist(input, output);
	}
}

// 画像を読み込み
function loadImg(){
	if (document.getElementById('loadImg').files[0].type.match('image.*')) {
		var img = document.getElementById('loadImg').files[0];
		var info = "name:" + img.name + " size:" + img.size;
		document.getElementById('list').innerHTML = info;
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

window.addEventListener('load', function (){
	// ドラッグ＆ドロップに対応
	document.getElementById('img').addEventListener("dragover", onCancel, false);
	document.getElementById('img').addEventListener("dragenter", onCancel, false);
	document.getElementById('img').addEventListener("drop", onDropFile, false);
	document.getElementById('outputImg').addEventListener("dragover", onCancel, false);
	document.getElementById('outputImg').addEventListener("dragenter", onCancel, false);
	document.getElementById('outputImg').addEventListener("drop", onDropFile, false);

	// デフォルト画像
	setImage("torusknot_19_16.png");

	// 各デフォルト値
	document.getElementById('course').value = 8;
	document.getElementById("gammaValue").value = 2.2;
	document.getElementById('rate').value = 75;
	document.getElementById('brightValue').value = 150;
	document.getElementById('opacity').value = 245;
	document.getElementById('theta').value = 45;

	// HSV
	document.getElementById('hueValue').value = 60;
	document.getElementById('satValue').value = 5;
	document.getElementById('volValue').value = 5;

	// 色抽出用
	document.getElementById('hueStart').value = 180;
	document.getElementById('hueEnd').value = 300;
	document.getElementById('satStart').value = 127;
	document.getElementById('satEnd').value = 255;
	document.getElementById('volStart').value = 100;
	document.getElementById('volEnd').value = 255;
	document.getElementById('convValue').value = 150;

	document.getElementById("invisible").checked = false;
	document.getElementById("copy").checked = true;
}, false);
