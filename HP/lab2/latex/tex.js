function LaTeX() {
	//dpi���擾
	var dpi = new String();
	dpi += "\\dpi{";
	dpi += document.sizebox1.sizebox1.value;
	dpi += "}";
	
	//URL���쐬
	var url = new String();
	url += "http://latex.codecogs.com/png.latex?";
	url += dpi;
	url += document.textbox1.textbox1.value;
	
	//�摜�ƃ����N�̃^�O�t��
	var strlatex = new String();
	strlatex += "<a target=\"blank\" href=\"";
	strlatex += url;
	strlatex += "\">";
	strlatex += "<img src=\"";
	strlatex += url;
	strlatex += "\">";
	strlatex += "</a>";
	
	document.getElementById("inner1").innerHTML = strlatex;
}

function subLaTeX(){
	//dpi���擾
	var dpi = new String();
	dpi += "\\dpi{";
	dpi += document.sizebox2.sizebox2.value;
	dpi += "}";
	
	//URL���쐬
	var url = new String();
	url += "http://latex.codecogs.com/png.latex?";
	url += dpi;
	url += document.textbox2.textbox2.value;
	
	//�摜�ƃ����N�̃^�O�t��
	var strlatex = new String();
	strlatex += "<a target=\"blank\" href=\"";
	strlatex += url;
	strlatex += "\">";
	strlatex += "<img src=\"";
	strlatex += url;
	strlatex += "\">";
	strlatex += "</a>";
	
	document.getElementById("inner2").innerHTML = strlatex;
}

//�X�V���Ɏ��s����铮��
window.addEventListener('load', function (){
	document.textbox1.textbox1.value = "\\int_{0}^{\\pi}\\frac{x^{4}\\left(1-x\\right)^{4}}{1+x^{2}}dx = \\frac{22}{7}-\\pi";
	document.sizebox1.sizebox1.value = "150";
	document.sizebox1.sizebox1.focus();
	LaTeX();
	
	document.textbox2.textbox2.value = "\\int_{0}^{\\pi}\\frac{x^{4}\\left(1-x\\right)^{4}}{1+x^{2}}dx";
	document.sizebox2.sizebox2.value = "150";
	subLaTeX();
}, false);
