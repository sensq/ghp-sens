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
		str = str.replace(RegExp.$1,"<div id=\"imgbox\"><div id=\"img\" style=\"width:imgWidthpx;height:imgHeightpx\">�����ɉ摜</div></div>");
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
    //���s�R�[�h��<br>�ɒu��
    str = str.replace(/\n/,"");
	str = str.replace(/\n/g,"<br>");
	
    //----section�̒��𒊏o----
    var new_sec_str = new String();
    var res=str.match(/\\section\{/);
	sec_str = RegExp.rightContext;
	var res=sec_str.match(/\}/);
	sec_str = RegExp.leftContext;
	//html�ŏ�������
	new_sec_str += "<font size=\"5\">1�@";
	new_sec_str += sec_str;
	new_sec_str += "</font>"
	new_sec_str += "<br>"
	//�S�̂���section�̍s������
	var res=str.match(/\\section\{.+\}/);
	new_str = RegExp.rightContext;
	var res=str.match(/\\subsection/);
	new_str = RegExp.leftContext;
	new_str = new_str.replace(/\\section\{.+\}/,"");
	
	//----subsection�̒��𒊏o----
    var new_ssec_str = new String();
    var res=str.match(/\\subsection\{/);
	ssec_str = RegExp.rightContext;
	var res=ssec_str.match(/\}/);
	ssec_str = RegExp.leftContext;
	//html�ŏ�������
	new_ssec_str += "<br>"
	new_ssec_str += "<font size=\"4\">1.1�@";
	new_ssec_str += ssec_str;
	new_ssec_str += "</font>"
	//�S�̂���subsection�̍s������
	var res=str.match(/\\subsection\{.+\}/);
	new_sstr = RegExp.rightContext;
	var res=str.match(/\\subsubsection/);
	new_sstr = RegExp.leftContext;
	new_sstr = new_sstr.replace(/\\section\{.+\}/,"");
	new_sstr = new_sstr.replace(/\\subsection\{.+\}/,"");
	
	//----subsubsection�̒��𒊏o----
    var new_sssec_str = new String();
    var res=str.match(/\\subsubsection\{/);
	sssec_str = RegExp.rightContext;
	var res=sssec_str.match(/\}/);
	sssec_str = RegExp.leftContext;
	//html�ŏ�������
	new_sssec_str += "<br>"
	new_sssec_str += "<font size=\"4\">1.1.1�@";
	new_sssec_str += sssec_str;
	new_sssec_str += "</font>"
	//�S�̂���subsubsection�̍s������
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

//�X�V���Ɏ��s����铮��
window.addEventListener('load', function (){
	document.textbox2.textbox2.value = "�����ɕ�������͂��ĉ������B\n<img src=\"asdfg45tfg7ujki.jpg\" width=200 height=300>";
	
	document.textbox3.textbox3.value = "\
\\section{��1��}\n\
(�v�E�ցE)�v���[�I\n\
\\subsection{��1�� ��1����}\n\
(�^�E�ցE)�^�ɂ�[�I\n\
\\subsubsection{��1�� ��1���� ��1���X��}\n\
Let\'s�_(�E�ցE)�^�ɂ�[�I";


}, false);
