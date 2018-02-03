var bgR = 123;
var bgG = 250;
var bgB = 200;
var fontR = 255 - bgR;
var fontG = 255 - bgG;
var fontB = 255 - bgB;

var bgH = 300;
var bgS = 10;
var bgV = 20;
var fontH = 360 - bgH;
var fontS = 255 - bgS;
var fontV = 255 - bgV;

var mode = "RGB";

function buttonMode(){
	if(mode === "RGB"){
		mode = "HSV";
	}else{
		mode = "RGB";
	}
}

function strGet(){
	//文字数取得
	function getLength() {	
		var str = document.getElementById("textbox1").value;
		str = str.replace(/\n/g,"");
		document.getElementById("resultbox1").value = str.length;
	}
	getLength();
	
	//行数取得
	function getLine() {	
		var str = document.getElementById("textbox1").value;
		var num = str.match(/\n|$/g).length;
		document.getElementById("resultbox2").value = num;
	}
	getLine();
	
	//div.Colorへコピー
	function strCopy(){
		var str = document.getElementById("textbox1").value;
		str = str.replace(/\n/g,"<br>");
		document.getElementById("Color").innerHTML = str;
	}
	strCopy();
}

//HSV→RGB変換
function HSV2RGB(){
	hi = Math.floor(bgH / 60.0) % 6;
	f  = (bgH / 60.0) - Math.floor(bgH / 60.0);
	p  = Math.round(bgV * (1.0 - (bgS / 255.0)));
	q  = Math.round(bgV * (1.0 - (bgS / 255.0) * f));
	t  = Math.round(bgV * (1.0 - (bgS / 255.0) * (1.0 - f)));
	
	switch(hi){
		case 0:
			_bgR = bgV;
			_bgG = t;
			_bgB = p;
			break;
		case 1:
			_bgR = q;
			_bgG = bgV;
			_bgB = p;
			break;
		case 2:
			_bgR = p;
			_bgG = bgV;
			_bgB = t;
			break;
		case 3:
			_bgR = p;
			_bgG = q;
			_bgB = bgV;
			break;
		case 4:
			_bgR = t;
			_bgG = p;
			_bgB = bgV;
			break;
		case 5:
			_bgR = bgV;
			_bgG = p;
			_bgB = q;
			break;
		default:
			alert("error");
	}
	bgHexR = _bgR.toString(16);
	bgHexG = _bgG.toString(16);
	bgHexB = _bgB.toString(16);
	
	hi = Math.floor(fontH / 60.0) % 6;
	f  = (fontH / 60.0) - Math.floor(fontH / 60.0);
	p  = Math.round(fontV * (1.0 - (fontS / 255.0)));
	q  = Math.round(fontV * (1.0 - (fontS / 255.0) * f));
	t  = Math.round(fontV * (1.0 - (fontS / 255.0) * (1.0 - f)));
	
	switch(hi){
		case 0:
			_fontR = fontV;
			_fontG = t;
			_fontB = p;
			break;
		case 1:
			_fontR = q;
			_fontG = fontV;
			_fontB = p;
			break;
		case 2:
			_fontR = p;
			_fontG = fontV;
			_fontB = t;
			break;
		case 3:
			_fontR = p;
			_fontG = q;
			_fontB = fontV;
			break;
		case 4:
			_fontR = t;
			_fontG = p;
			_fontB = fontV;
			break;
		case 5:
			_fontR = fontV;
			_fontG = p;
			_fontB = q;
			break;
		default:
			alert("error");
	}
	fontHexR = _fontR.toString(16);
	fontHexG = _fontG.toString(16);
	fontHexB = _fontB.toString(16);
}

function colorMain(){
	requestAnimationFrame(colorMain);
	//16進数に変換
	if(mode === "RGB"){
		_bgR = bgR
		_bgG = bgG
		_bgB = bgB
		_fontR = fontR
		_fontG = fontG
		_fontB = fontB
		bgHexR = _bgR.toString(16);
		bgHexG = _bgG.toString(16);
		bgHexB = _bgB.toString(16);
		fontHexR = _fontR.toString(16);
		fontHexG = _fontG.toString(16);
		fontHexB = _fontB.toString(16);
	}else if(mode === "HSV"){
		//HSVの場合は一旦RGBへ変換する
		HSV2RGB();
	}
	
	//枠内の色の書き換え
	function colorConvert(){
		//BackGround
		bgcolor = new String();
		bgcolor = "#";
		if(bgHexR.length == 1)
			bgcolor += "0";
		bgcolor += bgHexR;
		if(bgHexG.length == 1)
			bgcolor += "0";
		bgcolor += bgHexG;
		if(bgHexB.length == 1)
			bgcolor += "0";
		bgcolor += bgHexB;
	    document.getElementById('Color').style.backgroundColor = bgcolor;
	    
	    //Font
	    fontcolor = new String();
		fontcolor = "#";
		if(fontHexR.length == 1)
			fontcolor += "0";
		fontcolor += fontHexR;
		if(fontHexG.length == 1)
			fontcolor += "0";
		fontcolor += fontHexG;
		if(fontHexB.length == 1)
			fontcolor += "0";
		fontcolor += fontHexB;
	    document.getElementById('Color').style.color = fontcolor;
	}
	colorConvert();
	
	//カラーコード
	function colorCode(){
		document.getElementById("bgColorCode").value = bgcolor;
		document.getElementById("fontColorCode").value = fontcolor;
	}
	colorCode();
	
	//RGB表記
	function colorRGB(){
		document.getElementById("bgRGB").value = document.getElementById("Color").style.backgroundColor;
		document.getElementById("fontRGB").value = document.getElementById("Color").style.color;
	}
	colorRGB();
	
	//RGB割合表記
	function colorRateRGB(){
		_bgRateRGB = new String();
		_bgRateRGB = "rgb(" + parseInt(_bgR/255*100) + ", " + parseInt(_bgG/255*100) + ", " + parseInt(_bgB/255*100) + ")";
		document.getElementById("bgRateRGB").value = _bgRateRGB;
		
		_bgRateRGB = new String();
		_bgRateRGB = "rgb(" + parseInt(_fontR/255*100) + ", " + parseInt(_fontG/255*100) + ", " + parseInt(_fontB/255*100) + ")";
		document.getElementById("fontRateRGB").value = _bgRateRGB;
	}
	colorRateRGB();
	
	//HSV表記
	function colorHSV(){
		var H = 0;	//hue
		var S = 0;	//saturation
		var V = 0;	//value
		
		//BackGround
		function bgCalcHSV(){
			var max = Math.max(_bgR, Math.max(_bgG, _bgB));
			var min = Math.min(_bgR, Math.min(_bgG, _bgB));
			V = max;
			S = 255*((max-min)/max);
			switch(max){
				case _bgR:
					H = 60*((_bgG-_bgB)/(max-min));
					break;
				case _bgG:
					H = 60*(2+(_bgB-_bgR)/(max-min));
					break;
				case _bgB:
					H = 60*(4+(_bgR-_bgG)/(max-min));
					break;
			}
			
			if(H < 0)
				H += 360;
			if(max == min){
				H = 0;
				S = 0;
			}
			
			//H:0～360, S:0～100, V:0～100で表記
			HSV = new String();
			HSV = "hsv(" + parseInt(H) + ", " + parseInt(S/255*100) + ", " + parseInt(V/255*100) + ")";
			document.getElementById("bgHSV").value = HSV;
			
			//全部0～255で表記
			HSV = new String();
			HSV = "hsv(" + parseInt(H/360*255) + ", " + parseInt(S) + ", " + parseInt(V) + ")";
			document.getElementById("bgHexHSV").value = HSV;
		}
		bgCalcHSV();
		
		
		//Font
		function fontCalcHSV(){
			var max = Math.max(_fontR, Math.max(_fontG, _fontB));
			var min = Math.min(_fontR, Math.min(_fontG, _fontB));
			V = max;
			S = 255*((max-min)/max);
			switch(max){
				case _fontR:
					H = 60*((_fontG-_fontB)/(max-min));
					break;
				case _fontG:
					H = 60*(2+(_fontB-_fontR)/(max-min));
					break;
				case _fontB:
					H = 60*(4+(_fontR-_fontG)/(max-min));
					break;
			}
			
			if(H < 0)
				H += 360;
			if(max == min){
				H = 0;
				S = 0;
			}
			
			//H:0～360, S:0～100, V:0～100で表記
			HSV = new String();
			HSV = "hsv(";
			HSV += parseInt(H);
			HSV += ", ";
			HSV += parseInt(S/255*100);
			HSV += ", ";
			HSV += parseInt(V/255*100);
			HSV += ")";
			document.getElementById("fontHSV").value = HSV;
			
			//全部0～255で表記
			HSV = new String();
			HSV = "hsv(";
			HSV += parseInt(H/360*255);
			HSV += ", ";
			HSV += parseInt(S);
			HSV += ", ";
			HSV += parseInt(V);
			HSV += ")";
			document.getElementById("fontHexHSV").value = HSV;
		}
		fontCalcHSV();
	}
	colorHSV();
}

function Dat(){
	//RGB(左カラム)
	bg = new dat.GUI();
	
	bg.add(this, 'bgR' , 0, 255).step(1).name("Back Red");
	bg.add(this, 'bgG' , 0, 255).step(1).name("Back Green");
	bg.add(this, 'bgB' , 0, 255).step(1).name("Back Blue");
	
	bg.domElement.style.position = 'absolute';
	bg.domElement.style.height = '105px';
	document.getElementById('Dat').appendChild(bg.domElement);
	
	font = new dat.GUI();
	
	font.add(this, 'fontR' , 0, 255).step(1).name("Font Red");
	font.add(this, 'fontG' , 0, 255).step(1).name("Font Green");
	font.add(this, 'fontB' , 0, 255).step(1).name("Font Blue");
	
	font.domElement.style.position = 'absolute';
	font.domElement.style.height = '105px';
	font.domElement.style.left = '260px';
	document.getElementById('Dat').appendChild(font.domElement);
	
	//HSV(右カラム)
	HSVbg = new dat.GUI();
	
	HSVbg.add(this, 'bgH' , 0, 360).step(1).name("Back Hue");
	HSVbg.add(this, 'bgS' , 0, 255).step(1).name("Back Saturation");
	HSVbg.add(this, 'bgV' , 0, 255).step(1).name("Back Value");
	
	HSVbg.domElement.style.position = 'absolute';
	HSVbg.domElement.style.height = '105px';
	document.getElementById('HSVDat').appendChild(HSVbg.domElement);
	
	HSVfont = new dat.GUI();
	
	HSVfont.add(this, 'fontH' , 0, 360).step(1).name("Font Hue");
	HSVfont.add(this, 'fontS' , 0, 255).step(1).name("Font Saturation");
	HSVfont.add(this, 'fontV' , 0, 255).step(1).name("Font Value");
	
	HSVfont.domElement.style.position = 'absolute';
	HSVfont.domElement.style.height = '105px';
	HSVfont.domElement.style.left = '830px';
	document.getElementById('HSVDat').appendChild(HSVfont.domElement);
	colorMain();
}

window.addEventListener('load', function (){
	//チェックを戻す
	document.getElementsByName("Button1")[0].checked=false;
	
	//テキストボックス初期化
	document.textbox1.textbox1.value = "\
めめめめめめめ　めうめうーっ！(」*ﾟﾛﾟ)」\n\
めめめ　めうめうーっ！(」*ﾟﾛﾟ)」*ﾟﾛﾟ)」\n\
ぺーったんぺったんぺったんぺったん　大好き～っ☆⌒ヽ(*’､＾*)\n\
めめめめめめめ　めうめうーっ！　めめめ　めうめうーっ！\n\
ハンコで世界中シ・ア・ワ・セ☆(b^ｰﾟ)";
	
	//初期実行関数
	strGet();
	Dat();
}, false);
