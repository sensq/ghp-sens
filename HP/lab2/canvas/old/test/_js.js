// �O���t�쐬�p���C�u����
document.write('<script type="text/javascript" src="cv.js"></script>');

// CV = new CV();

/*
** �I�u�W�F�N�g�̃v���p�e�B�̈ꗗ��\������֐�
** �f�o�b�O�p
*/
function printProperties(obj, opt) {
	this.obj = obj;
	this.opt = opt || 0;
	this.properties = new String();
	// ��2������1�������alert�ŕ\�������
	if(this.opt == 1){
		for (this.prop in this.obj){
			if(this.obj[this.prop] == ''){
				this.obj[this.prop] = '����';
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
				this.obj[this.prop] = '<i>����</i>';
			}
		this.properties += "<font color='blue'><b>" + this.prop + "</b></font> =<br>" + this.obj[this.prop] + "<br><br>";
		}
		if(this.properties == ''){
			this.properties = 'Property is none.';
		}
		// �ʃy�[�W�ɕ\�������
		// �ꏊ�ɂ���Ă�FPS�\���̘g�Ȃǂ��\�������͎̂d�l
		this.newWin = window.open(this.obj, this.obj, "width=400,height=600");
		this.newWin.document.open();
		this.newWin.document.write('<title>�v���p�e�B���X�g</title>');
		this.newWin.document.write(this.properties);
		this.newWin.document.close();
	}
};

function main(){

}

/**********************
** �摜�ǂݍ��݊֘A�̃��\�b�h
***********************/

// �ǂݍ��񂾉摜��`��
function setImage(img){
	if(!document.getElementById("invisible").checked){
		CV.canvas = document.getElementById("img");
		CV.context = CV.canvas.getContext('2d');
	}else{
		CV.canvas = document.getElementById("outputImg");
		CV.context = CV.canvas.getContext('2d');
	}
	// �摜�ǂݍ���
	image = new Image();
	image.src = img;
	// �ǂݍ��ݏI����҂�
	image.onload = function() {
		// �`��̈���摜�̃T�C�Y�Ƀ��T�C�Y
		CV.width = image.width;
		CV.height = image.height;
		// �摜�`��
		CV.context.drawImage(image, 0, 0);
		// ��f�f�[�^�ǂݍ���
		input = CV.context.getImageData(0, 0, CV.width, CV.height);
		w = input.width, h = input.height;
		inputData = input.data;
		// �������p�I�u�W�F�N�g
		initialize = CV.context.getImageData(0, 0, CV.width, CV.height);
		initializeData = initialize.data;
		// �摜�ϊ��p�I�u�W�F�N�g
		output = CV.context.createImageData(CV.width, CV.height);
		outputData = output.data;
		// CV.create(CV., CV.context);
		CV.hist(input, output);
	}
}

// �摜��ǂݍ���
function loadImg(){
	if (document.getElementById('loadImg').files[0].type.match('image.*')) {
		var img = document.getElementById('loadImg').files[0];
		var info = "name:" + img.name + " size:" + img.size;
		document.getElementById('list').innerHTML = info;
		var fr = new FileReader();
		// �ǂݍ��ݏI����҂�
		fr.onload = function onFileLoad(e) {
			setImage(e.target.result);
		 	CV.init();
		}
		fr.readAsDataURL(img);
	}else{
		alert("�摜�t�@�C�����w�肵�ĉ�����");
	}
}

// �h���b�O���h���b�v�œǂݍ���
function onDropFile(e){
	e.preventDefault();
	var img = e.dataTransfer.files[0];
	if (img.type.match('image.*')) {
		var fr = new FileReader();
		// �ǂݍ��ݏI����҂�
		fr.onload = function onFileLoad(e) {
			setImage(e.target.result);
		 	CV.init();
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

window.addEventListener('load', function (){
	// �h���b�O���h���b�v�ɑΉ�
	document.getElementById('img').addEventListener("dragover", onCancel, false);
	document.getElementById('img').addEventListener("dragenter", onCancel, false);
	document.getElementById('img').addEventListener("drop", onDropFile, false);
	document.getElementById('outputImg').addEventListener("dragover", onCancel, false);
	document.getElementById('outputImg').addEventListener("dragenter", onCancel, false);
	document.getElementById('outputImg').addEventListener("drop", onDropFile, false);

	// �f�t�H���g�摜
	setImage("torusknot_19_16.png");

	// �e�f�t�H���g�l
	document.getElementById('course').value = 8;
	document.getElementById("gammaValue").value = 2.2;
	document.getElementById('rate').value = 75;
	document.getElementById('brightValue').value = 150;
	document.getElementById('opacity').value = 245;
	document.getElementById('theta').value = 45;

	// HSV
	document.getElementById('hueValue').value = 60;
	document.getElementById('satValue').value = 5;
	document.getElementById('volValue').value = 5;

	// �F���o�p
	document.getElementById('hueStart').value = 180;
	document.getElementById('hueEnd').value = 300;
	document.getElementById('satStart').value = 127;
	document.getElementById('satEnd').value = 255;
	document.getElementById('volStart').value = 100;
	document.getElementById('volEnd').value = 255;
	document.getElementById('convValue').value = 150;

	document.getElementById("invisible").checked = false;
	document.getElementById("copy").checked = true;
}, false);
