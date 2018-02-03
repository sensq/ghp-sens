function getLength(formSTR) {	
	var str = formSTR
	str = str.replace(/\n/g,"");
	document.getElementById("resultbox").value = str.length;
}

function reg(){
	var str = document.getElementById("textbox2").value;
	var regNum = new RegExp("[0-9]+");
	
	function newLine(){
		str = str.replace(/\n/g,"<br>");
	}
	function size(){
		str.match(/<img.+?width=(\d+)/);
		width = RegExp.$1;
		if(regNum.test(width) == false)
			width = 150;
		
		str.match(/<img.+?height=(\d+)/i);
		height = RegExp.$1;
		if(regNum.test(height) == false)
			height = 150;
	}
	function imgConvert(){
		str.match(/(<img.+?=\"(.+?\.(jpe?g|png|eps|gif|bmp|tif+))\".+?$)/i);
		str = str.replace(RegExp.$1,"<div id=\"imgbox\"><div id=\"img\" style=\"width:imgWidthpx;height:imgHeightpx\">ここに画像</div></div>");
		str = str.replace(/imgWidth/, width);
		str = str.replace(/imgHeight/, height);
	}
	
	value = str.match(/<img.+?width=\"*(\d+)\"*/gm).length;
	
	newLine();
	size();
	imgConvert();
	
	document.getElementById("result").innerHTML = str;
	document.getElementById("resultbox2").value = str;
	
}

function LaTeX2html() {	
	//var str = document.getElementById("textbox3").value.slice(9);
	//str = str.replace(/\}/g,"");
	
    var str = document.getElementById("textbox3").value;
    //改行コードを<br>に置換
    str = str.replace(/\n/,"");
	str = str.replace(/\n/g,"<br>");
	
    //----sectionの中を抽出----
    var new_sec_str = new String();
    var res=str.match(/\\section\{/);
	sec_str = RegExp.rightContext;
	var res=sec_str.match(/\}/);
	sec_str = RegExp.leftContext;
	//htmlで書き換え
	new_sec_str += "<font size=\"5\">1　";
	new_sec_str += sec_str;
	new_sec_str += "</font>"
	new_sec_str += "<br>"
	//全体からsectionの行を消去
	var res=str.match(/\\section\{.+\}/);
	new_str = RegExp.rightContext;
	var res=str.match(/\\subsection/);
	new_str = RegExp.leftContext;
	new_str = new_str.replace(/\\section\{.+\}/,"");
	
	//----subsectionの中を抽出----
    var new_ssec_str = new String();
    var res=str.match(/\\subsection\{/);
	ssec_str = RegExp.rightContext;
	var res=ssec_str.match(/\}/);
	ssec_str = RegExp.leftContext;
	//htmlで書き換え
	new_ssec_str += "<br>"
	new_ssec_str += "<font size=\"4\">1.1　";
	new_ssec_str += ssec_str;
	new_ssec_str += "</font>"
	//全体からsubsectionの行を消去
	var res=str.match(/\\subsection\{.+\}/);
	new_sstr = RegExp.rightContext;
	var res=str.match(/\\subsubsection/);
	new_sstr = RegExp.leftContext;
	new_sstr = new_sstr.replace(/\\section\{.+\}/,"");
	new_sstr = new_sstr.replace(/\\subsection\{.+\}/,"");
	
	//----subsubsectionの中を抽出----
    var new_sssec_str = new String();
    var res=str.match(/\\subsubsection\{/);
	sssec_str = RegExp.rightContext;
	var res=sssec_str.match(/\}/);
	sssec_str = RegExp.leftContext;
	//htmlで書き換え
	new_sssec_str += "<br>"
	new_sssec_str += "<font size=\"4\">1.1.1　";
	new_sssec_str += sssec_str;
	new_sssec_str += "</font>"
	//全体からsubsubsectionの行を消去
	var res=str.match(/\\subsubsection\{.+\}/);
	new_ssstr = RegExp.rightContext;
	new_ssstr = new_ssstr.replace(/\\subsubsection\{.+\}/,"");
	
	document.getElementById("inner1").innerHTML = new_sec_str;
	document.getElementById("inner1").innerHTML += new_str;
	document.getElementById("inner1").innerHTML += new_ssec_str;
	document.getElementById("inner1").innerHTML += new_sstr;
	document.getElementById("inner1").innerHTML += new_sssec_str;
	document.getElementById("inner1").innerHTML += new_ssstr;
}

//更新時に実行される動作
window.addEventListener('load', function (){
	document.textbox2.textbox2.value = "ここに文字を入力して下さい。\n<img src=\"asdfg45tfg7ujki.jpg\" width=200 height=300>";
	
	document.textbox3.textbox3.value = "\
\\section{第1節}\n\
(」・ω・)」うー！\n\
\\subsection{第1節 第1小節}\n\
(／・ω・)／にゃー！\n\
\\subsubsection{第1節 第1小節 第1小々節}\n\
Let\'s＼(・ω・)／にゃー！";


}, false);
