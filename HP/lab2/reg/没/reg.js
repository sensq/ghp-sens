function strGet(){
	function getLength() {	
		var str = document.getElementById("textbox1").value;
		str = str.replace(/\n/g,"");
		document.getElementById("resultbox1").value = str.length;
	}
	getLength();

	function getLine() {	
		var str = document.getElementById("textbox1").value;
		var num = str.match(/\n|$/g).length;
		document.getElementById("resultbox2").value = num;
	}
	getLine();

	function strCopy(){
		var str = document.getElementById("textbox1").value;
		str = str.replace(/\n/g,"<br>");
		document.getElementById("color").innerHTML = str;
	}
	strCopy();
}

function colorCode() {
	var bgColor = document.getElementById("bgColor").value;
	var fontColor = document.getElementById("fontColor").value;
	
	//枠内の色の書き換え
	function colorConvert(){
		document.getElementById("color").style.backgroundColor = bgColor;
		document.getElementById("color").style.color = fontColor;
	}
	colorConvert();
	
	//RGB表記
	function colorRGB(){
		document.getElementById("bgColorRGB").value = document.getElementById("color").style.backgroundColor;
		document.getElementById("fontColorRGB").value = document.getElementById("color").style.color;
	}
	colorRGB();
	
	//16進数表記
	function colorHex(){
		//16進数表記（背景色）
		var bgHex = document.getElementById("color").style.backgroundColor;
		bgHex.match(/rgb\((\d+),\s(\d+),\s(\d+)\)/);	//RGB値の抽出
		var bgHex_R = parseInt(RegExp.$1);
		var bgHex_G = parseInt(RegExp.$2);
		var bgHex_B = parseInt(RegExp.$3);
		bgHex_R = bgHex_R.toString(16);
		bgHex_G = bgHex_G.toString(16);
		bgHex_B = bgHex_B.toString(16);
		
		bgHex = new String();
		bgHex = "#";
		if(bgHex_R <=9)
			bgHex += "0";
		bgHex += bgHex_R;
		if(bgHex_G <=9)
			bgHex += "0";
		bgHex += bgHex_G;
		if(bgHex_B <=9)
			bgHex += "0";
		bgHex += bgHex_B;
		document.getElementById("bgColorHex").value = bgHex;
		
		//16進数表記（文字色）
		var fontHex = document.getElementById("color").style.color;
		fontHex.match(/rgb\((\d+),\s(\d+),\s(\d+)\)/);	//RGB値の抽出
		var fontHex_R = parseInt(RegExp.$1);
		var fontHex_G = parseInt(RegExp.$2);
		var fontHex_B = parseInt(RegExp.$3);
		fontHex_R = fontHex_R.toString(16);
		fontHex_G = fontHex_G.toString(16);
		fontHex_B = fontHex_B.toString(16);
		
		fontHex = new String();
		fontHex = "#";
		if(fontHex_R <=9)
			fontHex += "0";
		fontHex += fontHex_R;
		if(fontHex_G <=9)
			fontHex += "0";
		fontHex += fontHex_G;
		if(fontHex_B <=9)
			fontHex += "0";
		fontHex += fontHex_B;
		document.getElementById("fontColorHex").value = fontHex;
	}
	colorHex();
	
	//HSV表記
	function colorHSV(){
		//HSV（背景色）
		var bgHSV_H = 0;	//hue
		var bgHSV_S = 0;	//saturation
		var bgHSV_V = 0;	//value
		var bgRGB = document.getElementById("color").style.backgroundColor;
		bgRGB.match(/rgb\((\d+),\s(\d+),\s(\d+)\)/);	//RGB値の抽出
		var bgRGB_R = parseInt(RegExp.$1);
		var bgRGB_G = parseInt(RegExp.$2);
		var bgRGB_B = parseInt(RegExp.$3);
		
		var max = Math.max(bgRGB_R, Math.max(bgRGB_G, bgRGB_B));
		var min = Math.min(bgRGB_R, Math.min(bgRGB_G, bgRGB_B));
		bgHSV_V = max;
		bgHSV_S = 255*((max-min)/max);
		switch(max){
			case bgRGB_R:
				bgHSV_H = 60*((bgRGB_G-bgRGB_B)/(max-min));
				break;
			case bgRGB_G:
				bgHSV_H = 60*(2+(bgRGB_B-bgRGB_R)/(max-min));
				break;
			case bgRGB_B:
				bgHSV_H = 60*(4+(bgRGB_R-bgRGB_G)/(max-min));
				break;
		}
		
		if(bgHSV_H < 0)
			bgHSV_H += 360;
		if(max == min){
			bgHSV_H = 0;
			bgHSV_S = 0;
		}
			
		bgHSV = new String();
		bgHSV = "hsv(";
		bgHSV += bgHSV_H;
		bgHSV += ", ";
		bgHSV += bgHSV_S/255*100;
		bgHSV += ", ";
		bgHSV += bgHSV_V/255*100;
		bgHSV += ")";
		document.getElementById("bgColorHSV").value = bgHSV;
		
		bgHSV = new String();
		bgHSV = "hsv(";
		bgHSV += parseInt(bgHSV_H/360*255);
		bgHSV += ", ";
		bgHSV += bgHSV_S;
		bgHSV += ", ";
		bgHSV += bgHSV_V;
		bgHSV += ")";
		document.getElementById("bgColorHexHSV").value = bgHSV;
		
		//HSV（文字色）
		var fontHSV_H = 0;	//hue
		var fontHSV_S = 0;	//saturation
		var fontHSV_V = 0;	//value
		var fontRGB = document.getElementById("color").style.color;
		fontRGB.match(/rgb\((\d+),\s(\d+),\s(\d+)\)/);	//RGB値の抽出
		var fontRGB_R = parseInt(RegExp.$1);
		var fontRGB_G = parseInt(RegExp.$2);
		var fontRGB_B = parseInt(RegExp.$3);
		
		var max = Math.max(fontRGB_R, Math.max(fontRGB_G, fontRGB_B));
		var min = Math.min(fontRGB_R, Math.min(fontRGB_G, fontRGB_B));
		fontHSV_V = max;
		fontHSV_S = 255*((max-min)/max);
		switch(max){
			case fontRGB_R:
				fontHSV_H = 60*((fontRGB_G-fontRGB_B)/(max-min));
				break;
			case fontRGB_G:
				fontHSV_H = 60*(2+(fontRGB_B-fontRGB_R)/(max-min));
				break;
			case fontRGB_B:
				fontHSV_H = 60*(4+(fontRGB_R-fontRGB_G)/(max-min));
				break;
		}
		
		if(fontHSV_H < 0)
			fontHSV_H += 360;
		if(max == min){
			fontHSV_H = 0;
			fontHSV_S = 0;
		}
		fontHSV = new String();
		fontHSV = "hsv(";
		fontHSV += fontHSV_H;
		fontHSV += ", ";
		fontHSV += fontHSV_S/255*100;
		fontHSV += ", ";
		fontHSV += fontHSV_V/255*100;
		fontHSV += ")";
		document.getElementById("fontColorHSV").value = fontHSV;
		
		fontHSV = new String();
		fontHSV = "hsv(";
		fontHSV += parseInt(fontHSV_H/360*255);
		fontHSV += ", ";
		fontHSV += fontHSV_S;
		fontHSV += ", ";
		fontHSV += fontHSV_V;
		fontHSV += ")";
		document.getElementById("fontColorHexHSV").value = fontHSV;
	}
	colorHSV();
}

flag = true;
function fontBold(){
	switch (flag) {
	case false:
		flag = true;
		document.getElementById("color").style.fontWeight = "bold";
		break;
	case true:
		flag = false;
		document.getElementById("color").style.fontWeight = "normal";
		break;
	}
}

//更新時に実行される動作
window.addEventListener('load', function (){
	document.textbox1.textbox1.value = "\
あいうえおかきくけこ\n\
さしすせそたちつてと\n\
なにぬねのはひふへほ\n\
まみむめめめめめめめ　めうめうーっ！(」*ﾟﾛﾟ)」\n\
めめめ　めうめうーっ！(」*ﾟﾛﾟ)」*ﾟﾛﾟ)」\n\
ぺーったんぺったんぺったんぺったん　大好き～っ☆⌒ヽ(*’､＾*)\n\
めめめめめめめ　めうめうーっ！　めめめ　めうめうーっ！\n\
ハンコで世界中シ・ア・ワ・セ☆(b^ｰﾟ)";
	document.color.bgColor.value = "#ff00ff";
	document.color.fontColor.value = "#c00";
	
	//チェックをはずす
	var check = document.getElementsByName("Button1");
	check[0].checked = true;
	
	strGet();
	colorCode();
}, false);
