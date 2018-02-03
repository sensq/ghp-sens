var bgR = 123;
var bgG = 250;
var bgB = 200;
var fontR = 255 - bgR;
var fontG = 255 - bgG;
var fontB = 255 - bgB;

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
		document.getElementById("Color").innerHTML = str;
	}
	strCopy();
}

function colorMain(){
	requestAnimationFrame(colorMain);
	//16進数に変換
	bgHexR = bgR.toString(16);
	bgHexG = bgG.toString(16);
	bgHexB = bgB.toString(16);
	fontHexR = fontR.toString(16);
	fontHexG = fontG.toString(16);
	fontHexB = fontB.toString(16);
	
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
	
	//16進数表記
	function colorHex(){
		document.getElementById("bgColorCode").value = bgcolor;
		document.getElementById("fontColorCode").value = fontcolor;
	}
	colorHex();
	
	//RGB表記
	function colorRGB(){
		document.getElementById("bgRGB").value = document.getElementById("Color").style.backgroundColor;
		document.getElementById("fontRGB").value = document.getElementById("Color").style.color;
	}
	colorRGB();
	
	//RGB割合表記
	function colorRateRGB(){
		bgRateRGB = new String();
		bgRateRGB = "rgb(" + parseInt(bgR/255*100) + ", " + parseInt(bgG/255*100) + ", " + parseInt(bgB/255*100) + ")";
		document.getElementById("bgRateRGB").value = bgRateRGB;
		
		bgRateRGB = new String();
		bgRateRGB = "rgb(" + parseInt(fontR/255*100) + ", " + parseInt(fontG/255*100) + ", " + parseInt(fontB/255*100) + ")";
		document.getElementById("fontRateRGB").value = bgRateRGB;
	}
	colorRateRGB();
	
	//HSV表記
	function colorHSV(){
		var H = 0;	//hue
		var S = 0;	//saturation
		var V = 0;	//value
		
		//BackGround
		function bgCalcHSV(){
			var max = Math.max(bgR, Math.max(bgG, bgB));
			var min = Math.min(bgR, Math.min(bgG, bgB));
			V = max;
			S = 255*((max-min)/max);
			switch(max){
				case bgR:
					H = 60*((bgG-bgB)/(max-min));
					break;
				case bgG:
					H = 60*(2+(bgB-bgR)/(max-min));
					break;
				case bgB:
					H = 60*(4+(bgR-bgG)/(max-min));
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
			var max = Math.max(fontR, Math.max(fontG, fontB));
			var min = Math.min(fontR, Math.min(fontG, fontB));
			V = max;
			S = 255*((max-min)/max);
			switch(max){
				case fontR:
					H = 60*((fontG-fontB)/(max-min));
					break;
				case fontG:
					H = 60*(2+(fontB-fontR)/(max-min));
					break;
				case fontB:
					H = 60*(4+(fontR-fontG)/(max-min));
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
	gui = new dat.GUI();
	
	gui.add(this, 'bgR' , 0, 255).step(1).name("Back Red");
	gui.add(this, 'bgG' , 0, 255).step(1).name("Back Green");
	gui.add(this, 'bgB' , 0, 255).step(1).name("Back Blue");
	
	gui.domElement.style.position = 'absolute';
	gui.domElement.style.height = '105px';
	document.getElementById('Dat').appendChild(gui.domElement);
	
	font = new dat.GUI();
	
	font.add(this, 'fontR' , 0, 255).step(1).name("Font Red");
	font.add(this, 'fontG' , 0, 255).step(1).name("Font Green");
	font.add(this, 'fontB' , 0, 255).step(1).name("Font Blue");
	
	font.domElement.style.position = 'absolute';
	font.domElement.style.height = '105px';
	font.domElement.style.left = '260px';
	document.getElementById('Dat').appendChild(font.domElement);
	colorMain();
}

window.addEventListener('load', function (){	
	document.textbox1.textbox1.value = "\
めめめめめめめ　めうめうーっ！(」*ﾟﾛﾟ)」\n\
めめめ　めうめうーっ！(」*ﾟﾛﾟ)」*ﾟﾛﾟ)」\n\
ぺーったんぺったんぺったんぺったん　大好き～っ☆⌒ヽ(*’､＾*)\n\
めめめめめめめ　めうめうーっ！　めめめ　めうめうーっ！\n\
ハンコで世界中シ・ア・ワ・セ☆(b^ｰﾟ)";
	
	strGet();
	Dat();
}, false);
