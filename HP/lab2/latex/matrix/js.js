var init = true;
var bracket = new String("pmatrix");

// �摜�̎擾
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

// �s���Ɨ񐔂��w�肵�Č����̃{�b�N�X���쐬
function createMatrix(){
	var row = document.getElementById('row').value;
	var col = document.getElementById('col').value;
	document.getElementById("matrix").innerHTML = '';

	for(var j=0; j<row; j++){
		for(var i=0; i<col; i++){
			document.getElementById("matrix").innerHTML += '<input type="text" size="6" id="element' + i + j + '" onKeyup="createMatrixEq();"> ';
		}
		document.getElementById("matrix").innerHTML += '<br>';
	}
	init = true;
	createMatrixEq();
}

// �e�{�b�N�X�̒l����TeX�p�̃e�L�X�g���쐬
function createMatrixEq(){
	var row = document.getElementById('row').value;
	var col = document.getElementById('col').value;
	var id = "element";

    // �e�L�X�g�J���[���擾
	var color = new String();
	color += "{\\color[rgb]{";
	color += document.setColor.setColor.value;
	color += "}\n";

	document.textbox.textbox.value = color;
	document.textbox.textbox.value += "\\begin{" + bracket + "}\n";

	for(var j=0; j<row; j++){
		for(var i=0; i<col; i++){
			// �v�fID���쐬
			id = id + i + j;
			// �e�L�X�g�l��������
			if(init){
				document.getElementById(id).value = "a_{" + i + j + "}";
			}
			// TeX�̓��̓{�b�N�X�ɗv�f�����
			document.textbox.textbox.value += document.getElementById(id).value;
			// �ŏI��Ȃ���s�A�����łȂ��Ȃ���ǉ�
			if(i == (col-1)){
				document.textbox.textbox.value += "\\\\ \n";
			}else{
				document.textbox.textbox.value += " & ";
			}
			// ������
			id = "element";
		}
	}
	document.textbox.textbox.value += "\\end{" + bracket + "}\n";
    // �J���[�̕�����
	document.textbox.textbox.value += "}";
	init = false;
	LaTeX();
}

// ���ʂ�I��
function selectBracket(s) {
    switch (s.selectedIndex) {
        case 0:
            bracket = "bmatrix";
            break;
        case 1:
            bracket = "pmatrix";
            break;
        case 2:
            bracket = "vmatrix";
            break;
        case 3:
            bracket = "matrix";
            break;
    }
    init = false;
    createMatrixEq();
}

//�X�V���Ɏ��s����铮��
window.addEventListener('load', function (){
	document.getElementById('row').value = 4;
	document.getElementById('col').value = 4;
	document.sizebox.sizebox.value = "200";
	document.sizebox.sizebox.focus();
	document.setColor.setColor.value = "0.0, 0.0, 0.0";
	createMatrix();
	createMatrixEq();
}, false);
