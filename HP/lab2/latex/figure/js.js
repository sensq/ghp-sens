function LaTeX(imgName, width, height){
	var folder = document.getElementById('folder').value;
	var caption = document.getElementById('caption').value;
	var label = document.getElementById('label').value;
	var vertical = document.getElementById('vertical').value;
	var scale = document.getElementById('scale').value;

	document.textbox.textbox.value = "\\begin{figure}[htbp]\n";
	document.textbox.textbox.value += "	\\centering\n";
	document.textbox.textbox.value += "	\\vspace{" + vertical + "mm}\n";
	document.textbox.textbox.value += "	\\includegraphics[bb=0 0 " + width + " " + height + ",scale=" + scale + "]{" + folder + "./" + imgName + "}\n";
	document.textbox.textbox.value += "	\\caption{" + caption + "}\n";
	document.textbox.textbox.value += "	\\label{" + label + "}\n";
	document.textbox.textbox.value += "\\end{figure}";
}

// �摜�̓ǂݍ���
function onDropFile(e){
	e.preventDefault();
	var img = e.dataTransfer.files[0];
	if (img.type.match('image.*')) {
		var fr = new FileReader();
		// �ǂݍ��ݏI����҂�
		fr.onload = function onFileLoad(e) {
			var figure = new Image();
			figure.src = e.target.result;
			figure.onload = function(){
				LaTeX(img.name, figure.width, figure.height);
			}
		}
		fr.readAsDataURL(img);
	}else{
		alert("�摜�t�@�C�����w�肵�ĉ�����");
	}
}

 // �f�t�H���g�������L�����Z��
function�@onCancel(e){
	if(e.preventDefault){
		e.preventDefault();
	}
	return false;
};

//�X�V���Ɏ��s����铮��
window.addEventListener('load', function (){
	document.getElementById('folder').value = "";
	document.getElementById('caption').value = "�L���v�V����";
	document.getElementById('label').value = "fig1";
	document.getElementById('scale').value = "1.0";
	document.getElementById('vertical').value = 0;
	document.getElementById('textbox').addEventListener("dragover", onCancel, false);
	document.getElementById('textbox').addEventListener("dragenter", onCancel, false);
	document.getElementById('textbox').addEventListener("drop", onDropFile, false);
}, false);
