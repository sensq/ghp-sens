document.write('<script type="text/javascript" src="./dat.gui.min.js"></script>');
var rad = Math.PI/180;
var canvas;
var context;
var image;
var w, h;

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

var gui = function(){
	var bg = {
		Color: "",
		R:90,
		G:128,
		B:60
	}
	var gui = new dat.GUI();

	this.RGB = function(){
		bg.Color = "rgb(" + bg.R + ", " + bg.G + ", " + bg.B +")";
		document.getElementById('RGB').style.backgroundColor = bg.Color;
		var fontColor = "rgb(" + (255-bg.R) + ", " + (255-bg.G) + ", " + (255-bg.B) +")";
		document.getElementById('RGB').style.color = fontColor;
		bg.Color = bg.Color.replace("rgb", "RGB")
		document.getElementById('RGB').innerHTML = "<b>" + bg.Color + "</b>";
	}
	var bgColorR = gui.add(bg, 'R', 0, 255).step(1);
	bgColorR.onChange(function(value){
		bg.R = value;
		RGB();
	});
	var bgColorG = gui.add(bg, 'G', 0, 255).step(1);
	bgColorG.onChange(function(value){
		bg.G = value;
		RGB();
	});
	var bgColorB = gui.add(bg, 'B', 0, 255).step(1);
	bgColorB.onChange(function(value){
		bg.B = value;
		RGB();
	});

	var parameters = {color: 0x484769};
	var bgColor = gui.addColor(parameters, 'color').name("パレット").listen();
	bgColor.onChange(function(value){
		// 16進数に変換
		value = value.toString(16);
		// 必ず6桁にする
		value = ('0000' + value).slice(-6);
		// 各値を取り出して10進数に変換
		bg.R = parseInt(value.slice(0, 2), 16);
		bg.G = parseInt(value.slice(2, 4), 16);
		bg.B = parseInt(value.slice(4, 7), 16);
		bg.Color = "rgb(" + bg.R + ", " + bg.G + ", " + bg.B +")";
		document.getElementById('color').style.backgroundColor = bg.Color;
	});
	var font = {
		Size:12
	}
	var fontSize = gui.add(font, 'Size', 1, 50).step(1);
	fontSize.onChange(function(value){
		var size = value + "px";
		document.getElementById("color").style.fontSize = size;
	});
	var func = {
		alertTest: function(){alert("関数実行テスト")}
	}
	var Alert = gui.add(func, 'alertTest').name("Function");
	var select = {
		list: "ああ"
	}
	var selecter = gui.add(select, 'list', {ああ:"ああ", テスト:"テスト", 数字:123456}).name("セレクトボックス1");
	selecter.onChange(function(value){
			document.getElementById('color').innerHTML = value;
	});
	var selectFunc = {
		number: 0
	}
	var selecterFunc = gui.add(selectFunc, 'number', {赤:0, 黄:1, 緑:2, 水:3, 青:4, 紫:5}).name("セレクトボックス2");
	selecterFunc.onChange(function(value){
		value = parseInt(value);
		switch(value){
			case 0:
			document.getElementById('color').style.backgroundColor = "rgb(255, 0, 0)";
			break;
			case 1:
			document.getElementById('color').style.backgroundColor = "rgb(255, 255, 0)";
			break;
			case 2:
			document.getElementById('color').style.backgroundColor = "rgb(0, 255, 0)";
			break;
			case 3:
			document.getElementById('color').style.backgroundColor = "rgb(0, 255, 255)";
			break;
			case 4:
			document.getElementById('color').style.backgroundColor = "rgb(0, 0, 255)";
			break;
			case 5:
			document.getElementById('color').style.backgroundColor = "rgb(255, 0, 255)";
			break;
		}
	});
	gui.open();
	document.getElementById('gui').appendChild(gui.domElement);
}

/*
** テキスト欄などのデフォルト値代入
*/
window.addEventListener('load', function() {
	gui();
}, false);