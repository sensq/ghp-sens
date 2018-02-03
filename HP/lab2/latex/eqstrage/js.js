function LaTeX() {
	//dpi���擾
	var dpi = new String();
	dpi += "\\dpi{";
	dpi += document.sizebox.sizebox.value;
	dpi += "}";
	
	//URL���쐬
	var url = new String();
	url += "http://latex.codecogs.com/png.latex?";
	url += dpi;
	url += document.textbox.textbox.value;
	
	//�摜�ƃ����N�̃^�O�t��
	var strlatex = new String();
	strlatex += "<a target=\"blank\" href=\"";
	strlatex += url;
	strlatex += "\">";
	strlatex += "<img src=\"";
	strlatex += url;
	strlatex += "\">";
	strlatex += "</a>";
	
	document.getElementById("imgEq").innerHTML = strlatex;
}

// �����N���X
EqSample = function(){};
// ���w
EqSample.diff = function(){
	document.textbox.textbox.value = "\\frac{d}{dx}f(x)=\\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x)-f(x)}{\\Delta x}";
	LaTeX();
}
EqSample.matrix = function(){
	document.textbox.textbox.value = "\\begin{bmatrix}\n\
a_{11} & a_{12} & \\ldots & a_{1n}\\\\ \n\
a_{21} & a_{22} & \\ldots & a_{2n}\\\\ \n\
\\vdots & \\vdots & \\ddots & \\vdots\\\\ \n\
a_{m1} & a_{m2} & \\ldots & a_{mn}\n\
\\end{bmatrix}";
	LaTeX();
}
EqSample.euler = function(){
	document.textbox.textbox.value = "e^{i\\omega t}=\\cos\\omega t+i\\sin\\omega t";
	LaTeX();
}
EqSample.eulerInt = function(){
	document.textbox.textbox.value = "\\int _{-\\infty }^{\\infty }e^{-ax^{2}}dx=\\sqrt {\\dfrac {\\pi } {a}}";
	LaTeX();
}
EqSample.laplace = function(){
	document.textbox.textbox.value = "\\displaystyle\\mathcal{L}[f(t)]=\\int^{\\infty}_{-\\infty}f(t)e^{-st}dt";
	LaTeX();
}
EqSample.fourier = function(){
	document.textbox.textbox.value = "\\displaystyle\\mathcal{F}[f(t)]=\\int^{\\infty}_{-\\infty}f(t)e^{-i\\omega t}dt";
	LaTeX();
}

// ����
EqSample.maxwell = function(){
	document.textbox.textbox.value = "\\begin{cases}\n\
\\nabla\\cdot \\textbf{\\textit{D}} = \\rho\\\\ \n\
\\nabla\\times \\textbf{\\textit{E}} = -\\dfrac{\\mathrm{\\partial}\\textbf{\\textit{B}} }{\\mathrm{\\partial}t} & \\\\ \n\
\\nabla\\cdot \\textbf{\\textit{B}} = 0 & \\\\ \n\
\\nabla\\times \\textbf{\\textit{H}} = \\textbf{\\textit{j}}+\\dfrac{\\mathrm{\\partial}\\textbf{\\textit{D}} }{\\mathrm{\\partial}t}& \n\
\\end{cases}";
	LaTeX();
}
EqSample.Schrodinger = function(){
	document.textbox.textbox.value = "\\mathcal{H}\\Psi=E\\Psi";
	LaTeX();
}
EqSample.SchrodingerNoTime = function(){
	document.textbox.textbox.value = "\\left( -\\dfrac {\\hbar^{2}} {2m}\\dfrac {\\partial ^{2}} {\\partial x^{2}}+V\\right)\\psi=E\\psi";
	LaTeX();
}
EqSample.SchrodingerTime = function(){
	document.textbox.textbox.value = "i\\hbar\\frac{\\partial\\psi}{\\partial t}=\\left(-\\frac{\\hbar}{2m}\\frac{\\partial^{2}}{\\partial x^{2}}+V\\right)\\psi";
	LaTeX();
}
EqSample.hydrogen = function(){
	document.textbox.textbox.value = "\\psi(r,\\theta,\\phi)=-(-1)^{\\frac{m+|m|}{2}}\\frac{1}{\\sqrt{2\\pi}}\\left(\\frac{2}{na_{0}}\\right)^{\\frac{3}{2}}\\sqrt{\\left(l+\\frac{1}{2}\\right)\\frac{(n-l-1)!}{2n\\{(n+l)!\\}^3}\\frac{(l-|m|)!}{(l+|m|)!}}\\left\\{r^l\\exp\\left(-\\frac{r}{na_{0}}\\right)L^{2l+1}_{na_{0}}\\left(\\frac{2r}{na_{0}}\\right)\\right\\}P^m_l(\\cos\\theta)\\exp(im\\phi)";
	LaTeX();
}

// ���w�̐���
var math = [
"","�����̒�`","�s��","�I�C���[�̌���","�I�C���[�̐ϕ�����","���v���X�ϊ�","�t�[���G�ϊ�",
];

// �����̐���
var physics = [
"","�}�N�X�E�F��������","�V�����[�f�B���K�[������","���Ԉˑ����Ȃ��V�����[�f�B���K�[������","���Ԉˑ��̃V�����[�f�B���K�[�������iTDSE�j","���f���q�ɂ�����d�q�̔g���֐�",
];

function selectEq(s){
	if(document.selbox.category.selectedIndex == 1)
		mathEq(s);
	else if(document.selbox.category.selectedIndex == 2)
		physicsEq(s);
}

// �Z���N�g�{�b�N�X�̃C�x���g�i���w�j
function mathEq(s){
	switch(s.selectedIndex) {
		case 1:
			EqSample.diff();
		break;
		case 2:
			EqSample.matrix();
		break;
		case 3:
			EqSample.euler();
		break;
		case 4:
			EqSample.eulerInt();
		break;
		case 5:
			EqSample.laplace();
		break;
		case 6:
			EqSample.fourier();
		break;
	}
}

// �Z���N�g�{�b�N�X�̃C�x���g�i�����j
function physicsEq(s){
	switch(s.selectedIndex) {
		case 1:
			EqSample.maxwell();
		break;
		case 2:
			EqSample.Schrodinger();
		break;
		case 3:
			EqSample.SchrodingerNoTime();
		break;
		case 4:
			EqSample.SchrodingerTime();
		break;
		case 5:
			EqSample.hydrogen();
		break;
	}
}

function categorySet(){
	//�I�v�V�����^�O��A�����ď���������
	var length = math.length;
	if(physics.length > math.length)
		length = physics.length;

 	for (var i=1; i<length; i++){
		switch (document.selbox.category.selectedIndex){
		case 0:
			document.selbox.equation.options[i].text = "";
		break;
		case 1:
			document.selbox.equation.options[i].text = math[i];
		break;
		case 2:
			document.selbox.equation.options[i].text = physics[i];
		break;
		}
	}
	document.selbox.equation.selectedIndex = 0;
}

//�X�V���Ɏ��s����铮��
window.addEventListener('load', function (){
	document.selbox.category.selectedIndex = 0;
	document.selbox.equation.selectedIndex = 0;

	document.textbox.textbox.value = "\\int_{0}^{\\pi}\\frac{x^{4}\\left(1-x\\right)^{4}}{1+x^{2}}dx = \\frac{22}{7}-\\pi";
	document.sizebox.sizebox.value = "150";
	document.sizebox.sizebox.focus();
	LaTeX();
}, false);
